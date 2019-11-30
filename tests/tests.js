/**
 * CORE19-06_quiz_mvc_client assignment checker
 */

// IMPORTS
const should = require('chai').should();
const path = require('path');
const fs = require('fs-extra');
const Utils = require('./testutils');
const to = require('./to');
const Browser = require('zombie');

// CRITICAL ERRORS
let error_critical = null;

// CONSTANTS
const T_TEST = 2 * 60; // Time between tests (seconds)
const browser = new Browser();
const path_assignment = path.resolve(path.join(__dirname, "../index.html"));
const URL = "file://"+path_assignment.replace("%", "%25");

//TESTS
describe("MOOC_game", function () {

    this.timeout(T_TEST * 1000);

    it('', async function () {
        this.name = `1(Precheck): Checking that the assignment file exists...`;
        this.score = 0;
        this.msg_ok = `Found the file '${path_assignment}'`;
        this.msg_err = `Couldn't find the file '${path_assignment}'`;
        const [error_path, path_ok] = await to(fs.pathExists(path_assignment));
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
        this.score = 1;
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
        this.name = `4: Checking 'Score' element...`;
        this.score = 3;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            [error_nav, resp] = await to(browser.visit(URL));
            this.msg_ok = "Found score"
            this.msg_err = `Element with id "scoreli" contained ${browser.html("#scoreli") || "nothing"} instead of the score in the format specified in the task assignment`;
            browser.assert.text('#scoreli', /Score.*/).should.be.equal(true);
        }
    });
});
