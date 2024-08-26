const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const fs = require("fs").promises
const path = require('path')
const axios = require('axios');
const doesExist = (username) => {
 
  users.filter((user) => {
      return user.username === username;
  });
  
}


public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;

    
    if (username && password) {
        
        if (!doesExist(username)) {
           
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }

    return res.status(404).json({message: "Unable to register user."});
  
});
const fetch = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books)
    }, 1000);
  });
};

public_users.get('/', async (req, res) => {
  
    let books = await fetch();
    res.status(200).json(books);
});



public_users.get('/isbn/:isbn',function (req, res) {
 
  const isbn = req.params.isbn;
  axios.get("URL") // Replace with actual URL to fetch books
  .then(response => {
    const books = response.data;
    if (books["books"] && books["books"][isbn]) {
      res.status(200).json(books["books"][isbn]);
    } 
    else {
      res.status(404).json({ message: 'Book not found' });
    }
  })
  
  
});

public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookss = [];
  for(let i in books.books){
    let book = books.books[i]
    if(book['author'] === author)
      bookss.push({"isbn":i,"title": book['title'],"reviews":book['reviews']})

  }
  return res.status(200).json({booksbyauthor : bookss});
});

public_users.get('/title/:title',function (req, res) {
  
  const title = req.params.title;
  const bookss = [];
  for(let i in books.books){
    let book = books.books[i]
    if(book['title'] === title)
      bookss.push({"isbn":i,"author": book['author'],"reviews":book['reviews']})

  }
  return res.status(200).json({booksbyauthor : bookss});
});


public_users.get('/review/:isbn',function (req, res) {
  
  const isbn = req.params.isbn;
  return res.status(200).send(books["books"][isbn]["reviews"]);
});

module.exports.general = public_users;
