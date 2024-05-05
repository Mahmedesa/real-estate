if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
} 

const mongoose = require('mongoose');

const connectDbB = async() => {
    try{
        const conn = await mongoose.connect(process.env.URL);
        console.log(`Connect to data base on : ${conn.connection.host}`);
    }catch(error){
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDbB;