const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  // 1. Validate input
  if (!username) {
    return res.status(400).json({ message: "missing username" });
  }
  if (!password) {
    return res.status(400).json({ message: "missing password" });
  }

  // 2. Check if user exists (this assumes some user store/DB)
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "User already exists. Maybe log in?" });
  }

  // 3. Save new user (simplified; in practice hash the password!)
  users.push({username: username, password: password});

  // 4. Success
  return res.status(201).json({ message: "Registered successfully" , "users": users});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[parseInt(isbn)]){
    return res.status(200).json(books[parseInt(isbn)]);
  } else{
    return res.status(404).json({message:"Not Found"})
  }
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let bookDetails = [];
  for (const book in books){
    if(books[book].author.replaceAll(" ", "").toLowerCase() === author.toLowerCase()) bookDetails.push(books[book])
  }
  if(bookDetails.length >= 1){
    return res.status(200).json(bookDetails);
  }else{
    return res.status(404).json({message: "Can't find books from this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase().replaceAll(" ", "");
  const bookDetails = []
  for (const book in books){
    if(books[book].title.replaceAll(" ", "").toLowerCase() === title) bookDetails.push(books[book])
  }
  if(bookDetails.length >= 1){
    return res.status(200).json(bookDetails);
  }else{
    return res.status(404).json({message: "Can't find books from this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn

  if(books[isbn]){
    const reviews =  books[isbn].reviews
    return res.status(200).json(reviews);

    }else{
      return res.status(404).json({message: "Can't find this book and reviews"});
    }
});

module.exports.general = public_users;
