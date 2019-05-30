const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretOrKey = require("../../config/keys").secretOrKey;
const passport = require("passport");
const validateRegisterData = require("../../validations/register");
const validateLoginData = require("../../validations/login");
// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Users Works"
  })
);

// @route   POST api/users/register
// @desc    regiser new users route
// @access  Public
router.get("/register", (req, res) => {
  const { errors, isValid } = validateRegisterData(req.body);
  if (!isValid) {
    res.status(404).json(errors);
  }
  const { email, name, password } = req.body;
  User.findOne({
    email
  }).then(user => {
    if (user)
      return res.status(400).json({
        email: "Already Exist"
      });
    else {
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      const newUser = new User({
        name,
        email,
        avatar
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hashedPass) => {
          if (err) throw err;
          newUser.password = hashedPass;
          newUser
            .save()
            .then(user => {
              return res.json(user);
            })
            .catch(err => {
              return console.log(err);
            });
        });
      });
    }
  });
});

// @route   POST api/users/login
// @desc    login users route
// @access  Public

router.get("/login", (req, res) => {
  const { errors, isValid } = validateLoginData(req.body);

  if (!isValid) return res.status(400).json(errors);

  const { email, password } = req.body;
  //Find User by email
  User.findOne({
    email
  }).then(user => {
    // If User not exist return Error
    if (!user) {
      return res.status(400).json({
        email: "User Not Found"
      });
    } else {
      //if email exist compare the two passwords
      bcrypt.compare(password, user.password).then(isMatched => {
        //if password not match return error msg
        if (!isMatched) {
          return res.status(400).json({
            passowrd: "password incorrect"
          });
        } else {
          //if matched
          const { id, name, avatar } = user;
          const payload = {
            id,
            name,
            avatar
          }; // create payload

          // generate JWT token and respond
          jwt.sign(
            payload,
            secretOrKey,
            {
              expiresIn: 3600
            },
            (err, token) => {
              if (err) throw err;
              return res.json({
                status: "success",
                token: "Bearer " + token
              });
            }
          );
        }
      });
    }
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id, name, email, avatar } = req.user;
    res.json({ id, name, email, avatar });
  }
);

module.exports = router;
