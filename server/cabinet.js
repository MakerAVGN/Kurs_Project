const express = require("express");
const router = express.Router();

const db = require("./db.js");

router.get("/:id", (req, res) => {
  const id = req.params.id;

  // Check if the student with the specified ID exists
  db.query(
    `SELECT * FROM students WHERE studentID = ?`,
    [id],
    (err, student) => {
      if (err) {
        console.error("Error checking if student exists:", err);
        return res.status(500).send("Error checking if student exists");
      }

      if (student.length === 0) {
        console.log("Student does not exist");
        return res.status(404).send("This student does not exist");
      }

      // Continue with the original queries since the student exists
      db.query(
        `SELECT *, COUNT(*) OVER () AS boughtCourses, SUM(Points) OVER () AS TotalPoints, SUM(CASE WHEN Status = 'Пройден' THEN 1 ELSE 0 END) OVER () AS passedCourses FROM results WHERE StudentID = ?`,
        [id],
        (err, results) => {
          if (err) {
            console.error("Error retrieving student details:", err);
            return res.status(500).send("Error retrieving student details");
          }

          db.query(
            `SELECT name, surname, email, profile_pic FROM students WHERE studentID != ? ORDER BY studentID DESC LIMIT 5`,
            [id],
            (err, otherStudentsResult) => {
              if (err) {
                console.error("Error retrieving other students:", err);
                res.status(500).send("Error retrieving other students");
                throw err;
              } else {
                // Check if results is defined and has at least one element
                if (!results || results.length === 0) {
                  console.log("No results found for the student");
                  // Render the page with default values or a message
                  return res.render("cabinet", {
                    taskInfo: [],
                    boughtCourses: 0,
                    ratingCount: 0,
                    passedCourses: 0,
                    otherStudents: otherStudentsResult,
                    message: "No results found for the student",
                  });
                }

                // Render the page with the retrieved data
                res.render("cabinet", {
                  taskInfo: results,
                  boughtCourses: results[0].boughtCourses,
                  ratingCount: results[0].TotalPoints,
                  passedCourses: results[0].passedCourses,
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

router.patch("/:id/change_profile_pic", (req, res) => {
  const id = req.params.id;
  const newProfilePic = req.body.profilePicAddress;
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
  if (!urlRegex.test(newProfilePic) || !imageExtensions.test(newProfilePic)) {
    return res.status(400).send("Invalid image URL");
  }
  db.query(
    `UPDATE students SET profile_pic = ? WHERE studentID = ?`,
    [newProfilePic, id],
    (err, result) => {
      if (err) {
        res.status(500).send("Something went wrong");
        throw err;
      } else {
        res.status(200).send("Profile picture updated successfully");
      }
    }
  );
});

module.exports = router;
