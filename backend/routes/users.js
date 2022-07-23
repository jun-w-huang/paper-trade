const express = require("express");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

// // recordRoutes is an instance of the express router.
// // We use it to define our routes.
// // The router will be added as a middleware and will take control of requests starting with path /record.
const userRoutes = express.Router();

// // This will help us connect to the database
const dbo = require("../db/conn");

// // This help convert the id from string to ObjectId for the _id.
// const ObjectId = require("mongodb").ObjectId;

// // This section will help you get a list of all the records.
// userRoutes.route("/users").get(function (req, res) {
//   let db_connect = dbo.getDb("users");
//   db_connect
//     .collection("users")
//     .find({})
//     .toArray(function (err, result) {
//       if (err) throw err;
//       res.json(result);
//     });
// });

// // This section will help you get a single record by id
// userRoutes.route("/users/:id").get(function (req, res) {
//   let db_connect = dbo.getDb();

//   let myquery = { _id: ObjectId(req.params.id) };
//   db_connect.collection("users").findOne(myquery, function (err, result) {
//     if (err) throw err;
//     res.json(result);
//   });
// });

// // update
// userRoutes.route("/update/:id").post(function (req, response) {
//   let db_connect = dbo.getDb();
//   let myquery = { _id: ObjectId(req.params.id) };
//   let newvalues = {
//     $set: {
//       portfolio: req.body.portfolio,
//       stocks: req.body.stocks,
//     },
//   };
//   db_connect
//     .collection("users")
//     .updateOne(myquery, newvalues, function (err, res) {
//       if (err) throw err;
//       console.log("1 document updated");
//       response.json(res);
//     });
// });

// create new users / register
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
          name: req.body.username + "'s portfolio",
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
                  console.log(res);
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
