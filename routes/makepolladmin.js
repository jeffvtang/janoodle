const express = require('express');
const makePollAdmin = express.Router();


module.exports = function (knex) {
  makePollAdmin.get('/', (req, res) => {

    // DataHelpers.getAllEvents()
    //   .then(function (result) {
    //     console.log(result)
    //   })
    //   .catch(function (err) {
    //     console.log(err)
    //   });  

//     knex.select()
//       .from('attendees')
//       .join('events', 'attendees.event_id', '=', 'events.id')
//       .where('events.id', '111a')
// select attendees.name FROM events
// join attendees on (events.id = attendees.event_id)
// where events.id = '111a';

    // knex.select('attendees.name AS name', 'attendees.id AS attendees_id')
    // .from('events')
    // .join('attendees', 'events.id', '=', 'attendees.event_id')
    // .where('events.id', '111a')

    // SELECT attendees.id AS a_id, attendees.name AS a_name, times.id AS timeslot, is_available AS avail
    // FROM availabilities
    // JOIN attendees ON (attendees.id = availabilities.attendee_id)
    // JOIN events ON (events.id = attendees.event_id)
    // JOIN times ON (times.id = availabilities.time_id)
    // WHERE (events.id = '111a');

    knex.select('attendees.id AS id', 'attendees.name AS name', 'times.id AS timeslot', 'is_available AS avail')
    // knex.select()
    .from('availabilities')
    .join('attendees', 'attendees.id', '=', 'availabilities.attendee_id')
    .join('events', 'events.id', '=', 'attendees.event_id')
    .join('times', 'times.id', '=', 'availabilities.time_id')
    .where('events.id', '111a')
      .then(function (result) {
        results = result
        const templateVars = {
          results: results
        }
        console.log (results)

        return res.render('index.ejs', templateVars);
      })
      .catch(function (err) {
        console.log(err)
      })

    // if (req.session.eventTitle) {
    // } else {
    //   return res.render('index.ejs');
    // }
    // console.log(req.session);
    // res.render('index.ejs');
  });

  makePollAdmin.post('/create', (req, res) => {
    if (!req.body.eventTitle) {
      res.sendStatus(400);
    }

    req.session.eventTitle = req.body.eventTitle;
    const templateVars = { eventTitle: req.session.eventTitle };
    res.render('create', templateVars);
  });

  makePollAdmin.get('/poll', (req, res) => {
    res.render('poll.ejs');
  });

  return makePollAdmin;
};
