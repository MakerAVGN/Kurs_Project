const express = require("express");
const router = express.Router();
const path = require("path");

router.use(express.static("public"));
router.use(express.static(path.join(__dirname, "public")));

const db = require("./db.js");

router.get("/", (req, res) => {
  const id = req.session.userID;
  db.query(
    `SELECT resultID, taskName, points, status, userPoints FROM results WHERE studentID = ?`,

    [id],
    (err, result) => {
      if (err) {
        res.status(500).json({ err });
      } else {
        db.query(
          `SELECT * FROM students WHERE studentID = ?`,
          [req.session.userID],
          (err, student) => {
            if (err) {
              res.status(500).json({ err });
            } else {
              res.render("courses", {
                classesInfo: result,
                studentInfo: student[0],
              });
            }
          }
        );
      }
    }
  );
});

router.get("/:id", (req, res) => {
  const courseID = req.params.id;
  req.session.currentQuestionIndex = req.session.currentQuestionIndex || 0;
  db.query(
    `SELECT taskName FROM results WHERE resultID = ?`,
    [courseID],
    (err, result) => {
      if (err) {
        res.status(500).json({ err });
      } else {
        req.session.currentTaskName = result[0].taskName;
        db.query(
          `SELECT * FROM tasks WHERE taskName = ? ORDER BY taskID`,
          [req.session.currentTaskName],
          (err, tasks) => {
            if (err) {
              res.status(500).json({ err });
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

router.post("/:id/next-question", (req, res) => {
  req.session.userPoints = req.session.userPoints || 0;
  req.session.currentQuestionIndex = req.session.currentQuestionIndex + 1;
  const selectedAnswer = parseInt(req.body.answer, 10);
  db.query(
    `SELECT points, correctOption FROM tasks WHERE taskName = ? ORDER BY taskID`,
    [req.session.currentTaskName],
    (err, results) => {
      if (err) {
        res.status(500);
        throw new Error(err);
      }
      if (selectedAnswer === results[0].correctOption) {
        req.session.userPoints += results[0].points;
      }
      res.redirect(`/cabinet/courses/${req.params.id}`);
    }
  );
});

router.post("/:id/submit-answers", (req, res) => {
  const selectedAnswer = parseInt(req.body.answer, 10);

  db.query(
    `SELECT taskID, correctOption, points FROM tasks WHERE taskName = ? ORDER BY taskID`,
    [req.session.currentTaskName],
    (err, tasks) => {
      if (err) {
        return res.status(500).json({ err });
      }

      const currentTask = tasks[req.session.currentQuestionIndex];

      if (selectedAnswer === currentTask.correctOption) {
        req.session.userPoints += currentTask.points;
      }
      db.query(
        `UPDATE results SET status = ?, userPoints = ? WHERE taskName = ? AND studentID = ?`,
        [
          "Пройден",
          req.session.userPoints,
          req.session.currentTaskName,
          req.session.userID,
        ],
        (err) => {
          if (err) {
            return res.status(500).json({ err });
          }

          req.session.currentQuestionIndex++;

          if (req.session.currentQuestionIndex < tasks.length) {
            res.redirect(`/cabinet/courses/${req.params.id}/next-question`);
          } else {
            // Все вопросы пройдены, можно обновить общее количество баллов
            const totalPoints = tasks.reduce(
              (sum, task) => sum + task.points,
              0
            );

            // Обновление сессии
            userPoints = req.session.userPoints;
            req.session.currentQuestionIndex = 0;
            req.session.userPoints = 0;

            res.render(`results`, {
              totalPoints: totalPoints,
              userPoints: userPoints,
            });
          }
        }
      );
    }
  );
});

module.exports = router;
