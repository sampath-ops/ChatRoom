const express = require("express");
const app = express();
const propertyRouter = require("./Routes/propertyRoutes");
const userRouter = require("./Routes/userRoutes");
const globalErrorHandler = require("./Controller/ErrorHandler");
const cors = require("cors");
const AppError = require("./utils/AppError");
const chatRoomRouter = require("./Routes/chatRooms");
const jwt = require("./Middlewares/jwt");

app.use(cors());

//body parser
app.use(express.json());


//ROUTERS
app.use("/api/v1/property",propertyRouter);

app.use("/api/v1/user",userRouter);

app.use("/api/v1/room", jwt.decode, chatRoomRouter);

app.get('/',(req,res)=>{
    res.send("hello from server");
})

// ERROR HANDLER FOR INVALId ROUTES
app.all('*', (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;