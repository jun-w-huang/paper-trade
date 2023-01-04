const express = require("express");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

// userRoutes is an instance of the express router.
// The router will be added as middleware and will take control of requests starting with path /users.
const userRoutes = express.Router();

// // This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

const auth = require("../middleware/auth.js");

/**
 * @route UPDATE users/:id
 * @desc update a user's portfolios and stocks
 * @access Private
 */
userRoutes.route("/update/:id").post(auth, function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      portfolio: req.body.portfolio,
      stocks: req.body.stocks,
    },
  };
  db_connect
    .collection("users")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});

/**
 * @route POST users/add
 * @desc Create new users aka register.
 * @access Public
 */
userRoutes.route("/users/add").post(function (req, response) {
  let db_connect = dbo.getDb();

  // simple validation https://www.youtube.com/watch?v=USaB1adUHM0&list=PLillGF-RfqbbiTGgA77tGO426V3hRF9iE&index=9
  if (!req.body.username || !req.body.password) {
    return response.status(400).json({ msg: "Please enter all fields!" });
  }

  let myquery = { username: req.body.username };

  // check for existing user
  db_connect.collection("users").findOne(myquery, function (err, res) {
    if (err) throw err;
    if (res) {
      return response.status(400).json({ msg: "Username already exists!" });
    } else {
      //create new user from post req
      let newUser = {
        username: req.body.username,
        password: req.body.password,
        portfolio: {
          name: req.body.username + "'s Portfolio",
          cash: 1000000,
        },
        stocks: [],
      };
      //create salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;

          db_connect
            .collection("users")
            .insertOne(newUser, function (err, res) {
              if (err) throw err;
              jwt.sign(
                { id: res.insertedId },
                config.get("jwtSecret"),
                { expiresIn: 3600 },
                (err, token) => {
                  if (err) throw err;
                  res = {
                    token: token,
                    id: res.insertedId,
                    username: newUser.username,
                    password: newUser.password,
                    portfolio: newUser.portfolio,
                    stocks: newUser.stocks,
                  };
                  response.json(res);
                }
              );
            });
        });
      });
    }
  });
});

module.exports = userRoutes;
