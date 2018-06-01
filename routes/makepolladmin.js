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

    knex.select('attendees.id AS id', 'attendees.name AS name', 'is_available AS avail')
      // knex.select()
      .from('availabilities')
      .join('attendees', 'attendees.id', '=', 'availabilities.attendee_id')
      .join('events', 'events.id', '=', 'attendees.event_id')
      .join('times', 'times.id', '=', 'availabilities.time_id')
      .where('events.id', '111a')
      .then(function (query1) {
        // results = result
        var results = groupByID(query1, 'id');
        knex.select('times.id AS id', knex.raw(`sum(case when is_available = 't' then 1 else 0 end) as count`),'start_time AS start', 'end_time AS end')
        // knex.select('times.id AS id', knex.raw(`(case when patients.gender = 1 then 'F' else 'M' end) as gender`),'start_time AS start', 'end_time AS end')
          .from('availabilities')
          .join('times', 'time_id', '=', 'times.id')
          .where('event_id', '111a')
          .groupBy('times.id')
          .orderBy('times.id')
          // SELECT times.id, COUNT(is_available), start_time, end_time
          // FROM availabilities
          // JOIN times on(time_id = times.id)
          // WHERE(event_id = '111a') AND(is_available = 't')
          // GROUP BY times.id
          // ORDER BY times.id;


          .then(function (query2) {
            const templateVars = {
              results: results,
              results2: query2
            }
            // console.log('results2', results2)
            console.log('results', results)
            console.log('result2', query2)
            return res.render('poll.ejs', templateVars);
          })
      })
      .catch(function (err) {
        console.log(err)
      })
      .catch(function (err) {
        console.log(err);
      });


  });

  return makePollAdmin;
};
