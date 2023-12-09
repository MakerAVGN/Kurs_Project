const express = require("express");
const router = express.Router();
const path = require("path");
const session = require("express-session");
const courses = require("./courses.js");

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
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.json({ success: true, redirectUrl: "/" });
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

router.get("/ld", (req, res) => {
  res.render("ld");
});



module.exports = router;
