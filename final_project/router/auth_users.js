const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [
 
];
const authenticatedUser = (username, password) => {
  return users.find((user) => {
      return (user.username === username && user.password === password);
  });
}
const isValid = (username)=>{
  if(username)
    return true;
  return false;
}

regd_users.get("/users",(req,res) =>{res.status(200).send(users);})
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;

    if (!isValid(username) || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
    
        let accessToken = jwt.sign({
            data: password
        }, 'fingerprint_customer', { expiresIn: 30 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  
});


regd_users.put("/auth/review/:isbn", (req, res) => {
  
  const isbn = req.params.isbn;
  const review = req.query.review;
  books["books"][isbn]['reviews'][req.user] = review
  return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated`);
});

regd_users.delete("/auth/review/:isbn",(req, res) => {
  const isbn = req.params.isbn;
  if (isbn) {
      
      delete books["books"][isbn]['reviews'];
  }
  res.send(`Reviews for the ISBN ${isbn} posted by the user test deleted`);
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
