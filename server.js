const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const connectDB = require('./config/db')

const app = express()

// connect database
connectDB()

// init middleware

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ extended: false, limit: '50mb' }))

app.get('/', (req, res) => res.send('running api'))

// define routes
app.use('/api/users', require('./routes/api/usersRoute'))
app.use('/api/auth', require('./routes/api/authRoute'))
app.use('/api/profile', require('./routes/api/profileRoute'))
app.use('/api/ads', require('./routes/api/adsRoute'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`server started on PORT ${PORT}`))
