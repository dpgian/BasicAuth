const express = require('express')
const mongodbconnection = require('./config/db')

// Routes
const user = require('./routes/user')

// Connection to mongoDb
mongodbconnection()

const app = express()

const PORT = process.env.PORT || 5000

// Express bodyparser
app.use(express.urlencoded( { extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'Hello world'})
})

app.use('/user', user)

app.listen(PORT, (req, res) => {
    console.log(`Server started on PORT: ${PORT}`)
})
