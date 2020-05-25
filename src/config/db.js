"user strict";
var sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, sqlite3.OPEN_READWRITE);

module.exports = db;
