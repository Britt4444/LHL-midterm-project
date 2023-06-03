const express = require('express');
const router = express.Router();
const eventQueries = require('../db/queries/events');

// get all events
router.get('/', (req, res) => {
  const userId = req.cookies.user_id;
  eventQueries.getEvents(userId)
    .then(events => {
      // console.log("server events",events)
      res.json({ events });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// get user-created events
router.get('/created/:user_id', (req, res) => {
  const userId = req.params.user_id;
  if (!userId) {
    return res.send({ error: "error" });
  }
  eventQueries.getCreatedEvents(userId)
    .then(createdEvents => {
      res.json({ createdEvents });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Get favourite events for a user
router.get('/favourite/:userId', (req, res) => {
  const userId = req.params.userId;

  eventQueries.getFavouriteEvents(userId)
    .then(favouriteEvents => {
      res.json({ favouriteEvents });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// add new event
router.post('/', (req, res) => {
  const userId = req.cookies.user_id;
  if (!userId) {
    return res.send({ error: "error" });
  }
  const newEvent = req.body;
  newEvent.creator_id = userId;
  eventQueries
    .addEvent(newEvent)
    .then((event) => {
      const response = {
        event: event,
        addedEvent: true
      };
      res.send(response);
    })
    .catch((e) => {
      console.error(e);
      res.send(e);
    });
});

// Add favourite event POST /api/events/favourite
router.post('/favourite', (req, res) => {
  const userId = req.cookies.user_id;
  const { eventId } = req.body;
  // Call the addFavouriteEvent function with the userId and eventId
  eventQueries.addFavouriteEvent(userId, eventId)
    .then((favouriteEvent) => {
      // Return the added favourite event as the response
      res.json({ favouriteEvent });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to add event to favourites' });
    });
});

// edit user-created event
router.post('/:event_id', (req, res) => {
  const userId = req.cookies.user_id;
  const eventId = req.params.event_id;
  if (!userId) {
    return res.send({ error: "error" });
  }
  eventQueries
    .editEvent(req.body, eventId)
    .then((event) => {
      const response = {
        event: event,
        editedEvent: true
      };
      res.send(response);
    })
    .catch((e) => {
      console.error(e);
      res.send(e);
    });
});

// delete user-created event
router.delete('/:event_id', (req, res) => {
  const eventId = req.params.event_id;

  eventQueries.deleteEvent(eventId)
    .then(() => {
      res.json({ message: 'Event deleted successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// DELETE FROM FAVOURITE EVNETS
router.delete('/favourites/:event_id', (req, res) => {
  const userId = req.cookies.user_id;
  const eventId = req.params.event_id;

  eventQueries.deleteFavouriteEvents(userId, eventId)
    .then(() => {
      console.log("FIRE", eventId);
      res.json({ message: 'Event deleted successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});


module.exports = router;

