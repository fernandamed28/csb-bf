// lib/db/connexion_db.ts
import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export async function getConnection() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // éventuellement : port: Number(process.env.DB_PORT) || 3306
    });
    console.log("Connexion pool MySQL créée avec succès.");
  }
  return pool;
}
