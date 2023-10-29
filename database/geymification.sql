-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: geymification
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `eventlogs`
--

DROP TABLE IF EXISTS `eventlogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventlogs` (
  `EventID` int NOT NULL,
  `EventType` varchar(255) DEFAULT NULL,
  `StudentID` int DEFAULT NULL,
  `EventDateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`EventID`),
  KEY `StudentID` (`StudentID`),
  CONSTRAINT `eventlogs_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventlogs`
--

LOCK TABLES `eventlogs` WRITE;
/*!40000 ALTER TABLE `eventlogs` DISABLE KEYS */;
INSERT INTO `eventlogs` VALUES (1,'Login',1,'2023-09-28 10:00:00'),(2,'Logout',2,'2023-09-28 11:15:00'),(3,'Quiz Started',3,'2023-09-28 12:30:00'),(4,'Quiz Completed',4,'2023-09-28 13:45:00'),(5,'Assignment Submitted',5,'2023-09-28 14:30:00'),(6,'Login',6,'2023-09-28 15:00:00'),(7,'Logout',7,'2023-09-28 16:15:00'),(8,'Assignment Submitted',8,'2023-09-28 17:30:00'),(9,'Login',9,'2023-09-28 18:45:00'),(10,'Logout',10,'2023-09-28 19:00:00'),(11,'Quiz Started',11,'2023-09-28 20:15:00'),(12,'Quiz Completed',12,'2023-09-28 21:30:00'),(13,'Assignment Submitted',13,'2023-09-28 22:45:00'),(14,'Login',14,'2023-09-28 23:00:00'),(15,'Logout',15,'2023-09-29 00:15:00'),(16,'Assignment Submitted',16,'2023-09-29 01:30:00'),(17,'Login',17,'2023-09-29 02:45:00'),(18,'Logout',18,'2023-09-29 03:00:00'),(19,'Quiz Started',19,'2023-09-29 04:15:00'),(20,'Quiz Completed',20,'2023-09-29 05:30:00');
/*!40000 ALTER TABLE `eventlogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `results`
--

DROP TABLE IF EXISTS `results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `results` (
  `ResultID` int NOT NULL,
  `StudentID` int DEFAULT NULL,
  `TaskID` int DEFAULT NULL,
  `Grade` int DEFAULT NULL,
  `CompletionDate` date DEFAULT NULL,
  PRIMARY KEY (`ResultID`),
  KEY `StudentID` (`StudentID`),
  KEY `TaskID` (`TaskID`),
  CONSTRAINT `results_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`),
  CONSTRAINT `results_ibfk_2` FOREIGN KEY (`TaskID`) REFERENCES `tasks` (`TaskID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `results`
--

LOCK TABLES `results` WRITE;
/*!40000 ALTER TABLE `results` DISABLE KEYS */;
INSERT INTO `results` VALUES (1,1,1,95,'2023-09-28'),(2,2,3,88,'2023-09-29'),(3,3,2,76,'2023-09-27'),(4,4,5,92,'2023-09-30'),(5,5,4,85,'2023-09-25'),(6,6,6,91,'2023-09-26'),(7,7,7,80,'2023-09-24'),(8,8,9,87,'2023-09-29'),(9,9,10,93,'2023-09-28'),(10,10,11,79,'2023-09-26'),(11,11,11,94,'2023-09-25'),(12,12,12,86,'2023-09-30'),(13,13,13,82,'2023-09-28'),(14,14,14,90,'2023-09-27'),(15,15,15,84,'2023-09-24'),(16,16,16,88,'2023-09-30'),(17,17,17,89,'2023-09-29'),(18,18,18,81,'2023-09-26'),(19,19,19,95,'2023-09-25'),(20,20,20,83,'2023-09-27');
/*!40000 ALTER TABLE `results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `StudentID` int NOT NULL,
  `FirstName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) DEFAULT NULL,
  `BirthDate` date DEFAULT NULL,
  `School` varchar(255) DEFAULT NULL,
  `PreparationLevel` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`StudentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'Иван','Иванов','2000-05-15','Школа №1','Высокий'),(2,'Елена','Петрова','2001-02-28','Школа №2','Средний'),(3,'Алексей','Смирнов','2002-09-10','Школа №3','Высокий'),(4,'Ольга','Козлова','2000-11-20','Школа №4','Средний'),(5,'Павел','Лебедев','2001-07-05','Школа №5','Низкий'),(6,'Анна','Морозова','2002-04-18','Школа №6','Средний'),(7,'Дмитрий','Ковалев','2000-03-12','Школа №7','Высокий'),(8,'Мария','Николаева','2001-08-25','Школа №8','Высокий'),(9,'Игорь','Соколов','2002-01-30','Школа №9','Низкий'),(10,'Татьяна','Васильева','2000-06-08','Школа №10','Средний'),(11,'Артем','Игнатьев','2002-12-03','Школа №11','Высокий'),(12,'Екатерина','Захарова','2001-09-14','Школа №12','Средний'),(13,'Максим','Кудрявцев','2000-07-19','Школа №13','Средний'),(14,'Алина','Андреева','2002-02-28','Школа №14','Высокий'),(15,'Сергей','Федоров','2001-11-10','Школа №15','Низкий'),(16,'Ирина','Семенова','2000-06-25','Школа №16','Средний'),(17,'Андрей','Григорьев','2002-04-30','Школа №17','Средний'),(18,'Людмила','Попова','2001-08-02','Школа №18','Высокий'),(19,'Владимир','Егоров','2000-03-15','Школа №19','Высокий'),(20,'Оксана','Дмитриева','2002-10-08','Школа №20','Низкий');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `TaskID` int NOT NULL,
  `Topic` varchar(255) DEFAULT NULL,
  `Description` text,
  `DifficultyLevel` int DEFAULT NULL,
  `Points` int DEFAULT NULL,
  PRIMARY KEY (`TaskID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,'Задача 1','Описание задачи 1',3,10),(2,'Задача 2','Описание задачи 2',2,8),(3,'Задача 3','Описание задачи 3',4,12),(4,'Задача 4','Описание задачи 4',2,6),(5,'Задача 5','Описание задачи 5',5,15),(6,'Задача 6','Описание задачи 6',3,9),(7,'Задача 7','Описание задачи 7',1,5),(8,'Задача 8','Описание задачи 8',4,11),(9,'Задача 9','Описание задачи 9',2,7),(10,'Задача 10','Описание задачи 10',3,10),(11,'Задача 11','Описание задачи 11',2,8),(12,'Задача 12','Описание задачи 12',4,12),(13,'Задача 13','Описание задачи 13',2,6),(14,'Задача 14','Описание задачи 14',5,15),(15,'Задача 15','Описание задачи 15',3,9),(16,'Задача 16','Описание задачи 16',1,5),(17,'Задача 17','Описание задачи 17',4,11),(18,'Задача 18','Описание задачи 18',2,7),(19,'Задача 19','Описание задачи 19',3,10),(20,'Задача 20','Описание задачи 20',2,8);
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-04 14:28:23
