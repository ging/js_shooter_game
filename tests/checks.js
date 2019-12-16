// IMPORTS
const path = require('path');
const Utils = require('./testutils');

// CRITICAL ERRORS
let error_critical = null;

// CONSTANTS
const T_TEST = 2 * 60; // Time between tests (seconds)
const browser = new Browser({waitDuration: 100});
const path_assignment = path.resolve(path.join(__dirname, "../index.html"));
const URL = "file://"+path_assignment.replace("%", "%25");

const to = function to(promise) {
    return promise
        .then(data => {
            return [null, data];
        })
        .catch(err => [err]);
}; 

//TESTS
describe("MOOC_game", function () {

    this.timeout(T_TEST * 1000);

    it('', async function () {
        this.name = `1(Precheck): Checking that the assignment file exists...`;
        this.score = 0;
        this.msg_ok = `Found the file '${path_assignment}'`;
        this.msg_err = `Couldn't find the file '${path_assignment}'`;
        const [error_path, path_ok] = await Utils.checkFileExists(fs.pathExists(path_assignment));
        if (error_path) {
            error_critical = this.msg_err;
        }
        should.not.exist(error_critical);
    });

    it('', async function () {
        this.name = `2(Precheck): Checking that the assignment file contains valid html...`;
        this.score = 0;
        if (error_critical) {
            this.msg_err = error_critical;

        } else {
            this.msg_ok = `'${path_assignment}' has been parsed correctly`;
            this.msg_err = `Error parsing '${path_assignment}'`;
            [error_nav, resp] = await to(browser.visit(URL));
            if (error_nav) {
                this.msg_err = `Error parsing '${path_assignment}': ${error_nav}`;
                error_critical = this.msg_err;
            }
        }
        should.not.exist(error_critical);
    });

    it('', async function () {
        this.name = `3(Precheck): Checking 'Game' instance...`;
        this.score = 0;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_nav, resp] = await to(browser.visit(URL));
            if (error_nav) {
                this.msg_err = `Couldn't find '${expected}' in ${path_assignment}\nError:${error_nav}\nReceived:${browser.text('body')}`;
            }
            this.msg_ok = `Found game instance`;
            this.msg_err = `Game is not started`;
            browser.window.game.started.should.be.equal(true);
        }
    });

    it('', async function () {
        this.name = `4: Checking 'Score' element exists...`;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_nav, resp] = await to(browser.visit(URL));
            const scoreli = browser.html("li#scoreli");
            this.msg_ok = "Found score"
            this.msg_err = `List element with id "scoreli" contained ${ scoreli || "nothing"} instead of the score in the format specified in the task assignment`;
            Boolean(scoreli.match(/Score: ?\d+/)).should.be.equal(true);
        }
    });

    it('', async function () {
        this.name = `5: Checking 'Lives' element exists...`;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_nav, resp] = await to(browser.visit(URL));
            const livesli = browser.html("li#livesli");
            this.msg_ok = "Found lives"
            this.msg_err = `List element with id "livesli" contained ${ livesli || "nothing"} instead of the lives in the format specified in the task assignment`;
            Boolean(livesli.match(/Lives: ?\d+/)).should.be.equal(true);
        }
    });

    it('', async function () {
        this.name = `6: Checking 'Score' works...`;
        this.score = 1.5;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_nav, resp] = await to(browser.visit(URL));
            const scoreInitial = parseInt(browser.html("li#scoreli").match(/Score: ?(\d+)/)[1]);
            const { game } = browser.window;
            game.opponent.die();
            await browser.wait({ duration: 2500 });
            const scoreFinal = parseInt(browser.html("li#scoreli").match(/Score: ?(\d+)/)[1]);
            this.msg_ok = "Score increased after shooting opponent";
            this.msg_err = "Score did not increase after shooting opponent";
            scoreFinal.should.be.equal(scoreInitial + 1);
        }
    });


    it('', async function () {
        this.name = `7: Checking 'Lives' works...`;
        this.score = 1.5;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_nav, resp] = await to(browser.visit(URL));

            const livesInitial = parseInt(browser.html("li#livesli").match(/Lives: ?(\d+)/)[1]);
            const { game } = browser.window;
            game.player.die();
            await browser.wait({ duration: 1000 });
            this.msg_ok = "Player lost a life after being shot";
            this.msg_err = "Player did not lose a life after being shot"
            const livesFinal = parseInt(browser.html("li#livesli").match(/Lives: ?(\d+)/)[1]);
            livesInitial.should.be.equal(livesFinal + 1);
        }
    });

    it('', async function () {
        this.name = `8: Checking Boss appears after opponent dies...`;
        this.score = 2.5;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_nav, resp] = await to(browser.visit(URL));

            const livesInitial = parseInt(browser.html("li#livesli").match(/Lives: ?(\d+)/)[1]);
            const { game } = browser.window;
            game.opponent.die();
            await browser.wait({ duration: 3000 });
            this.msg_ok = "Boss shows up after opponent is killed";
            this.msg_err = "Boss does not show up after opponent is killed";
            game.opponent.constructor.name.should.be.equal("Boss");
        }

    });
    it('', async function () {
        this.name = `9: Checking Boss's speed...`;
        this.score = 2.5;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_nav, resp] = await to(browser.visit(URL));

            const livesInitial = parseInt(browser.html("li#livesli").match(/Lives: ?(\d+)/)[1]);
            const { game } = browser.window;
            const opponentSpeed = game.opponent.speed;
            game.opponent.die();
            await browser.wait({ duration: 3000 });
            const bossSpeed = game.opponent.speed;
            this.msg_ok = "Boss moves twices as fast as the opponent";
            this.msg_err = "Boss does not move twice as fast as the opponent";
            bossSpeed.should.be.equal(opponentSpeed*2);
        }

    });

    after(function() {
        try {
            browser.tabs.closeAll(); 
        } catch(e) {
            console.error(e)
        }
    });
});
