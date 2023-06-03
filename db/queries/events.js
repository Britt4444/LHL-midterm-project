const db = require('../connection');

// Return all events
const getEvents = (userId) => {
  if (userId) {
    return db.query(`SELECT *, music_events.id as id FROM music_events LEFT JOIN user_events ON music_events.id = user_events.music_event_id AND user_events.user_id= $1`, [userId])
      .then(result => {
        return result.rows;
      })
      .catch((error) => {
        throw error;
      });
  }
  return db.query('SELECT * FROM music_events;')
    .then(result => {
      return result.rows;
    })
    .catch((error) => {
      throw error;
    });
};

// Return user-created events
const getCreatedEvents = (userId) => {
  const query = 'SELECT * FROM music_events WHERE creator_id = $1';

  return db.query(query, [userId])
    .then(result => {
      return result.rows;
    })
    .catch((error) => {
      throw error;
    })
};


//get favourite events from user_events table
const getFavouriteEvents = (userId) => {
  return db.query(
    `SELECT music_events.*
    FROM user_events
    JOIN music_events ON user_events.music_event_id = music_events.id
    WHERE user_events.user_id = $1`,
    [userId]
  )
    .then((result) => {

      return result.rows;
    })
    .catch((error) => {
      throw error;
    });
};

// Add new event to music_events
const addEvent = function (event) {
  console.log("EVENT ", event);
  const queryString = `
  INSERT INTO music_events (creator_id, name, description, start_date, end_date, venue, city, latitude, longitude,
  event_link_url, event_thumbnail_url)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  RETURNING *;`;
  const queryParams = [event.creator_id, event.name, event.description, event.start_date, event.end_date, event.venue,
  event.city, event.latitude, event.longitude, event.event_link_url, event.event_thumbnail_url];
  console.log("query", queryString);
  return db
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((error) => {
      throw error;
    })
};

//add favourite event to the table user_events
const addFavouriteEvent = (userId, eventId) => {
  const queryString = `
    INSERT INTO user_events (user_id, music_event_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const queryParams = [userId, eventId];

  return db.query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((error) => {
      throw error;
    });

};

// Update music_events via edit form
const editEvent = (event, eventId) => {
  const queryString = `
  UPDATE music_events
  SET name = $1, description = $2, start_date = $3, end_date = $4, venue = $5, city = $6, latitude = $7, longitude = $8,
  event_link_url = $9, event_thumbnail_url = $10
  WHERE id = $11`;
  const queryParams = [event.name, event.description, event.start_date, event.end_date, event.venue,
  event.city, event.latitude, event.longitude, event.event_link_url, event.event_thumbnail_url, eventId];
  return db
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((error) => {
      throw error;
    })
}

// Delete event from music_events
const deleteEvent = (eventId) => {
  return db.query('DELETE FROM music_events WHERE id = $1', [eventId])
    .then(() => {
      return 'Event deleted successfully';
    })
    .catch((error) => {
      throw error
    });
};

// Delete favourite event from user_events table
const deleteFavouriteEvents = (userId, eventId) => {
  return db.query('DELETE FROM user_events WHERE user_id = $1 AND music_event_id = $2', [userId, eventId])
    .then((result) => {
      console.log('Favourite event deleted successfully', eventId);
      return 'Favourite event deleted successfully';
    })
    .catch((error) => {
      throw error;
    });
};

module.exports = { getEvents, addEvent, editEvent, deleteEvent, getCreatedEvents, getFavouriteEvents, deleteFavouriteEvents, addFavouriteEvent };
