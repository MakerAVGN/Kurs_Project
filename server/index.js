const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const app = express();

require("dotenv").config();
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

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
  port: 3306,
});

db.connect((err) => {
  if (err) throw err;
  else console.log("Database connection established");
});

db.query(
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

db.query(`CREATE TABLE IF NOT EXISTS results (
  ResultID INT NOT NULL,
  StudentID INT NOT NULL,
  TaskName VARCHAR(255) NOT NULL,
  Points INT NOT NULL,
  Status VARCHAR(255) NOT NULL,
  PRIMARY KEY (ResultID)
)`);

app.get("/admin", (req, res) => {
  res.redirect("https://app.forestadmin.com/");
});

app.post("/register", (req, res) => {
  let name = req.body.name;
  let surname = req.body.surname;
  let email = req.body.email;
  let password = req.body.password;
  let sql = "SELECT StudentID FROM students ORDER BY StudentID";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send("Internal Server Error");
      throw err;
    }
    let nextStudentID;
    if (results.length === 0 || results[0].StudentID !== 0) {
      // Если база данных пуста или первый элемент не 0, начинаем с 0
      nextStudentID = 0;
    } else {
      // Ищем первый пропущенный номер в последовательности
      for (let i = 0; i < results.length; i++) {
        if (results[i].StudentID !== i) {
          nextStudentID = i;
          break;
        }
      }
      // Если пропущенный номер не найден, используем следующий последовательный ID
      if (nextStudentID === undefined) {
        nextStudentID = results.length;
      }
    }
    let insertSql = `INSERT INTO students (studentID, name, surname, email, password) VALUES (?, ?, ?, ?, ?)`;
    let params = [nextStudentID, name, surname, email, password];
    db.query(insertSql, params, (err, result) => {
      if (err) {
        res.status(500).send("Internal Server Error");
        throw err;
      }
      // Отправляем успешный ответ клиенту
      res.status(200).send("User added successfully");
    });
  });
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let sql = `SELECT studentID FROM students WHERE email = ? AND password = ?`;
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving student details");
      throw err;
    }
    if (results.length === 0) {
      res.status(401).send("User not found");
    } else {
      res.status(200);
      res.redirect(`/cabinet/${results[0].studentID}`);
    }
  });
});

app.get("/cabinet/:id", (req, res) => {
  let id = req.params.id;
  db.query(
    `SELECT * from results WHERE StudentID = ?`,
    [id],
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrievent student details");
        throw err;
      } else {
        res.render("cabinet", {
          taskInfo: results,
        });
      }
    }
  );
});

app.listen(5000, () => {
  console.log("server listening on port 5000");
});
