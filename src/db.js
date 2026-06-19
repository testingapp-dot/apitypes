import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createPool({
  host: "localhost",
  user: "monopolyfifa",
  password: "123456Aamira*",
  database: "nodejs",
  connectionLimit: 10,
});