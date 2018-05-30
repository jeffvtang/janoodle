exports.seed = function(knex, Promise) {
  function deleteActors() {
    return knex('attendes').del();
  }

  function deleteMovies() {
    return knex('events').del();
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
      .returning('*');
  }
};
