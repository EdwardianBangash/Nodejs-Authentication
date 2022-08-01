const { render } = require("ejs");
const bcrypt = require("bcryptjs");
const User = require("../models/users");
const passport = require("passport");

exports.userRegisterRoute = (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  let errors = [];

  //validations
  if (!name || !email || !password || !confirm_password) {
    errors.push({ msg: "All Field are required" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (password.length != confirm_password.length) {
    errors.push({ msg: "Password Confirmation failed" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors: errors,
      name: name,
      email: email,
      password: password,
      confirm_password: confirm_password,
    });
  } else {
    //validation passes..
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors: errors,
          name: name,
          email: email,
          password: password,
          confirm_password: confirm_password,
        });
      }

      //create new user...
      const newUser = new User({
        name,
        email,
        password,
      });

      bcrypt
        .hash(newUser.password, 10, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              req.flash('success_msg', 'You are Registered Successfully! and can Login now');
              res.redirect("/login");
            })
            .catch((err) => console.log(err));
        })
    });
  }
};

exports.userLoginRoute = (req, res, next) => {
  passport.authenticate('local', 
  { successRedirect: '/dashboard',failureRedirect: '/login', failureFlash: true })
  (req, res, next);
}

exports.userLogoutRoute = (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
}
