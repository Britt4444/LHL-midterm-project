$(document).ready(function() {
//return user id number from cookies to make userId dynamic
  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


  let userId = parseInt(getCookie("user_id"));
console.log("user_id", userId)
  // Fetch user's created events
  $.ajax({
    url: '/api/events',
    method: 'GET',
    success: function(response) {
      // console.log('All events:', response.events);
      // Handle the success response and filter the events by the user ID
      let events = response.events.filter(function(event) {
        return event.creator_id === userId;
      });
      // console.log('Filtered events:', events);
      //reference to html
      let dropdownMenu = $('#created-events');

      // Check if any events exist
      if (events.length > 0) {
        // Clear the dropdown menu
        dropdownMenu.empty();

        // Iterate over each event and create dropdown items
        events.forEach(function(event) {
          let eventItem = $('<a class="dropdown-item" href="#">')
            .text(event.name)
            .append('<div class="float-right">' +
              '<button class="btn btn-sm btn-info edit-event">Edit</button>' +
              '<button class="btn btn-sm btn-danger delete-event">Delete</button>' +
              '</div>');

          // Add event data as data attributes to the event item
          eventItem.data('event', event);

          dropdownMenu.append(eventItem);
        });
      } else {
        // If no events exist, display a message or placeholder item
        dropdownMenu.html('<span class="dropdown-item">No events found</span>');
      }
    },
    error: function(xhr, status, error) {
      // Handle the error response
      console.error('Error fetching events:', error);
    }
  });


  // Handle delete event click
  $(document).on('click', '.delete-event', function(e) {
    e.preventDefault();
    let eventItem = $(this).closest('.dropdown-item');
    let event = eventItem.data('event');
    // Perform delete event action with the event data
    console.log('Delete event:', event);

    // Prompt the user for confirmation before deleting the event
    if (confirm('Are you sure you want to delete this event?')) {
      // Send an AJAX request to delete the event
      $.ajax({
        url: '/api/events/' + event.id,
        method: 'DELETE',
        success: function(response) {
          // Handle the success response
          // console.log('Event deleted:', response);

          eventItem.remove();

          //TRYING TO REMOVE MARKER DOESNT WORK YET
          // console.log("DELETE EVENT", event)
          // map.removeLayer(event.marker);

        },
        error: function(xhr, status, error) {
          // Handle the error response
          console.error('Error deleting event:', error);
        }
      });
    }
  });


});
