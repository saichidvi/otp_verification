const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const { PORT, MONGODB_URI, NODE_ENV,ORIGIN } = require("./config");
const { API_ENDPOINT_NOT_FOUND_ERR, SERVER_ERR } = require("./errors");


//init express app 
const app = express();



//middlewares 
app.use(express.json());
app.use(
    cors({
        credentials : true,
        origin : ORIGIN,
        optionsSuccessStatus : 200
    })
);


//log in development environment 
if(NODE_ENV === "development"){
    const morgan = require("morgan");
    app.use(morgan("dev"));
}


//index route 
app.get("/",(req,res) => {
    res.status(200).json({
        type : "succes",
        message : "server is up and  running",
        data : null
    });
});



//routes middleware 
app.use("/api/auth",authRoutes);


//page not found error handling middleware 
app.use("*",(req,res,next) => {
    const error ={
        status  : 404,
        message : API_ENDPOINT_NOT_FOUND_ERR,
    };
    next(error);
});


//global error handling middleware 
app.use((err,req,req,next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.message || SERVER_ERR;
    const data  = err.data || null;
    res.status(status).json({
        type : "error",
        message,
        data
    });
});


async function main(){
    try {
        await mongoose.connect(MONGODB_URI,{
            useNewUrlParser : true,
            useCreateIndex : true,
            useFindAndMondify : false,
            UseUnifiedTopology : true
        });
        console.log("database connected");
        app.listen(PORT,() => {
            console.log(`server is listening on port ${PORT}`);
        });
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

main();
