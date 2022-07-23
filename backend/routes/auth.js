const express = require("express");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const ObjectId = require("mongodb").ObjectId;

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const authRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// authorize user
authRoutes.route("/auth").post(function (req, response) {
  let db_connect = dbo.getDb();
  // simple validation https://www.youtube.com/watch?v=USaB1adUHM0&list=PLillGF-RfqbbiTGgA77tGO426V3hRF9iE&index=9
  if (!req.body.username || !req.body.password) {
    return response.status(400).json({ msg: "Please enter all fields!" });
  }
  let myquery = { username: req.body.username };
  console.log(req.body.username);
  console.log(req.body.password);
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
        console.log(`first ${res}`);
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
            console.log(`second ${res}`);
            response.json(res);
          }
        );
      });
    }
  });
});

authRoutes.route("/auth/user").get(auth, function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.user.id) };
  console.log(req.user.id);

  db_connect.collection("users").findOne(myquery, function (err, res) {
    if (err) throw err;
    delete res.password;
    response.json(res);
  });
});

module.exports = authRoutes;
