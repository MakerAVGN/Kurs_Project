const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const app = express();
require("dotenv").config();
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));


const { createAgent } = require("@forestadmin/agent");
const { createSqlDataSource } = require("@forestadmin/datasource-sql");

// Create your Forest Admin agent
// This must be called BEFORE all other middleware on the app
createAgent({
  authSecret: process.env.FOREST_AUTH_SECRET,
  envSecret: process.env.FOREST_ENV_SECRET,
  isProduction: process.env.NODE_ENV === "production",
})
  // Create your SQL datasource
  .addDataSource(createSqlDataSource(process.env.DATABASE_URL))
  .mountOnExpress(app)
  .start();

// app.use(cors());
app.get("/", (req, res) => {
  res.render("index");
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database connection

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "testovaya",
  port: 3306
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

app.get("/admin", (req, res) => {
  res.redirect("https://app.forestadmin.com/");
});

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

app.get('/cabinet.ejs', (req, res) => {
  res.render('cabinet');
});


app.listen(5000, () => {
  console.log("server listening on port 5000");
});