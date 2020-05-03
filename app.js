const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 5000;
const {MONGOURI} = require("./keys");
const ejs = require("ejs");


mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    });
mongoose.connection.on('connected', () => {
    console.log("connected to database");
    });
mongoose.connection.on('error', (err) => {
    console.log("error connecting",err);
    });

require('./models/user');
require('./models/post');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));


app.listen(PORT, ()=>{
    console.log("server started at",PORT);
});