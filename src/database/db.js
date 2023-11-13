const mysql = require("mysql2/promise.js")
const dbConfig = require("../../config/db.config.js");

const connection = {
  host: dbConfig.DB_HOST,
  port: dbConfig.DB_PORT,
  user: dbConfig.DB_USERNAME,
  password: dbConfig.DB_USERNAME_PASSWORD,
  database: dbConfig.DB_NAME
}

const pool = mysql.createPool(connection);

const connectToMySQL = async () => {
  try {
    await pool.getConnection();
    console.log("MySQL database connected");
  } catch(err) {
    console.log(err);
    console.log("MySQL database connection error");
    process.exit(1);
  }
}

connectToMySQL().then();

module.exports = pool;