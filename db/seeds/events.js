exports.seed = function (knex, Promise) {

  function deleteEvents() {
    return knex('events').del()
  }

  function deleteTimes() {
    return knex('times').del()
  }

  function insertEvents() {
    return knex('events').insert([
      { id: '111', name: 'Code event name', description: 'Lighthouse coding', creator_name: 'Alice', creator_email: 'a@gmail.com' },
      { id: '222', name: 'BBQ event', description: 'Lighthouse BBQ', creator_name: 'Chris', creator_email: 'chris@gmail.com' },
      { id: '333', name: 'networking event', description: 'Lighthouse networking', creator_name: 'Peter', creator_email: 'peter@gmail.com' }
    ])
  }
  function insertAttendes() {
    return knex('attendes')
      .insert([
        {
          id: 1,
          name: 'Joe',
          email: 'joe@gmail.com',
          event_id: '111',
        },
        {
          id: 2,
          name: 'Jessia',
          email: 'jessica@gmail.com',
          event_id: '222',
        },
        { name: 'Mad Max: Fury Road', year: '2016' },
      ])
    }

  function insertTimes() {
    return knex('times').insert([
      { event_id: '111', start_time: '19800101', end_time: '19800102' },
      { event_id: '222', start_time: '19801001', end_time: '19801002' },
      { event_id: '333', start_time: '19990101', end_time: '19990102' },
    ])
  }

  return deleteTimes()
    .then(deleteEvents)
    .then(insertEvents)
    .then(insertTimes)
}
