/**
 * CORE19-06_quiz_mvc_client assignment checker
 */

// IMPORTS
const should = require('chai').should();
const path = require('path');
const fs = require('fs-extra');
const Utils = require('./utils');
const to = require('./to');
const Browser = require('zombie');

// CRITICAL ERRORS
let error_critical = null;

// CONSTANTS
const T_TEST = 2 * 60; // Time between tests (seconds)
const browser = new Browser();
const path_assignment = path.resolve(path.join(__dirname, "../quiz_MVC_client.html"));
const URL = "file://"+path_assignment.replace("%", "%25");

//TESTS
describe("CORE19-06_quiz_mvc_client", function () {

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
        this.name = `3: Checking 'New' implementation...`;
        this.score = 4;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            const expected = "Question 1";
            [error_nav, resp] = await to(browser.visit(URL));
            if (error_nav) {
                this.msg_err = `Couldn't find '${expected}' in ${path_assignment}\nError:${error_nav}\nReceived:${browser.text('body')}`;
            }
            [error_nav, resp] = await to(browser.click('.new'));
            if (error_nav) {
                this.msg_err = `Couldn't find '${expected}' in ${path_assignment}\nError:${error_nav}\nReceived:${browser.text('body')}`;
            }
            [error_nav, resp] = await to(browser.fill('#question', "Question 1"));
            if (error_nav) {
                this.msg_err = `Couldn't find '${expected}' in ${path_assignment}\nError:${error_nav}\nReceived:${browser.text('body')}`;
            }
            [error_nav, resp] = await to(browser.fill('#answer', "Answer 1"));
            if (error_nav) {
                this.msg_err = `Couldn't find '${expected}' in ${path_assignment}\nError:${error_nav}\nReceived:${browser.text('body')}`;
            }
            [error_nav, resp] = await to(browser.click('.create'));
            this.msg_ok = `Found '${expected}' in ${path_assignment}`;
            this.msg_err = `Couldn't find '${expected}' in ${path_assignment}\n\t\t\tError:${error_nav}\n\t\t\tReceived:${browser.text('body')}`;
            Utils.search(expected, browser.text('body')).should.be.equal(true);
        }
    });

    it('', async function () {
        this.name = `4: Checking 'Delete' implementation...`;
        this.score = 3;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            const expected = 3;
            [error_nav, resp] = await to(browser.visit(URL));
            [error_nav, resp] = await to(browser.click('button[quizid="0"].delete'));
            this.msg_err = `Wrong number of quizzes in ${path_assignment}\n\t\t\tExpected:${expected}\n\t\t\tFound:${browser.querySelectorAll('span').length}`;
            browser.querySelectorAll('span').length.should.be.equal(expected);
        }
    });

    it('', async function () {
        this.name = `5: Checking 'Reset' implementation...`;
        this.score = 3;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            const expected = 4;
            [error_nav, resp] = await to(browser.visit(URL));
            [error_nav, resp] = await to(browser.click('.new'));
            [error_nav, resp] = await to(browser.fill('#question', "Question 1"));
            [error_nav, resp] = await to(browser.fill('#answer', "Answer 1"));
            [error_nav, resp] = await to(browser.click('.create'));
            [error_nav, resp] = await to(browser.click('button[quizid="0"].delete'));
            [error_nav, resp] = await to(browser.click('button[quizid="1"].delete'));
            [error_nav, resp] = await to(browser.click('.reset'));
            this.msg_ok = `Reset successfully implemented in ${path_assignment}`;
            this.msg_err = `Wrong number of quizzes in ${path_assignment}\n\t\t\tExpected:${expected}\n\t\t\tFound:${browser.querySelectorAll('span').length}`;
            browser.querySelectorAll('span').length.should.be.equal(expected);
        }
    });

});
