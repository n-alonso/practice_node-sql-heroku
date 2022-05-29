const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,	// use DATABASE_URL environment variable from Heroku app 
    ssl: {
      rejectUnauthorized: false // don't check for SSL cert
    }
});

const getUsers = (request, response) => {
    pool.query(
        `SELECT * FROM users 
        ORDER BY id ASC`,
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        }
    )
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query(
        `SELECT * FROM users 
        WHERE id = $1`,
        [id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(results.rows)
        }
    )
}

const createUser = (request, response) => {
    const { name, email } = request.body
    pool.query(
        `INSERT INTO users (name, email)
        VALUES ($1, $2)
        RETURNING *`,
        [name, email],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(201).json({ 'User Created': results.rows })
        }
    )
}

const updateUser = (request, response) => {
    const { id } = request.params
    const { name, email } = request.body
    pool.query(
        `UPDATE users
        SET name = $1, email = $2
        WHERE id = $3
        RETURNING *`,
        [name, email, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json({ 'User Updated': results.rows })
        }
    )
}

const deleteUser = (request, response) => {
    const { id } = request.params
    pool.query(
        `DELETE FROM users
        WHERE id = $1
        RETURNING *`,
        [id],
        (error, results) => {
            if (error) {
                throw error 
            }
            response.status(204).json({ 'User Deleted': results })
        }
    )
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}