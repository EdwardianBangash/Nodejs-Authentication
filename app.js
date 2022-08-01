const express = require("express");
const bodyParser = require('body-parser')
const passport = require('passport');
const path = require("path");
const mongoose = require("mongoose");
const db = require("./config/keys").MongoURI;
const session = require('express-session')
const flash = require('connect-flash')

const app = express();

//session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))


require('./config/passport-config')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(bodyParser.urlencoded({ extended: false }))

//connection to the database...
mongoose
  .connect(db)
  .then(() => {
    console.log("connection established");
  })
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 8000;
app.set("view engine", "ejs");
app.use("/css", express.static(path.join(__dirname, "assets/css/")));


app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error = req.flash('error');
  next();
});

//routes...
app.use("/", require("./routes/index"));


app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
