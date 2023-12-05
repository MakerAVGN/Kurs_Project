const express = require("express");
const router = express.Router();
const path = require("path");
const session = require("express-session");

router.use(express.static("public"));
router.use(express.static(path.join(__dirname, "public")));

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
        console.error("Error checking if student exists:", err);
        return res
          .status(500)
          .json({ error: "Error checking if student exists" });
      }

      if (student.length === 0) {
        return res.status(404).json({ error: "This student does not exist" });
      }

      // Continue with the original queries since the student exists
      db.query(
        `SELECT *, COUNT(*) OVER () AS boughtCourses, SUM(Points) OVER () AS TotalPoints, SUM(CASE WHEN Status = 'Пройден' THEN 1 ELSE 0 END) OVER () AS passedCourses FROM results WHERE StudentID = ?`,
        [req.session.userID],
        (err, results) => {
          if (err) {
            console.error("Error retrieving student details:", err);
            return res
              .status(500)
              .json({ error: "Error retrieving student details" });
          }

          db.query(
            `SELECT name, surname, email, profile_pic FROM students WHERE studentID != ? ORDER BY studentID DESC LIMIT 5`,
            [req.session.userID],
            (err, otherStudentsResult) => {
              if (err) {
                console.error("Error retrieving other students:", err);
                res
                  .status(500)
                  .json({ error: "Error retrieving other students" });
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
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
  if (!urlRegex.test(newProfilePic) || !imageExtensions.test(newProfilePic)) {
    return res.status(400).json({ error: "Invalid image URL" });
  }
  db.query(
    `UPDATE students SET profile_pic = ? WHERE studentID = ?`,
    [newProfilePic, req.session.userID],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Something went wrong" });
        throw err;
      } else {
        res
          .status(200)
          .json({ success: "Profile picture updated successfully" });
      }
    }
  );
});

router.get("/courses", (req, res) => {
  const id = req.session.userID;
  db.query(
    `SELECT ResultID, TaskName FROM results WHERE StudentID = ?`,
    [id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.render("courses", { classesInfo: result });
      }
    }
  );
});

router.get("/courses/:id", (req, res) => {
  const courseID = req.params.id;
  req.session.currentQuestionIndex = req.session.currentQuestionIndex || 0;
  db.query(
    `SELECT taskName FROM results WHERE resultID = ?`,
    [courseID],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        req.session.currentTaskName = result[0].taskName;
        db.query(
          `SELECT * FROM tasks WHERE taskName = ? ORDER BY taskID`,
          [req.session.currentTaskName],
          (err, tasks) => {
            if (err) {
              res.status(500).json({ error: err });
            } else {
              res.render("tasks", {
                tasksInfo: tasks,
                courseID: courseID,
                questionID: req.session.currentQuestionIndex,
              });
            }
          }
        );
      }
    }
  );
});

router.post("/courses/:id/next-question", (req, res) => {
  req.session.currentQuestionIndex = req.session.currentQuestionIndex + 1;
  res.redirect(`/cabinet/courses/${req.params.id}`);
});

router.post("/courses/:id/submit-answers", (req, res) => {
  const courseId = req.params.id;
  const selectedAnswer = parseInt(req.body.answer, 10);

  db.query(
    `SELECT taskID, correctOption, points FROM tasks WHERE taskName = ? ORDER BY taskID`,
    [req.session.currentTaskName],
    (err, tasks) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      const correctOptionIndex =
        tasks[req.session.currentQuestionIndex].correctOption;
      const userPoints =
        selectedAnswer === correctOptionIndex
          ? tasks[req.session.currentQuestionIndex].points
          : 0;

      // Прошедший вопрос
      const passedQuestion = {
        taskID: tasks[req.session.currentQuestionIndex].taskID,
        points: userPoints,
      };

      // Обновление статуса вопроса и сохранение результата в массиве
      db.query(
        `UPDATE results SET status = ?, points = ? WHERE taskName = ? AND studentID = ?`,
        [
          "Пройдено",
          passedQuestion.points,
          req.session.currentTaskName,
          req.session.userID,
        ],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err });
          }

          req.session.currentQuestionIndex++;

          if (req.session.currentQuestionIndex < tasks.length) {
            res.redirect(`/cabinet/courses/${courseId}/next-question`);
          } else {
            // Все вопросы пройдены, можно обновить общее количество баллов
            const totalPoints = tasks.reduce(
              (sum, task) => sum + task.points,
              0
            );

            db.query(
              `UPDATE results SET points = ? WHERE taskName = ? AND studentID = ?`,
              [totalPoints, req.session.currentTaskName, req.session.userID],
              (err, result) => {
                if (err) {
                  return res.status(500).json({ error: err });
                }

                // Обновление сессии
                req.session.currentQuestionIndex = 0;

                res.render(`results`, {
                  totalPoints: totalPoints,
                  userPoints: userPoints,
                });
              }
            );
          }
        }
      );
    }
  );
});

module.exports = router;
