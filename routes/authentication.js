const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./../models/user');

const authenticationRouter = new express.Router();

authenticationRouter.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

authenticationRouter.post('/sign-up', (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;

  if (password.length === 0){
      next(new Error("Password can't be empty"))
      return
  }

  bcrypt
    .hash(password, 10)
    .then(hashAndSalt => {
      return User.create({
        name,
        passwordHashAndSalt: hashAndSalt
      });
    })
    .then(user => {
        console.log(user)
        console.log(req.session)
      req.session.userId = user._id;
      res.redirect('/');
    })
    .catch(error => {
        console.log(error);
        next(error);
    });
});

authenticationRouter.get('/sign-in', (req, res) => {
  res.render('sign-in');
});


authenticationRouter.post('/sign-in', (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;

  let user;

  User.findOne({
    name
  })
    .then(document => {
      user = document;
      return bcrypt.compare(password, user.passwordHashAndSalt);
    })
    .then(comparison => {
      if (comparison) {
        // Serializing the user
        req.session.userId = user._id;
        res.redirect('/profile');
      } else {
        return Promise.reject(new Error("Password don't match"));
      }
    })
    .catch(error => {
      next(error);
    });
});

authenticationRouter.post('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = authenticationRouter;