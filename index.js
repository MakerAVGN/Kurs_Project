const express = require("express");
const path = require("path");
const app = express();
const cabinet = require("./cabinet.js");
const log_reg = require("./log_reg.js");
const mainRoutes = require("./main_routes.js");

require("dotenv").config();
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

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");

app.use("/", mainRoutes);

// Database connection
const db = require("./db.js");

app.get("/admin", (req, res) => {
  res.redirect("https://app.forestadmin.com/");
});

app.use("/", log_reg);

app.use("/cabinet/", cabinet);

app.post("/contactInfo", (req, res) => {
  const { name, phone } = req.body;
  db.query(
    `SELECT contactID FROM contacts ORDER BY contactID`,
    (err, results) => {
      console.log(results);
      if (err) res.status(500).json({ err });
      let nextContactID;
      if (results.length === 0 || results[0].contactID !== 0) {
        // Если база данных пуста или первый элемент не 0, начинаем с 0
        nextContactID = 0;
      } else {
        // Ищем первый пропущенный номер в последовательности
        for (let i = 0; i < results.length; i++) {
          if (results[i].contactID !== i) {
            nextContactID = i;
            break;
          }
        }
        // Если пропущенный номер не найден, используем следующий последовательный ID
        if (nextContactID === undefined) {
          nextContactID = results.length;
        }
      }
      db.query(
        `INSERT INTO contacts (contactID, name, phone) VALUES (?, ?, ?)`,
        [nextContactID, name, phone],
        (err) => {
          if (err) res.status(500).json({ err });
          else res.render("/");
        }
      );
    }
  );
});

app.use((req, res, next) => {
  res.status(404).render("error404", { error: "Page not found" });
});

// Middleware для обработки ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Рендеринг страницы 'error' и передача информации об ошибке
  res.status(500).render("error500", { error: err.message });
});

app.listen(5000, () => {
  console.log("server listening on port 5000");
});
