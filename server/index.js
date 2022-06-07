const express = require('express');
const app = express()
const cors = require('cors');

const port = 3000;

//middleware
app.use(express.json()) //req.body
app.use(cors());

//routes

//register and login routes

app.use('/auth', require('../routes/authSystem'))

app.use("/dashboard", require('../routes/dashboard'))

app.listen(port, ()=> {
    console.log(`server in running on port ${port}`)
})