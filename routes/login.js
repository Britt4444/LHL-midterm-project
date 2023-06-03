const express = require('express');
const router = express.Router();
const eventQueries = require('../db/queries/users');

//login and render name of logged in user to index.ejs
router.get('/:user_id', (req, res) => {
  let userId = req.params.user_id;
  res.cookie('user_id', req.params.user_id);
  if (!userId) {
    return res.send({ error: "error" });
  }
  res.redirect('/');
});

// get user name
router.get('/name/:user_id', (req, res) => {
  let userId = req.params.user_id;
  eventQueries
    .getLoggedInUser(userId)
    .then(userName => {
      res.json({ userName });
    });
});

module.exports = router;
