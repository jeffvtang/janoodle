exports.up = function (knex, Promise) {
  return knex.schema.createTable('times', table => {
    table.increments('id').primary()
    table.string('event_id')
    table.foreign('event_id').references('events.id')
    table.date('start_time')
    table.date('end_time')
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('times')
};
