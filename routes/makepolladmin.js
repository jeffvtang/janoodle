const express = require('express');
const makePollAdmin = express.Router();
var crypto = require('crypto');

module.exports = function(knex) {
  makePollAdmin.get('/', (req, res) => {
    // DataHelpers.getAllEvents()
    //   .then(function (result) {
    //     console.log(result)
    //   })
    //   .catch(function (err) {
    //     console.log(err)
    //   });

    knex
      .select()
      .from('events')
      .then(function(result) {
        console.log(result);
      })
      .catch(function(err) {
        console.log(err);
      });

    if (req.session.eventTitle) {
      const templateVars = { eventTitle: req.session.eventTitle };

      return res.render('index.ejs', templateVars);
    } else {
      return res.render('index.ejs');
    }
    console.log(req.session);
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

  makePollAdmin.get('/poll', (req, res) => {
    res.render('poll.ejs');
  });

  makePollAdmin.post('/poll', (req, res) => {
    const urlId = crypto.randomBytes(20).toString('hex');

    const eventName = req.body.eventTitle;
    const eventDate = req.body.eventDate;
    const eventDescription = req.body.eventDescription;
    const eventCreatorName = req.body.eventCreatorEmail;
    const eventCreatorEmail = req.body.eventCreatorEmail;

    console.log(eventDate, eventDescription, eventCreatorEmail);
    knex('events').insert({
      id: urlId,
      name: eventName,
      description: eventDescription,
      creator_name: eventCreatorName,
      creator_email: eventCreatorEmail,
    }).then(console.log("*edit*"))

    return res.render('poll.ejs');
  });

  return makePollAdmin;
};
