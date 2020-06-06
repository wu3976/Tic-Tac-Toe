const fsMod = require ('fs');
const sqlMod = require('mysql');
const expressMod = require('express');
const pathMod = require('path');

const host = "localhost";
const user = "root";

const sql = sqlMod.createConnection({
    host : host,

})