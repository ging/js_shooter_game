const fs = require('fs').promises;
const fsWithoutPromises = require('fs'); // needed because fs.createWriteStream is not a function in fs promisified
const crypto = require('crypto');
const objectHash = require('object-hash');
const readline = require('readline');
const path = require("path");
const chalk = require('chalk');
const archiver = require('archiver');
const Octokit = require("@octokit/rest");
const needle = require("needle");
const Mocha = require("mocha");

const CONFIG = require("../package.json");

const Utils = {};

const error = chalk.bold.bgRed;
const info = chalk.bold.green;
const ask = chalk.bold.bgCyan;
const finalInfo = chalk.bold.bgYellow;

const HISTORY_FILE = "history.json";

Utils.debug = (...args) => {
  if(CONFIG.debug){
    console.log(...args);
  }
}


Utils.checkFileExists = (filepath) => {
  Utils.debug("checkFileExists", filepath);
  return new Promise(async (resolve, reject) => {
    try {
      await fs.access(filepath, fs.F_OK);
      resolve(true);
    } catch (err) {
      resolve(false);
    }
  });
}


Utils.getEmailAndToken = async (user_file_path) => {
  Utils.debug("getEmailAndToken", user_file_path);
  let user_info = {};
  if(await Utils.checkFileExists(path.resolve(__dirname, user_file_path))) {
      user_info = JSON.parse(await fs.readFile(path.resolve(__dirname, user_file_path)));

      if(user_info.email.endsWith("upm.es")){
        return Promise.resolve(user_info);
      } else {
        return Promise.reject("FILE WITH INFO USER DOES NOT CONTAIN A VALID EMAIL. It should end with upm.es");
      }
  } else {
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    return new Promise(function(resolve, reject) {
      rl.question(info('Escribe tu email de alumno por favor: '), function(answer) {
        user_info.email = answer;
        rl.question(info('Escribe tu token de moodle por favor: '), (answer2) => {
          user_info.token = answer2;
          if(user_info.email.endsWith("upm.es")){
            rl.question(ask('¿Desea generar el fichero user.json con estos datos? (y/N): '), function(answer) {
              if(answer==="y" || answer ==="yes"){
                fs.writeFile(path.resolve(__dirname, user_file_path), JSON.stringify(user_info, null, 4), function(err) {
                    if (err) {
                        console.log(error(err));
                        reject("NO SE HA PODIDO CREAR EL FICHERO");
                    }
                    rl.close();
                    resolve(user_info, reject);
                });
              } else {
                rl.close();
                resolve(user_info, reject);
              }
            });
          } else {
            rl.close();
            reject("USER INFO DOES NOT CONTAIN A VALID EMAIL. It should end with upm.es");
          }
        });
      });
    });
  }
};


Utils.getHashFile = (file_path) => {
  Utils.debug("getHashFile", file_path);
  let fd = fsWithoutPromises.createReadStream(path.resolve(__dirname, file_path));
  let hash = crypto.createHash('md5');
  hash.setEncoding('hex');

  return new Promise(function(resolve, reject) {
    fd.on('end', function() {
      hash.end();
      resolve(hash.read(), reject); // the desired md5
    });
    // read all file and pipe it (write it) to the hash object
    fd.pipe(hash);
  });
}


Utils.getHashMultipleFiles = async (file_paths_array) => {
  Utils.debug("getHashMultipleFiles",file_paths_array);
  //first we get the files as a string
  let files_content = "";
  for (var i = 0; i < file_paths_array.length; i++) {
    files_content += await fs.readFile(path.resolve(__dirname, file_paths_array[i]), "utf8");
  }

  let md5hash = crypto.createHash('md5').update(files_content).digest("hex");
  return md5hash;
}


Utils.getSignature = (user_info) => {
  Utils.debug("getSignature");
  //return objectHash.MD5(user_info);
  //let hash = crypto.createHash('md5');
  //hash.setEncoding('hex');
  //let md5 = hash.update(JSON.stringify(user_info)).digest("hex");
  //return md5;
  let pepper = "new JSON(";
  let hash = crypto.createHmac('sha512', pepper);
  let hashed_code = hash.update(JSON.stringify(user_info)).digest('hex');
  return hashed_code;
}


Utils.askForConsent = (user_info)=>{
  Utils.debug("askForConsent", user_info);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(function(resolve, reject) {
    console.log(info(`Los datos con los que se va a firmar la práctica son, email: ${user_info.email}, token: ${user_info.token}`));

    rl.question(ask('¿Son correctos? (y/N): '), function(answer) {
      if(answer!=="y" && answer !=="yes"){
        resolve(false, reject);
        return;
      } else {
        console.log(info(`El contenido de la práctica, así como los test que se le pasan y todos los ficheros van a ser firmados.`));
        console.log(info(`Es importante que sepa que se van a enviar al servidor y en él se validará la firma y la autenticidad, así como se pasará un anticopia.`));
        rl.question(ask('¿Confirma que ha realizado usted mismo la práctica y desea enviarla al servidor para registrar la nota? (y/N):'), (answer2) => {
          if(answer2!=="y" && answer2 !=="yes"){
            resolve(false, reject);
          } else {
            resolve(true, reject);
          }
          rl.close();
        });
      }//end of else case
    });
  });
}


Utils.compress = async (outputFilename) => {
  Utils.debug("compress",outputFilename);
  const archive = archiver('zip', { zlib: { level: 9 }});
  const output = fsWithoutPromises.createWriteStream(path.resolve(__dirname, outputFilename));
  return new Promise((resolve, reject) => {
     archive.glob('*', {"ignore": ['node_modules', 'tests', 'scripts', 'README.md', 'LICENSE', '*.zip']});
     archive.on('error', err => reject(err))
     archive.pipe(output);

     output.on('close', () => {
       resolve();
     });
     archive.finalize();
   });
}


/*fullrepo is the repo with owner, for example "ebarra/autoCOREctor_client" */
/*jsonPath is the path to the json file inside the repository */
Utils.checkTestVersion = async (fullrepo, jsonPath) => {
  Utils.debug("checkTestVersion",fullrepo, jsonPath);
  const octokit = new Octokit();
  [owner, repo] = fullrepo.split("/");
  return octokit.repos.getContents({
    owner: owner,
    repo: repo,
    path: jsonPath
  }).then(result => {
      // content will be base64 encoded
      const content = Buffer.from(result.data.content, 'base64').toString()
      let config = JSON.parse(content);
      return config.version;
    }).catch(err=>{
      Utils.debug(err);
      return "*";
    })
}


Utils.encryptBufferWithRsaPublicKey = async (toEncrypt, pathToPublicKey) => {
    Utils.debug("encryptBufferWithRsaPublicKey");
    var publicKey = await fs.readFile(path.resolve(__dirname, pathToPublicKey), "utf8");
    var buffer = Buffer.from(toEncrypt);
    var encrypted = crypto.publicEncrypt({key: publicKey, padding: crypto.constants.RSA_NO_PADDING}, buffer);
    return encrypted.toString("base64");
};


//created following https://medium.com/@anned20/encrypting-files-with-nodejs-a54a0736a50a
Utils.encryptAES = (toEncrypt, key) => {
    Utils.debug("encryptAES");
    // Create an initialization vector
    const algorithm = 'aes-256-ctr';
    let newkey = crypto.createHash('sha256').update(key).digest('base64').substr(0, 32);
    const iv = crypto.randomBytes(16);
    // Create a new cipher using the algorithm, key, and iv
    const cipher = crypto.createCipheriv(algorithm, newkey, iv);
    // Create the new (encrypted) buffer
    let buffer = Buffer.from(toEncrypt);
    const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
    return result.toString('hex');
};


Utils.sendFile = async (url, file) => {
  Utils.debug("sendFile", url, file);

  const data = {
      "submission": {
          "file": path.resolve(__dirname, file),
          "filename": "submission.zip",
          "content_type": "application/zip"
      }
  };
  needle.post(
      url,
      data,
      {"multipart": true, "accept": "application/json"},
      function (err, response) {
          if (!err && response.statusCode === 200) {
              Utils.debug(info(response.body || "Ok"));
              Utils.cleanHistoryRecords();
          } else {
            console.log("ERROR");
            console.error(err || response.body || "Error");
          }
      }
  );
};


Utils.execTests = (assignment_path) => {
  Utils.debug("execTests", assignment_path);
  return new Promise((resolve, reject) => {
    let fullScore = {score: 0, score_total: 0};
    new Mocha({
      timeout: 60 * 1000,
      reporter: function () { }
    })
    .addFile(path.resolve(__dirname, assignment_path))
    .run()
    .on('pass', function (test) {
      fullScore.score += test.ctx.score;
      fullScore.score_total += test.ctx.score;
      console.log(`\nTest: ${test.ctx.name}\n\tScore: ${test.ctx.score}/${test.ctx.score}\n\tRemarks: ${test.ctx.msg_ok}`);
    })
    .on('fail', function (test, err) {
      if ((test.title.indexOf('"after all" hook')<0) && (test.title.indexOf('"before all" hook')<0)) {
        fullScore.score_total += test.ctx.score;
        console.log(`\nTest: ${test.ctx.name}\n\tScore: 0/${test.ctx.score}\n\tRemarks: ${test.ctx.msg_err}\n`);
      } else {
        console.error("Launcher Error: " + err);
      }
    })
    .on('end', function () {
      resolve(fullScore);
    });
  });
}

Utils.initHistory = async () => {
  Utils.debug("INITHISTORY");
  let history = [];
  let first_history_entry = {};
  const stats = await fs.stat("package.json");
  first_history_entry.started = true;
  first_history_entry.datetime = stats.mtime;
  history.push(first_history_entry);
  return history;
}

Utils.saveHistoryRecord = async (fullScore, version) => {
  Utils.debug("saveHistoryRecord", fullScore, version);
  let history;
  if(!await Utils.checkFileExists(path.resolve(__dirname, HISTORY_FILE))) {
    history = await Utils.initHistory();
  } else {
    try {
      history = JSON.parse(await fs.readFile(path.resolve(__dirname, HISTORY_FILE)));

    } catch(err){
      Utils.debug("ERROR Recuperable: ", error(err));
      history = await Utils.initHistory();
    }
  }
  let new_history_entry = {started: false, datetime: new Date(), score: fullScore.score, score_total: fullScore.score_total, version: version};
  history.push(new_history_entry);
  return fs.writeFile(path.resolve(__dirname, HISTORY_FILE), JSON.stringify(history, null, 4), 'utf8').then((res)=>{
    return Promise.resolve(history);
  }).catch((err)=>{
    console.log(error(err));
    return Promise.reject(err);
  });
};


Utils.cleanHistoryRecords = async () => {
  Utils.debug("cleanHistoryRecords");
  if(await Utils.checkFileExists(path.resolve(__dirname, HISTORY_FILE))) {
    let old_history = JSON.parse(await fs.readFile(path.resolve(__dirname, HISTORY_FILE)));
    let new_history = [old_history[0]];
    return fs.writeFile(path.resolve(__dirname, HISTORY_FILE), JSON.stringify(new_history, null,4), 'utf8');
  }
};

module.exports = Utils;
