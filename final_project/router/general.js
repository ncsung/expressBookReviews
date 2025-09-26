const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
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
