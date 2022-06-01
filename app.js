const express = require("express");
const connect = require("./models"); 
const app = express();
const port = 3000;

connect();

const postRouter = require("./Routes/posts"); //route 연결
const userRouter = require("./Routes/login");

const requsetURL = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
};
app.use(express.urlencoded({ extended: false}))
app.use(express.static("static"))
app.use(express.json());
app.use(requsetURL);
app.use('/api', [postRouter, userRouter]);

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/static/login.html');
  });

app.listen(port, () => {
    console.log(port, "Blog On");
});