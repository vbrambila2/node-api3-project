const User = require('../users/users-model');

function logger(req, res, next) {
  // DO YOUR MAGIC
  req.timestamp = new Date();
  console.log(req.method);
  console.log(req.url);
  console.log(req.timestamp);
}

function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  User.getById(req.params.id)
    .then(user => {
      if(user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: "user not found" });
      }
    })
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  if (typeof req.body.name !== 'string' || req.body.name.trim() === '') {
    res.status(400).json({ message: "missing required name field" })
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  if(typeof req.body.text !== 'string' || req.body.text.trim() === '') {
    res.status(400).json({ message: "missing required text field" })
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
} 
