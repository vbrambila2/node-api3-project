const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const Users = require('./users-model');
const Posts = require('../posts/posts-model');

const { logger, validatePost, validateUser, validateUserId } = require('../middleware/middleware');
const req = require('express/lib/request');
const res = require('express/lib/response');

const router = express.Router();

router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get(req.query)
    .then(user => {
      res.json(user);
    })
    .catch(err => console.error(err));
});

router.get('/:id', validateUserId, (req, res, next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user);
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.user)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => next({ error }));
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id, req.user)
    .then(() => {
      res.status(200).json({ ...req.user.id, ...req.user });
    })
    .catch(error => next({ error }));
});

router.delete('/:id', validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  Users.remove(req.user.id)
    .then(() => {
      res.status(200).json(req.user);
    })
    .catch(error => next({ error }));
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  Users.getUserPosts(req.params.id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => next({ error }));
});

router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const postInfo = { text: req.body.text, user_id: req.params.id };
  console.log(postInfo);
  Posts.insert(postInfo)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => next({ error }));
});

// do not forget to export the router
module.exports = router;