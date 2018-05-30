exports.seed = function(knex, Promise) {
    return knex('events').del()
      .then(function () {
        return Promise.all([
          knex('events').insert({id: 1, name: 'Code event name', description: 'Lighthouse coding', creator_name: 'Alice', creator_email: 'a@gmail.com'}),
          knex('events').insert({id: 2, name: 'BBQ event', description: 'Lighthouse BBQ', creator_name: 'Chris', creator_email: 'chris@gmail.com'}),
          knex('events').insert({id: 3, name: 'networking event', description: 'Lighthouse networking', creator_name: 'Peter', creator_email: 'peter@gmail.com'}),
        ]);
      });
  };
  