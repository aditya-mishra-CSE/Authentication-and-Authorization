
const mongoose = require("mongoose")

require("dotenv").config();

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log("DB Connection successful")
    })
    .catch((err) => {
        console.log("DB Connection Issues");
        console.error(err);
        process.exit(1);
    })
}

module.exports = dbConnect