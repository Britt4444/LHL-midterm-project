const express = require('express');
const router = express.Router();
const eventQueries = require('../db/queries/events');

router.get('/', (req, res) => {
  eventQueries.getEvents()
    .then(events => {
      res.json({ events });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post('/', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.send({ error: "error" });
  }

  const newEvent = req.body;
  newEvent.creator_id = userId;
  eventQueries
    .addEvent(newEvent)
    .then((event) => {
      res.send(event);
    })
    .catch((e) => {
      console.error(e);
      res.send(e);
    });
});

module.exports = router;
