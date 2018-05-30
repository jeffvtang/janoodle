exports.up = function (knex, Promise) {
  return knex.schema.createTable('availabilities', table => {
    table.increments('id').primary()
    table.integer('attendee_id')
    table.foreign('attendee_id').references('attendees.id')
    table.integer('time_id')
    table.foreign('time_id').references('times.id')
    table.boolean('is_available').notNullable().defaultTo(false)
  })
};  

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('availabilities')
};
