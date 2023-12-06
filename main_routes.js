const express = require("express");
const router = express.Router();
const path = require("path");

router.use(express.static("public"));
router.use(express.static(path.join(__dirname, "public")));

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/classes", (req, res) => {
  res.render("classes");
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contacts", (req, res) => {
  res.render("contacts");
});


module.exports = router;
