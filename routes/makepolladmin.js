const express = require('express');
const makePollAdmin = express.Router();
var crypto = require('crypto');

function groupByID(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = {}
    }
    acc[key].name = obj.name
    acc[key].id = obj.id
    if (!acc[key].timeID) {
      acc[key].timeID = []
    }
    acc[key].timeID.push(obj.timeID)
    if (!acc[key].avail) {
      acc[key].avail = []
    }
    acc[key].avail.push(obj.avail)
    return acc;
  }, {});
}

module.exports = function (knex) {


  makePollAdmin.get('/', (req, res) => {
    res.render('index.ejs');
  });



  makePollAdmin.post('/create', (req, res) => {
    if (!req.body.eventTitle) {
      res.sendStatus(400);
    }

    req.session.eventTitle = req.body.eventTitle;
    const templateVars = { eventTitle: req.session.eventTitle };
    res.render('create', templateVars);
  });



  makePollAdmin.post('/poll', (req, res) => {
    const urlId = crypto.randomBytes(10).toString('hex');

    const eventName = req.body.eventTitle;
    const eventStartDate = req.body.eventStartDate;
    const eventEndDate = req.body.eventEndDate;
    const eventDescription = req.body.eventDescription;
    const eventCreatorName = req.body.eventCreatorEmail;
    const eventCreatorEmail = req.body.eventCreatorEmail;

    knex('events')
      .insert({
        id: urlId,
        name: eventName,
        description: eventDescription,
        creator_name: eventCreatorName,
        creator_email: eventCreatorEmail,
      })
      .returning('id')
      .then(function (response) {
        return knex('times').insert({
          event_id: response[0],
          start_time: eventStartDate,
          end_time: eventEndDate,
        });
        console.log(response);
      });

    //res.render('poll.ejs')
    res.redirect(`/poll/${urlId}`);
  });



  makePollAdmin.get('/poll/:id', (req, res) => {
    const event_url = req.params.id;
    let templateVars = {}
    knex.select()
      .from('events')
      .where('id', event_url)
      .then(function (eventQuery) {
        if (eventQuery.length === 0) { // if the no results from the event query, return an error
          return res.sendStatus(400)
        }
        templateVars.eventInfo = eventQuery
        // console.log(eventInfo)
      })
      .then(function (x) {
        knex.select('times.id AS id', knex.raw(`sum(case when is_available = 't' then 1 else 0 end) as count`), 'start_time AS start', 'end_time AS end')
          .from('availabilities')
          .join('times', 'time_id', '=', 'times.id')
          .where('event_id', event_url)
          .groupBy('times.id')
          .orderBy('times.id')
          .then(function (timeQuery) {
            templateVars.timeInfo = timeQuery
          })
      })
      .then(function (y) {
        knex.select('attendees.id AS id', 'attendees.name AS name', 'is_available AS avail', 'events.id AS e.id', 'events.name AS e.name', 'times.id AS timeID')
          .from('availabilities')
          .join('attendees', 'attendees.id', '=', 'availabilities.attendee_id')
          .join('events', 'events.id', '=', 'attendees.event_id')
          .join('times', 'times.id', '=', 'availabilities.time_id')
          .where('events.id', event_url)
          .orderBy('attendees.id', 'times.id')
          .orderBy('times.id')
          .then(function (attendeeQuery) {
            templateVars.attendeeInfo = groupByID(attendeeQuery, 'id')
            // console.log(templateVars.attendeeInfo)
            return res.render('poll.ejs', templateVars);
          })
      })
      // console.log(attendeeQuery)
      // const templateVars = {
      //   eventInfo: eventInfo,
      //   timeInfo: timeInfo,
      //   attendeeInfo: groupByID(attendeeQuery, 'id'),
      // }
      .catch(function (err) {
        console.log(err)
      })
  })
  return makePollAdmin;
};

//   makePollAdmin.get('/poll/:id', (req, res) => {
//     const event_url = req.params.id;

//     knex.select()
//       .from('events')
//       .where('id', event_url)
//       .then(function (eventQuery) {
//         if (eventQuery.length === 0) { // if the no results from the event query, return an error
//           return res.sendStatus(400)
//         }
//         eventInfo = eventQuery
//         // console.log(eventInfo)
//         knex.select('times.id AS id', knex.raw(`sum(case when is_available = 't' then 1 else 0 end) as count`), 'start_time AS start', 'end_time AS end')
//           .from('availabilities')
//           .join('times', 'time_id', '=', 'times.id')
//           .where('event_id', event_url)
//           .groupBy('times.id')
//           .orderBy('times.id')
//           .then(function (timeQuery) {
//             timeInfo = timeQuery
//             knex.select('attendees.id AS id', 'attendees.name AS name', 'is_available AS avail', 'events.id AS e.id', 'events.name AS e.name', 'times.id AS timeID')
//               .from('availabilities')
//               .join('attendees', 'attendees.id', '=', 'availabilities.attendee_id')
//               .join('events', 'events.id', '=', 'attendees.event_id')
//               .join('times', 'times.id', '=', 'availabilities.time_id')
//               .where('events.id', event_url)
//               .orderBy('attendees.id', 'times.id')
//               .orderBy('times.id')
//               .then(function (attendeeQuery) {
//                 // console.log(attendeeQuery)
//                 const templateVars = {
//                   eventInfo: eventInfo,
//                   timeInfo: timeInfo,
//                   attendeeInfo: groupByID(attendeeQuery, 'id'),
//                 }
//                 return res.render('poll.ejs', templateVars);
//               })
//           })

//       })
//       .catch(function (err) {
//         console.log(err)
//       })
//   })
//   return makePollAdmin;
// };



// knex.select('attendees.id AS id', 'attendees.name AS name', 'is_available AS avail', 'events.id AS e.id', 'events.name AS e.name', 'times.id AS timeID')
//   // knex.select()
//   .from('availabilities')
//   .join('attendees', 'attendees.id', '=', 'availabilities.attendee_id')
//   .join('events', 'events.id', '=', 'attendees.event_id')
//   .join('times', 'times.id', '=', 'availabilities.time_id')
//   .where('events.id', event_url)
//   .then(function (query1) {
//     console.log(query1)
//     var results = groupByID(query1, 'id');
//     console.log(results)
//     knex.select('times.id AS id', knex.raw(`sum(case when is_available = 't' then 1 else 0 end) as count`), 'start_time AS start', 'end_time AS end')
//       .from('availabilities')
//       .join('times', 'time_id', '=', 'times.id')
//       .where('event_id', event_url)
//       .groupBy('times.id')
//       .orderBy('times.id')s
//       .then(function (query2) {
//         // console.log(query2.length)
//         if (query2.length === 0) { // a functional doodle should always have times available, otherwise return a bad error
//           return res.sendStatus(400)
//         }
//         var results2 = query2
//         knex.select()
//           .from('events')
//           .where('id', event_url)
//           .then(function (query3) {
//             const templateVars = {
//               results: results,
//               results2: results2,
//               results3: query3
//             }
//             return res.render('poll.ejs', templateVars);
//           })
//       })
//   })
