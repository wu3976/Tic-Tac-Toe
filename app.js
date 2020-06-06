const fsMod = require ('fs');
const sqlMod = require('mysql');
const expressMod = require('express');
const pathMod = require('path');
const bpMod = require("body-parser");

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

server.get("/", (req, res) => {
    res.sendFile(pathMod.join(__dirname, "static", "index.html"));
});

server.get("/login", (req, res) => {
    res.sendFile(pathMod.join(__dirname, "static", "login.html"));
})

server.post("/login", (req, res) => {
    let userName = req.body['userName'];
    if (checkMalparam(userName)) {
        let query = `SELECT user_pwd FROM user_stats WHERE user_id = "${req.body['userName']}";`;

        sql.query(query, (err, result) => {
            if (result.length === 0) {
                // username wrong
            } else if (result[0]['user_pwd'] !== req.body['passWord']){
                // password wrong
            } else {
                console.log(result);
            }
        });
    } else {

    }
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

