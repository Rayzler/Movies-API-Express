﻿import { createPool } from "mysql2/promise";

const config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10,
};

const pool = await createPool(config);

export default pool;
