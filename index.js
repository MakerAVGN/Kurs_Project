const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();
const cabinet = require("./cabinet.js");
const log_reg = require("./log_reg.js");
const mainRoutes = require("./main_routes.js");

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
app.use("/", mainRoutes);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Database connection
require("./db.js");

app.get("/admin", (req, res) => {
  res.redirect("https://app.forestadmin.com/");
});

app.use("/", log_reg);

app.use("/cabinet/", cabinet);

app.listen(5000, () => {
  console.log("server listening on port 5000");
});
