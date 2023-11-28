const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const router = express.Router();

router.use(
  session({
    secret: "emminnazzar",
    resave: false,
    saveUninitialized: false,
  })
);

const db = require("./db.js");

router.post("/register", (req, res) => {
  try {
    const { name, surname, email, password } = req.body;
    const sql = "SELECT StudentID FROM students ORDER BY StudentID";
    db.query(sql, (err, results) => {
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
      bcrypt.hash(password, 10, function (err, hash) {
        const insertSql = `INSERT INTO students (studentID, name, surname, email, password) VALUES (?, ?, ?, ?, ?)`;
        const params = [nextStudentID, name, surname, email, hash];
        req.session.userID = nextStudentID;
        db.query(insertSql, params, (err, result) => {
          res.redirect(`/cabinet/`);
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    const sql = `SELECT studentID, password FROM students WHERE email = ?`;

    db.query(sql, [email], async (err, loginResult) => {
      if (err) {
        res.status(500).json({ error: "Error retrieving student details" });
      }

      if (loginResult.length === 0) {
        res.status(401).json({ error: "User not found" });
      } else {
        // Сравниваем введенный пароль с хешированным паролем из базы данных
        const hashedPassword = loginResult[0].password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (passwordMatch) {
          req.session.userID = loginResult[0].studentID;
          res.redirect(`/cabinet/`);
        } else {
          res.status(401).json({ error: "Incorrect password" });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
