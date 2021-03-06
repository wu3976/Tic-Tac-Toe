const fsMod = require ('fs');
const sqlMod = require('mysql');
const expressMod = require('express');
const pathMod = require('path');
const bpMod = require("body-parser");
const cookieParserMod = require("cookie-parser");
const utilMod = require("./utilities");
/*---------------------------------Customization Area----------------------------------*/
const host = "localhost";
const user = "root";
const pwd = "753951";
const db = "tic_tac_toc_user_data";
const table = "user_stats";

const port = 3000;

const userName_reqi = [0, 0, 0];
const passWord_reqi = [1, 1, 1];
/*-----------------------------------End-----------------------------------------------*/

MAX_ACCESS_CODE = 100000000;
/**
 * A map recording access code of online users and their names
 * @type {{access_code : userName}}
 */
online_user = {};

const sql = sqlMod.createConnection({
    host : host,
    user : user,
    password : pwd,
    database : db
});

sql.connect((err) => {
    if (err){
        throw err;
    } else {
        console.log(`MySQL connected to database ${db}`);
    }
})

const server = expressMod();

/* Configurating middlewares */

server.use(bpMod.urlencoded({
    extended : false
}));

server.use(expressMod.static(pathMod.join(__dirname, "static")));

server.use(cookieParserMod());

server.get("/", (req, res) => {
    res.sendFile(pathMod.join(__dirname, "static", "index.html"));
});

/**
 * chech if the login is valid. Which means in user's cookie, there exist id and access code,
 * and these two are consistent with server's record.
 * @param req Request object from client.
 * @return {boolean} true if login is valid, false otherwise.
 */
const checkValidLogin = (req) => {
    return utilMod.containsKey(req.cookies, 'id')
            && utilMod.containsKey(req.cookies, 'access_code')
            && online_user[req.cookies['access_code']] === req.cookies['id'];
}

server.get("/login", (req, res) => {
    console.log(req.cookies);
    console.log(req.cookies['id']);
    console.log(online_user);
    if (checkValidLogin(req)) {
        // which means exist an 'id' property in cookie and the access code is correct.
        res.sendFile(pathMod.join(__dirname, "static", "already_logged_in.html"));
    } else {
        utilMod.clearCookies(res, ['id', 'access_code']);
        res.sendFile(pathMod.join(__dirname, "static", "login.html"));
    }
})

server.post("/login", (req, res) => {
    let userName = req.body['userName'];
    if (utilMod.checkMalparam(userName)) {
        let query = `SELECT user_pwd FROM user_stats WHERE user_id = "${req.body['userName']}";`;
        sql.query(query, (err, result) => {
            if (result.length === 0) {
                res.redirect("/login_error?message=username_error");
            } else if (result[0]['user_pwd'] !== req.body['passWord']){
                res.redirect("/login_error?message=password_error");
            } else {
                let accessCode = utilMod.generateAccessCode(MAX_ACCESS_CODE);
                while (utilMod.containsKey(online_user, accessCode)){
                    accessCode = utilMod.generateAccessCode(MAX_ACCESS_CODE);
                }

                online_user[accessCode] = userName;
                //let cookie = res.cookie('id', req.body['userName']);
                res.cookie('id', req.body['userName']);
                res.cookie('access_code', accessCode);
                res.send("<span style = 'font-family: Calibri; font-size: 20px'>Success. "
                    + "<form action='/' method='get'><input type='submit' value='Return to game'></form></span>");
            }
        });
    } else {
        res.redirect("/login_error?message=unexpected_error");
    }
});

server.get("/login_error", (req, res) => {
    res.sendFile(pathMod.join(__dirname, "static", "login_error.html"));
});

server.get("/logout", (req, res) => {
    utilMod.clearCookies(res, ['id', 'access_code']);
    delete online_user[req.cookies['access_code']];
    res.send(`<p style="font-family: 'Calibri Light';">You have logged out!"</p>`
            + `<form action="/" method="get"><input type="submit" value="Return to game"></form>`);
});

server.get("/signup", (req, res) => {
    res.sendFile(pathMod.join(__dirname, "static", "signup.html"));
});

server.post("/signup", (req, res) => {
    if (utilMod.checkValidAcctOrPwd(req.body['userName'], 3, userName_reqi)
            && utilMod.checkValidAcctOrPwd(req.body['passWord'], 3, passWord_reqi)
            && utilMod.checkValidContactInfo(req.body['contactInfo'])){
        let query = `SELECT * from ${table} WHERE user_id = "${req.body['userName']}";`
        console.log(query);
        sql.query(query, (err, result) => {
            console.log(result);
            if (err){
                res.redirect("/signup_result?message=database_error");
            } else if (result.length > 0){
                res.redirect("/signup_result?message=user_exists");
            } else {
                let contact = req.body['contactInfo'].length === 0 ? null : `"${req.body['contactInfo']}"`
                let query2 = `INSERT INTO ${table} VALUES ("${req.body['userName']}", `
                    + `"${req.body['passWord']}", ${contact}, 0, 0, 0);`;
                console.log(query2);
                sql.query(query2, (err, result) => {
                    if (err){
                        res.redirect("/signup_result?message=database_error");
                    } else {
                        res.redirect("/signup_result?message=success");
                    }
                });
            }
        });
    } else {
        res.redirect("/signup_result?message=invalid_input")
    }
});

server.get("/signup_result", (req, res) => {
    res.sendFile(pathMod.join(__dirname, "static", "signup_result.html"));
});

server.listen(port);

