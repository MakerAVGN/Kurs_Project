const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "testovaya",
  port: 3306,
});

connection.connect((err) => {
  if (err) throw err;
  else console.log("Database connection established");
});

connection.query(
  `CREATE TABLE IF NOT EXISTS students (
    studentID INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(255) NULL,
    PRIMARY KEY (StudentId)
  )`,
  (err, result) => {
    if (err) {
      console.error(err);
    }
  }
);

connection.query(`CREATE TABLE IF NOT EXISTS results (
  resultID INT NOT NULL,
  studentID INT NOT NULL,
  taskName VARCHAR(255) NOT NULL,
  points INT NOT NULL,
  status VARCHAR(255) NOT NULL,
  PRIMARY KEY (resultID)
)`);

module.exports = connection;
