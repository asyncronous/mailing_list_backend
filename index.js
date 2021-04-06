//npm init
//yarn add express
//install nodemon globally
//yarn add mongoose

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")

//gets env
const { config } = require('dotenv');
config();

//gets rid of a depr message
mongoose.set('useCreateIndex', true);

const username = process.env.USERNAME  
const password = process.env.PASSWORD
const database = process.env.DBNAME  

let connectionString = `mongodb+srv://${username}:${password}@cluster0.jvkwo.mongodb.net/${database}?retryWrites=true&w=majority`;

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to the database"))
.catch(error => console.log(error))

app.use(cors({
    // origin: "*",
    origin: "http://localhost:3000", // This should be changed to our front-end url
    credentials: true
}))

app.use(express.json())

//routes
app.use("/list", require("./routes/list.js"))

//test route to check backend is online
app.get("/", (request, response) => {
    // console.log(request)
    console.log("Root Path - Get Request")
    response.send("Good Morning Sir")
})

app.listen(process.env.PORT || 5000, () => {})

module.exports = {app}