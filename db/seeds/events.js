exports.seed = function (knex, Promise) {
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
    return knex('events').insert([{
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
        id: 1,
        name: 'user1',
        email: 'user1@gmail.com',
        event_id: '111a',
      },
      {
        id: 2,
        name: 'user2',
        email: 'user2@gmail.com',
        event_id: '111a',
      },
      {
        id: 3,
        name: 'user3',
        email: 'user3@gmail.com',
        event_id: '111a',
      },
      {
        id: 4,
        name: 'user4',
        email: 'user4@gmail.com',
        event_id: '222b',
      },
      {
        id: 5,
        name: 'user5',
        email: 'user5@gmail.com',
        event_id: '222b',
      },
      {
        id: 6,
        name: 'user6',
        email: 'user6@gmail.com',
        event_id: '333c',
      },
      {
        id: 7,
        name: 'user7',
        email: 'user7@gmail.com',
        event_id: '333c',
      },
    ]);
  }

  function insertTimes() {
    return knex('times').insert([
      { id: 1, event_id: '111a', start_time: '20100101', end_time: '20100102' },
      { id: 2, event_id: '111a', start_time: '20100109', end_time: '20100110' },
      { id: 3, event_id: '111a', start_time: '20101102', end_time: '20101103' },
      { id: 4, event_id: '111a', start_time: '20101201', end_time: '20101202' },

      { id: 5, event_id: '222b', start_time: '19801001', end_time: '19801002' },
      { id: 6, event_id: '222b', start_time: '19801001', end_time: '19801003' },
      { id: 7, event_id: '222b', start_time: '19801006', end_time: '19801007' },

      { id: 8, event_id: '333c', start_time: '19990101', end_time: '19990102' },
      { id: 9, event_id: '333c', start_time: '19990102', end_time: '19990103' },
    ]);
  }

  function insertAvailabilities() {
    return knex('availabilities').insert([
      {id: 1, attendee_id: 1, time_id: 1, is_available: 'f'},
      {id: 2, attendee_id: 1, time_id: 2, is_available: 't'},
      {id: 3, attendee_id: 1, time_id: 3, is_available: 'f'},
      {id: 4, attendee_id: 1, time_id: 4, is_available: 't'}, //user1 available for timeslot 2 and 4
      {id: 5, attendee_id: 2, time_id: 1, is_available: 't'}, //user2 available for timeslot 1
      {id: 6, attendee_id: 2, time_id: 2, is_available: 'f'},
      {id: 7, attendee_id: 2, time_id: 3, is_available: 'f'},
      {id: 8, attendee_id: 2, time_id: 4, is_available: 'f'},
      {id: 9, attendee_id: 3, time_id: 1, is_available: 'f'},
      {id: 10, attendee_id: 3, time_id: 2, is_available: 'f'},
      {id: 11, attendee_id: 3, time_id: 3, is_available: 't'},
      {id: 12, attendee_id: 3, time_id: 4, is_available: 't'}, //user3 available for timeslot 3 and 4, all availabilities related to event 111a in hardcoded data
      {id: 13, attendee_id: 4, time_id: 5 },
      {id: 14, attendee_id: 7, time_id: 9 },
    ]);
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
