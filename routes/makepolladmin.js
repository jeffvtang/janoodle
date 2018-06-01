const express = require('express');
const makePollAdmin = express.Router();
var crypto = require('crypto');

function groupByID(objectArray, property) {
  return objectArray.reduce(function(acc, obj) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = {};
    }
    acc[key].name = obj.name;
    acc[key].id = obj.id;
    if (!acc[key].timeID) {
      acc[key].timeID = [];
    }
    acc[key].timeID.push(obj.timeID);
    if (!acc[key].avail) {
      acc[key].avail = [];
    }
    acc[key].avail.push(obj.avail);
    return acc;
  }, {});
}

module.exports = function(knex) {
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
    const urlId = crypto.randomBytes(4).toString('hex');

    const eventName = req.body.eventName;
    const eventStartDate = req.body.eventStartDate;
    const eventEndDate = req.body.eventEndDate;
    const eventDescription = req.body.eventDescription;
    const creatorName = req.body.ceatorName;
    const creatorEmail = req.body.creatorEmail;

    knex('events')
      .insert({
        id: urlId,
        name: eventName,
        description: eventDescription,
        creator_name: creatorName,
        creator_email: creatorEmail,
      })
      .returning('id')
      .then(function(response) {
        return knex('times').insert({
          event_id: urlId,
          start_time: eventStartDate,
          end_time: eventEndDate,
        });
        console.log(response);
      })
      .then(function(x) {
        res.redirect(`/poll/${urlId}`);
      });
    //res.render('poll.ejs')
  });


  makePollAdmin.post('/poll/add', (req, res) => {
    console.log(req.body)

    // knex('attendees')
    //   .insert({
    //     name: req.body.nameInput,
    //     email: req.body.emailInput,
    //     event_id: event_url
    //   })
    //   .returning('id')
    //   .then(function (id) {
    //     return knex('availabilties').insert({
    //       attendee_id: id,
    //       time_id: ,
    //       is_available: *avail
    //     });
    //   })
    //   .then(function (x) {
    //     res.redirect(`/poll/${event_url}`);
    //   })
    //res.render('poll.ejs')
  });

  makePollAdmin.get('/poll/:id', (req, res) => {
    const event_url = req.params.id;
    let templateVars = {};
    knex
      .select()
      .from('events')
      .where('id', event_url)
      .then(function(eventQuery) {
        console.log(eventQuery.length);
        if (eventQuery.length === 0) {
          // if the no results from the event query, return an error
          res.sendStatus(400);
          return Promise.reject('Invalid URL entered');
        } else {
          templateVars.eventInfo = eventQuery;
        }
      })
      .then(function(x) {
        return knex
          .select('times.id AS id', 'start_time AS start', 'end_time AS end')
          .from('times')
          .where('event_id', '=', event_url)
          .groupBy('times.id')
          .orderBy('times.id');
      })
      .then(function(timeQuery) {
        templateVars.timeInfo = timeQuery;
      })
      .then(function(y) {
        return knex
          .select(
            knex.raw(
              `sum(case when is_available = 't' then 1 else 0 end) as count`
            )
          )
          .from('availabilities')
          .join('times', 'time_id', '=', 'times.id')
          .where('event_id', '=', event_url)
          .groupBy('times.id')
          .orderBy('times.id');
      })
      .then(function(availQuery) {
        console.log('time', availQuery);
        templateVars.availInfo = availQuery;
      })
      .then(function(z) {
        return knex
          .select(
            'attendees.id AS id',
            'attendees.name AS name',
            'is_available AS avail',
            'events.id AS e.id',
            'events.name AS e.name',
            'times.id AS timeID'
          )
          .from('availabilities')
          .join('attendees', 'attendees.id', '=', 'availabilities.attendee_id')
          .join('events', 'events.id', '=', 'attendees.event_id')
          .join('times', 'times.id', '=', 'availabilities.time_id')
          .where('events.id', event_url)
          .orderBy('attendees.id', 'times.id')
          .orderBy('times.id');
      })
      .then(function(attendeeQuery) {
        templateVars.attendeeInfo = groupByID(attendeeQuery, 'id');
        templateVars.event_url = event_url;
        // console.log(templateVars)
        return res.render('poll.ejs', templateVars);
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  makePollAdmin.post('/poll/:id/toggle', (req, res) => {
    console.log('console log1', req.body);
    console.log('console log2', req.body.userid);
    console.log('console log2', req.body.timeid);

    knex('availabilities')
    .select('is_available')
      .where('attendee_id', '=', req.body.userid)
      .andWhere('time_id', '=', req.body.timeid)
      .then(function(x) {
        if (x == true){
          knex('availabilities')
          .select('is_available')
            .where('attendee_id', '=', req.body.userid)
            .andWhere('time_id', '=', req.body.timeid)
            .update('is_available', 'false')
        } else if (x == false){
          knex('availabilities')
          .select('is_available')
            .where('attendee_id', '=', req.body.userid)
            .andWhere('time_id', '=', req.body.timeid)
            .update('is_available', 'true')
        }
      });
       // .update('is_available', !'is_available')
       //return res.send(JSON.stringify(req.body)
//SET is_available = NOT is_available
      })
  ;

  return makePollAdmin;
};
