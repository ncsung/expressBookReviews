const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
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

let promiseBooks = () => {
   return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve(books);
    },1000)
   })
}
// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // below is the return of task 2
  // return res.status(200).json(books);

  let asyncBooks = promiseBooks().then((result)=>{
    return res.status(200).json(result);
  })
  
});

const getByISBN = (isbn)=>{
  return new Promise((resolve, reject)=>{
    let isbnNum = parseInt(isbn);
    if(books[isbn]) 
      {resolve(books[isbn]);}
    else 
      {reject({status:404, message:`isbn ${isbn} not found`})}
  })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req,res) {

  //------------------SYNC ---------------------------------------

  // const isbn = req.params.isbn;
  // if(books[parseInt(isbn)]){
  //   return res.status(200).json(books[parseInt(isbn)]);
  // } else{
  //   return res.status(404).json({message:"Not Found"})
  // }

  // async
  const isbn = req.params.isbn;
  getByISBN(isbn).then((result)=>{
    return res.status(200).json(result);
  }, error=>{
    res.status(error.status).json({message:'Could not find based off isbn'})
  })
 });


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  //------------------SYNC ---------------------------------------

  // let bookDetails = [];
  // for (const book in books){
  //   if(books[book].author.replaceAll(" ", "").toLowerCase() === author.toLowerCase()) bookDetails.push(books[book])
  // }
  // if(bookDetails.length >= 1){
  //   return res.status(200).json(bookDetails);
  // }else{
  //   return res.status(404).json({message: "Can't find books from this author"});
  // }

  //async TASK 12

  promiseBooks().then((bookEntries)=> Object.values(bookEntries))
  .then((bookAsync)=> bookAsync.filter((book)=> book.author.replaceAll(" ","").toLowerCase() , author.replaceAll(" ","").toLocaleLowerCase()))
  .then((filteredBooks)=> res.json({message: filteredBooks}))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase().replaceAll(" ", "");

  //------------------SYNC ---------------------------------------

  // const bookDetails = []
  // for (const book in books){
  //   if(books[book].title.replaceAll(" ", "").toLowerCase() === title) bookDetails.push(books[book])
  // }
  // if(bookDetails.length >= 1){
  //   return res.status(200).json(bookDetails);
  // }else{
  //   return res.status(404).json({message: "Can't find books from this title"});
  // }

  promiseBooks().then((bookEntries)=> Object.values(bookEntries))
  .then((booksAsync)=> booksAsync.filter((book) => title === book.title.replaceAll(" ","").toLowerCase())).then((filteredBooks)=> {
    if(filteredBooks.length > 0) res.status(200).json({message: filteredBooks})
      else res.status(400).send("Not Found")
  }).catch((error) => res.status(404).send(error.status))
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
