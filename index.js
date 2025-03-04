const express = require('express');
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 9000;


//cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());



app.use(express.json());

const user = require("./routes/user");
app.use("/api/v1", user);

app.listen(PORT, () => {
    console.log(`Server succesfully started at ${PORT}`);
})

const dbConnect = require("./config/database");
dbConnect();

app.get("/", (req, res) => {
    res.send(`<h1>This is my HOMEPAGE</h1>`)
})