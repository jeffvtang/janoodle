exports.seed = function(knex, Promise) {
  function deleteEvents() {
    return knex('events').del();
  }

  function deleteTimes() {
    return knex('times').del();
  }

  function deleteAttendees() {
    return knex('attendees').del();
  }

  function deleteAvailabilities() {
    return knex('availabilities').del();
  }

  function insertEvents() {
    return knex('events').insert([
      {
        id: '111a',
        name: 'Code event name',
        description: 'Lighthouse coding',
        creator_name: 'Alice',
        creator_email: 'a@gmail.com',
      },
      {
        id: '222b',
        name: 'BBQ event',
        description: 'Lighthouse BBQ',
        creator_name: 'Chris',
        creator_email: 'chris@gmail.com',
      },
      {
        id: '333c',
        name: 'networking event',
        description: 'Lighthouse networking',
        creator_name: 'Peter',
        creator_email: 'peter@gmail.com',
      },
    ]);
  }

  function insertAttendees() {
    return knex('attendees').insert([
      {
        name: 'Joe',
        email: 'joe@gmail.com',
        event_id: '111a',
      },
      {
        name: 'Jessia',
        email: 'jessica@gmail.com',
        event_id: '222b',
      },
    ]);
  }

  function insertTimes() {
    return knex('times').insert([
      { event_id: '111a', start_time: '19800101', end_time: '19800102' },
      { event_id: '222b', start_time: '19801001', end_time: '19801002' },
      { event_id: '333c', start_time: '19990101', end_time: '19990102' },
    ]);
  }

  function insertAvailabilities() {
    return knex('availabilities').insert([{ attendee_id: 8, time_id: 10 },
        { attendee_id: 7, time_id: 11 },
        { attendee_id: 7, time_id: 12 }]);
  }

  return deleteAvailabilities()
    .then(deleteTimes)
    .then(deleteAttendees)
    .then(deleteEvents)
    .then(insertEvents)
    .then(insertAttendees)
    .then(insertTimes)
    .then(insertAvailabilities);
};
