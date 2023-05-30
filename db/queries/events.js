const db = require('../connection');

const getEvents = () => {
  return db.query('SELECT * FROM music_events;')
    .then(data => {

      return data.rows;

    });
};

const addEvent = function(event) {
  const queryString = `
  INSERT INTO music_events (creator_id, name, description, start_date, end_date, venue, city, latitude, longitude,
  event_link_url, event_thumbnail_url)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  RETURNING *;`;
  const queryParams = [event.creator_id, event.name, event.description, event.start_date. event.end_date, event.venue,
    event.city, event.latitude, event.event_link_url, event.event_thumbnail_url];

  return db
    .query(queryString, queryParams)
    .then((result) => {
      if (!result.rows) return null;
      return result.rows;
    })
    .catch((err) => console.log(err.message));
};


const deleteEvent = (eventId) => {
  return db.query('DELETE FROM music_events WHERE id = $1', [eventId])
    .then(() => {
      return 'Event deleted successfully';
    })
    .catch((error) => {
      throw error;
    });
};

module.exports = { getEvents, addEvent, deleteEvent };
