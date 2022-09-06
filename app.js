const express = require('express')
const app = express()
const routes = require('./routes/routes')
const utils = require('./utils/db')
const bodyparser = require('body-parser')
const cors = require('cors')
require('dotenv/config')

const PORT = 8080

utils.connect()

app.use(cors({
    origin:'*'
}))
app.use(bodyparser.json())
app.use('/api',routes)

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})