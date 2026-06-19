import mariadb from 'mariadb';
export const pool = mariadb.createPool({
    host: 'localhost',
    user: 'monopolyfifa',
    password: '123456Aamira*',
    database: 'nodejs',
    connectionLimit: 5
});
export async function query(sql, params = []) {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query(sql, params);
    }
    finally {
        if (conn)
            conn.release();
    }
}
