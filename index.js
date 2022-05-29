const express = require('express')
const bodyParser = require('body-parser')
const db = require('./queries')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (request, response) => {
    response.send({ info: 'Node, Express, and Postgres API',
        endpoints: {
        '/users': ['get', 'post'],
        '/users/id': ['get', 'put', 'delete']
    } })
});
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});
