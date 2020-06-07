const fsMod = require ('fs');
const sqlMod = require('mysql');
const expressMod = require('express');
const pathMod = require('path');
const bpMod = require("body-parser");
const cookieParserMod = require("cookie-parser");
/*---------------------------------Customization Area----------------------------------*/
const host = "localhost";
const user = "root";
const pwd = "753951";
const db = "tic_tac_toc_user_data";
const table = "user_stats";

const port = 3000;
/*-----------------------------------End-----------------------------------------------*/

online_user = [];

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

server.use(bpMod.urlencoded({
    extended : false
}));

server.use(expressMod.static(pathMod.join(__dirname, "static")));

server.use(cookieParserMod());

server.get("/", (req, res) => {
    res.sendFile(pathMod.join(__dirname, "static", "index.html"));
});

server.get("/login", (req, res) => {
    console.log(req.cookies);
    console.log(req.cookies['id']);
    if (typeof req.cookies['id'] !== 'undefined') { //  exist an 'id' property in cookie
        res.sendFile(pathMod.join(__dirname, "static", "already_logged_in.html"));
    } else {
        res.sendFile(pathMod.join(__dirname, "static", "login.html"));
    }
})

server.post("/login", (req, res) => {
    let userName = req.body['userName'];
    if (checkMalparam(userName)) {
        let query = `SELECT user_pwd FROM user_stats WHERE user_id = "${req.body['userName']}";`;
        sql.query(query, (err, result) => {
            if (result.length === 0) {
                res.redirect("/login_error?message=username_error");
            } else if (result[0]['user_pwd'] !== req.body['passWord']){
                res.redirect("/login_error?message=password_error");
            } else {
                let cookie = res.cookie('id', req.body['userName']);
                cookie.send("<span style = 'font-family: Calibri; font-size: 20px'>Success. "
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
    res.clearCookie('id');
    res.send(`<p style="font-family: 'Calibri Light';">You have logged out!"</p>`
            + `<form action="/" method="get"><input type="submit" value="Return to game"></form>`);
})

server.get("/cookieTest", (req, res) => {
    let cookie = res.cookie("id", "degjnd"); // set up the cookie
    cookie.send('cookie set'); // send the cookie
})

/**
 *
 * @param param The parameter being checked.
 * @return {boolean|boolean} If param is safe, return true, else return false;
 */
const checkMalparam = (param) => {
    param = param.toLowerCase();
    return param.indexOf(" ") < 0 && param.indexOf("=") < 0;
}

server.listen(port);

