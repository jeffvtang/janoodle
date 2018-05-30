exports.up = function (knex, Promise) {
  return knex.schema.createTable('attendees', table => {
    table.increments('id').primary()
    table.string('name')
    table.string('email')
    table.string('event_id')
    table.foreign('event_id').references('events.id')
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('attendees')
};
