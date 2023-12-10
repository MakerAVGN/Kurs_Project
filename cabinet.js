const express = require("express");
const router = express.Router();
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcrypt");
const courses = require("./courses.js");

router.use(express.static("public"));
router.use(express.static(path.join(__dirname, "public")));
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

const db = require("./db.js");

router.use(
  session({
    secret: "emminnazzar",
    resave: false,
    saveUninitialized: false,
  })
);

router.get("/", (req, res) => {
  db.query(
    `SELECT * FROM students WHERE studentID = ?`,
    [req.session.userID],
    (err, student) => {
      if (err) {
        return res.status(500).json({ err });
      }

      if (student.length === 0) {
        return res.status(404).json({ err });
      }

      // Continue with the original queries since the student exists
      db.query(
        `SELECT *, COUNT(*) OVER () AS boughtCourses, SUM(userPoints) OVER () AS TotalPoints, SUM(CASE WHEN status = 'Пройден' THEN 1 ELSE 0 END) OVER () AS passedCourses FROM results WHERE studentID = ?`,
        [req.session.userID],
        (err, results) => {
          if (err) {
            return res.status(500).json({ err });
          }

          db.query(
            `SELECT name, surname, email, profile_pic FROM students WHERE studentID != ? ORDER BY studentID DESC LIMIT 5`,
            [req.session.userID],
            (err, otherStudentsResult) => {
              if (err) {
                res.status(500).json({ err });
                throw err;
              } else {
                // Check if results is defined and has at least one element
                if (!results || results.length === 0) {
                  return res.render("cabinet", {
                    studentInfo: student[0],
                    taskInfo: [
                      {
                        boughtCourses: 0,
                        TotalPoints: 0,
                        passedCourses: 0,
                      },
                    ],
                    otherStudents: otherStudentsResult,
                  });
                }
                res.render("cabinet", {
                  studentInfo: student[0],
                  taskInfo: results,
                  otherStudents: otherStudentsResult,
                });
              }
            }
          );
        }
      );
    }
  );
});

router.post("/change_profile_pic", (req, res) => {
  const newProfilePic = req.body.profilePicAddress;
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp)/i;
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

  if (!urlRegex.test(newProfilePic) || !imageExtensions.test(newProfilePic)) {
    return res.status(400).json({ error: "Invalid image URL" });
  }

  db.query(
    `UPDATE students SET profile_pic = ? WHERE studentID = ?`,
    [newProfilePic, req.session.userID],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(200).json({ redirect: "/cabinet" });
      }
    }
  );
});

router.use("/courses/", courses);

router.get("/help", (req, res) => {
  res.render("help");
});

router.get("/settings", (req, res) => {
  res.render("settings");
});

router.get("/personal", (req, res) => {
  res.render("personal");
});

router.get("/options", (req, res) => {
  res.render("options");
});

router.get("/reset", (req, res) => {
  db.query(
    `SELECT * FROM students WHERE studentID = ?`,
    [req.session.userID],
    (err, student) => {
      if (err) {
        res.status(500).json({ err });
      } else {
        res.render("reset", {
          studentInfo: student[0],
        });
      }
    }
  );
});

router.post("/reset", (req, res) => {
  const { oldPassword, newPassword } = req.body;
  db.query(
    `SELECT password FROM students WHERE studentID = ?`,
    [req.session.userID],
    async (err, password) => {
      if (err) res.status(500).json({ err });
      const hashedPassword = password[0].password;
      const passwordMatch = await bcrypt.compare(oldPassword, hashedPassword);

      if (passwordMatch) {
        bcrypt.hash(newPassword, 10, function (err, hash) {
          db.query(
            `UPDATE students SET password = ? WHERE studentID = ?`,
            [hash, req.session.userID],
            (err, result) => {
              if (err) res.status(500).json({ err });
              else {
                res.redirect("/cabinet");
              }
            }
          );
        });
      }
    }
  );
});

router.get("/addCourse", (req, res) => {
  db.query(
    `SELECT * FROM students WHERE studentID = ?`,
    [req.session.userID],
    (err, student) => {
      if (err) res.status(500).json({ err });
      else {
        db.query(`SELECT DISTINCT taskName FROM results`, (err, allTasks) => {
          if (err) res.status(500).json({ err });
          else {
            db.query(
              `SELECT DISTINCT taskName FROM results WHERE studentID = ?`,
              [req.session.userID],
              (err, purchasedTasks) => {
                if (err) res.status(500).json({ err });
                else {
                  let purchasedTasksArr = purchasedTasks.map((task) => {
                    return task.taskName;
                  });
                  if (!(purchasedTasksArr.length > 0))
                    purchasedTasksArr.push("");
                  db.query(
                    `SELECT DISTINCT taskName FROM results WHERE taskName NOT IN (?)`,
                    [purchasedTasksArr],
                    (err, availableClasses) => {
                      if (err) res.status(500).json({ err });
                      else {
                        res.render("addCourse", {
                          studentInfo: student[0],
                          availableClasses: availableClasses,
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        });
      }
    }
  );
});

router.post("/addCourse", (req, res) => {
  const taskName = req.body.taskName;
  db.query(`SELECT resultID FROM results ORDER BY resultID`, (err, results) => {
    let nextResultID;
    if (results.length === 0 || results[0].resultID !== 0) {
      // Если база данных пуста или первый элемент не 0, начинаем с 0
      nextResultID = 0;
    } else {
      // Ищем первый пропущенный номер в последовательности
      for (let i = 0; i < results.length; i++) {
        if (results[i].resultID !== i) {
          nextResultID = i;
          break;
        }
      }
      // Если пропущенный номер не найден, используем следующий последовательный ID
      if (nextResultID === undefined) {
        nextResultID = results.length;
      }
    }
    let points;
    switch (taskName) {
      case "Английский язык 50+":
        points = 15;
        break;
      case "Английский язык 70+":
        points = 30;
        break;
      case "Английский язык 80+":
        points = 50;
        break;
      default:
        points = 25;
        break;
    }
    db.query(
      "INSERT INTO results (resultID, studentID, taskName, points, status, userPoints) VALUES (?, ?, ?, ?, ?, ?)",
      [nextResultID, req.session.userID, taskName, points, "Выполняется", 0],
      (err, result) => {
        if (err) res.status(500).json({ err });
        else {
          res.status(200).json({ redirect: "/cabinet" });
        }
      }
    );
  });
});

module.exports = router;
