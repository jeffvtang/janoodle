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

    knex.select('attendees.name')
    .from('events')
    .join('attendees', 'events.id', '=', 'attendees.event_id')
    .where('events.id', '111a')
      .then(function (result) {
        attendeeNames = result
        const templateVars = {
          attendeeNames: attendeeNames
        }
        console.log (attendeeNames)

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
