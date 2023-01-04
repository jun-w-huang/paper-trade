const express = require("express");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

const ObjectId = require("mongodb").ObjectId;

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const authRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

/**
 * @route POST users
 * @desc Given a username and password, returns that user's credentials and a token if valid,
 * @access Public
 */
authRoutes.route("/auth").post(function (req, response) {
  // simple validation https://www.youtube.com/watch?v=USaB1adUHM0&list=PLillGF-RfqbbiTGgA77tGO426V3hRF9iE&index=9
  if (!req.body.username || !req.body.password) {
    return response.status(400).json({ msg: "Please enter all fields!" });
  }
  let myquery = { username: req.body.username };

  let db_connect = dbo.getDb();
  // check for existing user
  db_connect.collection("users").findOne(myquery, function (err, res) {
    if (err) throw err;
    if (!res) {
      return response.status(400).json({ msg: "User doesn't exist!" });
    } else {
      // validate password
      bcrypt.compare(req.body.password, res.password).then((isMatch) => {
        if (!isMatch)
          return response.status(400).json({ msg: "Invalid credentials" });
        jwt.sign(
          { id: res._id },
          config.get("jwtSecret"),
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res = {
              token: token,
              id: res._id,
              username: req.body.username,
              stocks: req.body.stocks,
            };
            response.json(res);
          }
        );
      });
    }
  });
});

const auth = require("../middleware/auth");
/**
 * @route GET users
 * @desc Finds a specific user
 * @access Private
 */
authRoutes.route("/auth/user").get(auth, function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.user.id) };

  db_connect.collection("users").findOne(myquery, function (err, res) {
    if (err) throw err;
    delete res.password;
    response.json(res);
  });
});

module.exports = authRoutes;
