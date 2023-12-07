const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "testovaya",
  port: 3306,
});

connection.connect((err) => {
  if (err) throw err;
  else console.log("Database connection established");
});

connection.query(
  `CREATE TABLE IF NOT EXISTS students (
    studentID INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(255) NULL,
    PRIMARY KEY (StudentId)
  )`,
  (err, result) => {
    if (err) {
      console.error(err);
    }
  }
);

connection.query(`CREATE TABLE IF NOT EXISTS results (
  resultID INT NOT NULL,
  studentID INT NOT NULL,
  taskName VARCHAR(255) NOT NULL,
  points INT NOT NULL,
  status VARCHAR(255) NOT NULL,
  userPoints INT NOT NULL,
  PRIMARY KEY (resultID)
)`);

connection.query(`CREATE TABLE IF NOT EXISTS tasks (
  taskID INT NOT NULL,
  taskName VARCHAR(255) NOT NULL,
  taskDescription VARCHAR(255) NOT NULL,
  points INT,
  options JSON,
  correctOption INT,
  PRIMARY KEY (taskID)
)`);

/* connection.query(
  `INSERT INTO results VALUES (0,1,'Английский язык 60+',25,'Пройден',25),(1,1,'Английский язык 70+',30,'Пройден',10),(2,2,'Английский язык 60+',25,'Заброшен',0),(3,1,'Английский язык 80+',50,'Приостановлен',0),(4,2,'Английский язык 70+',30,'Заброшен',0),(5,3,'Английский язык 50+',15,'Выполняется',0),(6,2,'Английский язык 50+',15,'Пройден',0),(7,1,'Английский язык 50+',15,'Пройден',0);`
);

connection.query(`INSERT INTO tasks VALUES (1,'Английский язык 60+','Описание задания 1',5,'{\"options\": [\"Вариант 1\", \"Вариант 2\", \"Вариант 3\", \"Вариант 4\"]}',1),(2,'Английский язык 60+','Описание задания 2',5,'{\"options\": [\"Вариант 1\", \"Вариант 2\", \"Вариант 3\", \"Вариант 4\"]}',1),(3,'Английский язык 60+','Описание задания 3',5,'{\"options\": [\"Вариант 1\", \"Вариант 2\", \"Вариант 3\", \"Вариант 4\"]}',1),(4,'Английский язык 60+','Описание задания 4',5,'{\"options\": [\"Вариант 1\", \"Вариант 2\", \"Вариант 3\", \"Вариант 4\"]}',1),(5,'Английский язык 60+','Описание задания 5',5,'{\"options\": [\"Вариант 1\", \"Вариант 2\", \"Вариант 3\", \"Вариант 4\"]}',1),(6,'Английский язык 70+','Описание задания 1',5,'{\"options\": [\"Вариант 1\", \"Вариант 2\", \"Вариант 3\", \"Вариант 4\"]}',1),(7,'Английский язык 70+','Описание задания 2',5,'{\"options\": [\"Вариант 1\", \"Вариант 2\", \"Вариант 3\", \"Вариант 4\"]}',1),(8,'Английский язык 70+','Описание задания 3',5,'{\"options\": [\"Вариант 1\", \"Вариант 2\", \"Вариант 3\", \"Вариант 4\"]}',1),(9,'Английский язык 70+','Описание задания 4',5,'{\"options\": [\"Вариант 1\", \"Вариант 2\", \"Вариант 3\", \"Вариант 4\"]}',1),(10,'Английский язык 70+','Описание задания 5',5,'{\"options\": [\"Вариант 1\", \"Вариант 2\", \"Вариант 3\", \"Вариант 4\"]}',1);
`);

connection.query(`INSERT INTO students VALUES (0,'Мухаммед-Али','Кокиев','alishka@mail.ru','$2b$10$3L2qYKJ3ifCgO12UXp1ds.elUAKwwWW6A2VxPBpBMnRh.jl3pC1US',NULL),(1,'Узман','Узманов','uzmanchik@mail.ru','$2b$10$5R1so6LSr3pogsAfl9sjB.yVXh5D7rWSIyf8Y5gEQOTxgEk.tFVNe','https://pbs.twimg.com/media/E9sN5jzVUAUgYHn.png'),(2,'Владимир','Олейник','volodenka@mail.ru','$2b$10$AKcXqGc2hBhsYR26Bd8QZusnlfjHiUDOftE.IB6Q.9AQYN156fMFS','https://buffer.com/library/content/images/2022/03/amina.png'),(3,'Элвин','Николаенко','elvin@mail.ru','$2b$10$HuRMtHtzTLAVFvsXHmBOfOnZNMBUQRCVj2UXaM9EQOboWU3htILGi','https://pbs.twimg.com/media/E9sN5jzVUAUgYHn.png');
`); */

module.exports = connection;
