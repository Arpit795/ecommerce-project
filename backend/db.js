const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "roundhouse.proxy.rlwy.net",
  user: "root",
  password: "njHeUZTBPthdXZQGrKcXGPONCDgdJqrL",
  database: "railway",
  port: 36943
});

db.connect((err) => {
  if (err) {
    console.log("Database error:", err);
  } else {
    console.log("MySQL Connected");
  }
});

module.exports = db;