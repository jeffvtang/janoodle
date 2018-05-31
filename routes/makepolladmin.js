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
    if (!acc[key].avail) {
      acc[key].avail = []
    }
    acc[key].avail.push(obj.avail)
    return acc;
  }, {});
}

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



    // if (req.session.eventTitle) {
    // } else {
    //   return res.render('index.ejs');
    // }
    // console.log(req.session);
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
      .then(function(response) {
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

    knex.select('attendees.id AS id', 'attendees.name AS name', 'is_available AS avail')
    // knex.select()
    .from('availabilities')
    .join('attendees', 'attendees.id', '=', 'availabilities.attendee_id')
    .join('events', 'events.id', '=', 'attendees.event_id')
    .join('times', 'times.id', '=', 'availabilities.time_id')
    .where('events.id', '111a')
      .then(function (result) {
        // results = result
        var results = groupByID(result, 'id');

        const templateVars = {
          results: results
        }
        console.log (results)

        return res.render('poll.ejs', templateVars);
      })
      .catch(function (err) {
        console.log(err)
      })
      .catch(function(err) {
        console.log(err);
      });


  });

  return makePollAdmin;
};
