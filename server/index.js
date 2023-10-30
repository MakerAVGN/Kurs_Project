const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "testovaya",
});

db.connect((err) => {
  if (err) throw err;
  else console.log("Database connection established");
});

db.query(
  `CREATE TABLE IF NOT EXISTS students (
    StudentID INT NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Phone VARCHAR(255) NOT NULL,
    PRIMARY KEY (StudentId)
  )`,
  (err, result) => {
    if (err) {
      console.error(err);
    }
  }
);

app.post("/submit-form", (req, res) => {
  let name = req.body.name;
  let phone = req.body.phone;
  let nextStudentID;
  let sql = "SELECT MAX(StudentID) AS maxId FROM students";
  db.query(sql, function (err, results) {
    if (err) throw err;
    if (results[0].maxId === null) {
      // код проверки есть ли записи в нашей базе данных
      nextStudentID = 0;
    } else {
      nextStudentID = results[0].maxId + 1;
    }
    let sql = `INSERT INTO students (StudentID, Name, Phone) VALUES (?, ?, ?)`;
    let params = [nextStudentID, name, phone];

    db.query(sql, params, function (err, result) {
      if (err) throw err;
    });
  });
});

app.listen(5000, () => {
  console.log("server listening on port 5000");
});
