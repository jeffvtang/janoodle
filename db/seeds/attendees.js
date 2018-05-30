// exports.seed = function(knex, Promise) {
    
//     return knex.select().table('events')
//       .then(function(data) {
//         // console.log(data,)
          
//         knex('attendees').del()
//         .then(function () {
//           return Promise.all(
//           [
//             knex('attendees').insert({id: 1, name: 'Joey', email: 'joey@gmail.com', event_id: data[0].id, }),
//             knex('attendees').insert({id: 2, name: 'Jessica', email: 'jessica@gmail.com', event_id: data[1].id, }),
//             knex('attendees').insert({id: 3, name: 'Robert', email: 'joey@gmail.com', event_id: data[2].id, }),
//           ]);
//         });
//       })
//   };