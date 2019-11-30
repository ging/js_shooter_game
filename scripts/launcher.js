const fs = require('fs').promises;;
const path = require("path");
const chalk = require('chalk');
const Utils = require('./utils');

const CONFIG = require("../package.json");
const ASSIGNMENT_PATH = "../tests/tests.js";
const LAUNCHER_PATH = "./launcher.js";
const USER_FILE_PATH = "../user.json";
const OUTPUT_FILE = "../result.enc";
const ZIP_FILE = "../assignment.zip";

const error = chalk.bold.bgRed;
const info = chalk.bold.green;
const ask = chalk.bold.bgCyan;
const finalInfo = chalk.bold.bgYellow;

const autoCOREctorURL = CONFIG.info.serverUrl + 'api/course/' + CONFIG.info.courseId + '/assignment/' + CONFIG.info.assignmentId;
const githubURL = CONFIG.info.githubURL;

//FETCH latest version from github for this tests and check
Utils.checkTestVersion(githubURL, "package.json").then(async (res)=>{
    if (res!==CONFIG.version){
        console.log(error("No tienes la última versión de los TESTs. Debes actualizar el repositorio."));
        console.log(info("Si has utilizado git para bajártelo tan solo tendrás que hacer git pull, si no has usado git vuelve a bajarte el repo completo y sustituye la carpeta tests, carpeta scripts y fichero package.json por la última versión."));
        process.exit(0);
    }
    try {
        let user_info = await Utils.getEmailAndToken(USER_FILE_PATH);
        let consent = await Utils.askForConsent(user_info);
        if (!consent){
          console.log(error("Rellene correctamente sus datos y asegurese de haber hecho usted la práctica que va a subir al servidor."));
          process.exit(0);
        }
        let fullScore = await Utils.execTests(ASSIGNMENT_PATH);
        let history = await Utils.saveHistoryRecord(fullScore, CONFIG.version);
        console.log(finalInfo(`Final Result: ${fullScore.score}/${fullScore.score_total}\n\n`));

        if(process.argv.length>2 && process.argv[2]==="upload"){
          user_info.score = fullScore.score;
          user_info.score_total = fullScore.score_total;
          user_info.test_version = CONFIG.version;
          user_info.history = history;
          user_info.hash_files = await Utils.getHashMultipleFiles([ASSIGNMENT_PATH, LAUNCHER_PATH]);
          let user_info_clon = JSON.parse(JSON.stringify(user_info))
          user_info.signature = Utils.getSignature(user_info_clon);
          console.log("RESULTS: ", user_info); //TODO remove in final version
          let result_data = Utils.encryptAES(JSON.stringify(user_info, null, 4), 'pubkey.pem');
          await fs.writeFile(path.resolve(__dirname, OUTPUT_FILE), result_data);
          //compress files in zip to send to moodle the assignment
          await Utils.compress(ZIP_FILE);
          await Utils.sendFile(autoCOREctorURL, ZIP_FILE);
          console.log("The END!");
        } 
        process.exit(0);
    } catch (err){
        console.log(error(err));
        process.exit(0);
    }
}).catch((err)=>{
  console.log(error(err));
        process.exit(0);
});
