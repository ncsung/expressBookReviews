const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let validUser = users.filter((user) => user.username === username)
  if(validUser.length >= 1){
    return true
  }
  return false
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validUser = users.filter((user)=> user.username === username && user.password === password)
  return validUser.length > 0;
}
//only registered users can login
regd_users.post("/", (req,res) => {
  return res.status(200).json(authenticatedUser(req.body.username, req.body.password));
});

//only registered users can login
regd_users.get("/", (req,res) => {
  return res.status(200).json(users);
});

// Registered users can log in, checks queries for login
regd_users.get("/login", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user exists and password matches
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const accessToken = jwt.sign({data: password}, "accessToken", {expiresIn: 60* 60})
    req.session.authorization = {accessToken, username}
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

//only registered users can login
regd_users.post("/login", (req,res) => {
 if (req.body.password ===undefined) console.log("password is undf")
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if(authenticatedUser(username, password)){
    const accessToken = jwt.sign({data: password}, "accessToken", {expiresIn: 60* 60})
    req.session.authorization = {accessToken, username}
    return res.status(200).send("user successfully logged in")
  };

  return res.status(401).json({message: "Can't Log In"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
