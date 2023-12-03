const express = require("express");
const router = express.Router();
const path = require("path");

router.use(express.static("public"));
router.use(express.static(path.join(__dirname, "public")));

const db = require("./db.js");

router.get("/", (req, res) => {
  const id = req.session.userID;

  // Check if the student with the specified ID exists
  db.query(
    `SELECT * FROM students WHERE studentID = ?`,
    [id],
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
        [id],
        (err, results) => {
          if (err) {
            console.error("Error retrieving student details:", err);
            return res
              .status(500)
              .json({ error: "Error retrieving student details" });
          }

          db.query(
            `SELECT name, surname, email, profile_pic FROM students WHERE studentID != ? ORDER BY studentID DESC LIMIT 5`,
            [id],
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
  const id = req.session.userID;
  const newProfilePic = req.body.profilePicAddress;
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
  if (!urlRegex.test(newProfilePic) || !imageExtensions.test(newProfilePic)) {
    return res.status(400).json({ error: "Invalid image URL" });
  }
  db.query(
    `UPDATE students SET profile_pic = ? WHERE studentID = ?`,
    [newProfilePic, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Something went wrong" });
        throw err;
      } else {
        res.status(200).json({ error: "Profile picture updated successfully" });
      }
    }
  );
});

module.exports = router;