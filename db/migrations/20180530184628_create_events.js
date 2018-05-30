exports.up = function (knex, Promise) {
  return knex.schema.createTable('events', table => {
    table.string('id').primary()
    table.string('name')
    table.string('description')
    table.string('creator_name')
    table.string('creator_email')
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('events')
};
