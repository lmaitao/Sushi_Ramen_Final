import pg from 'pg'
import 'dotenv/config'
const { DB_USER, DB_HOST, DB_DATABASE, DB_PASS, DB_PORT } = process.env

const pool = new pg.Pool({
    user:DB_USER,
    host:DB_HOST,
    database:DB_DATABASE,
    password:DB_PASS,
    port:DB_PORT,
    allowExitOnIdle: true,
})

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Database connection error:', err)
    } else {
        console.log('🔋 Database connected successfully:', res.rows[0])
    }
})

export default pool