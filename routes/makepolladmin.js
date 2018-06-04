const express = require('express');
const makePollAdmin = express.Router();
var crypto = require('crypto');
var api_key = '';
var domain = 'sandboxb8f8fa739b914ab19257c6984b335b9c.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});



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
    //const eventEndDate = req.body.eventEndDate;
    const eventDescription = req.body.eventDescription;
    const creatorName = req.body.ceatorName;
    const creatorEmail = req.body.creatorEmail;

    const dates = eventStartDate.split(', ');
    dates.forEach(date => {});

    console.log(eventStartDate);
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
        dates.forEach(date => {
          knex('times')
            .insert({
              event_id: urlId,
              start_time: date,
              //end_time: eventEndDate,
            })
            .then(function(x) {
              console.log(x);
            });
        });
      })
      .then(function(x) {
        res.redirect(`/poll/${urlId}`);
      });
    //res.render('poll.ejs')
  });

  makePollAdmin.post('/poll/:id/add', (req, res) => {
    
    
    let time = [];
    let avail = [];
    let name = req.body.nameInput;
    let email = req.body.emailInput;
    let event_url = req.params.id;

    var emailMessage = {
      from: 'admin@janoodle.com',
      to: 'jeff.tang@live.com',
      subject: 'Someone has responded to your event!',
      text: name + 'has responded to your event "Social" on JANoodle. Please visit the link to view: http://localhost:8080/poll/' + event_url
    };    

    mailgun.messages().send(emailMessage, function (error, body) {
      console.log(body);
  });

    
    for (let element in req.body) {
      if (element != 'nameInput' && element != 'emailInput') {
        time.push(element);
        if (req.body[element].length == 2){
        avail.push(true)
        } else {
          avail.push(false)
        }
      }
    }
    // console.log('full time', time);
    // console.log('full avail', avail);
    // console.log(name);
    // console.log(email);
    // console.log(event_url);
    
    // time.forEach(function(element, i) {
    // console.log('id:', name, 'time', element, 'avail:', avail[i])
    // console.log('1:', element)
    // console.log('3:', avail[i])
    // })

    knex('attendees')
      .insert({
        name: req.body.nameInput,
        email: req.body.emailInput,
        event_id: req.params.id,
      })
      .returning('id')
      .then(function(id) {
        // console.log('id returned:', id)
        time.forEach(function(element, i) {
          console.log('time insert:', element)
          // console.log('avail insert length:', avail[i].length)
          if (avail[i].length == 2){
            let availInsert = true
          } else {
            let availInsert = false
          }
          knex('availabilities')
            .insert({
              attendee_id: id[0],
              time_id: element,
              is_available: avail[i],
            })
            .then(x => console.log(x));
        });
        // res.render('poll.ejs')
      })
      .then(function(x) {
        res.redirect(`/poll/${event_url}`);
      });
  });

  makePollAdmin.get('/poll/:id', (req, res) => {
    const event_url = req.params.id;
    let templateVars = {};
    knex
      .select()
      .from('events')
      .where('id', event_url)
      .then(function(eventQuery) {
        // console.log(eventQuery.length);
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
          ))
          .from('availabilities')
          .join('times', 'time_id', '=', 'times.id')
          .where('event_id', '=', event_url)
          .groupBy('times.id')
          .orderBy('times.id');
          
      })
      .then(function(availQuery) {
        // console.log('time', availQuery);
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
    // console.log("console log1", req.body);
    // console.log("console log2", req.body.userid);
    // console.log("console log2", req.body.timeid);
    event_url = req.params.id;


    knex('availabilities')
      .select('is_available')
      .where('attendee_id', '=', req.body.userid)
      .andWhere('time_id', '=', req.body.timeid)
      .then(function(x) {
        // console.log(x[0].is_available);
        if (x[0].is_available == true) {
          return knex('availabilities')
            .select('is_available')
            .where('attendee_id', '=', req.body.userid)
            .andWhere('time_id', '=', req.body.timeid)
            .update('is_available', 'false');
        } else if (x[0].is_available == false) {
          return knex('availabilities')
            .select('is_available')
            .where('attendee_id', '=', req.body.userid)
            .andWhere('time_id', '=', req.body.timeid)
            .update('is_available', 't');
        }
      })
      .then(function(y) {
        return res.sendStatus(200);
      });
    });
    
      makePollAdmin.delete("/poll/:id/delete", (req, res) => {
        event_url = req.params.id
        deleteUser = req.body.timeid
        
        knex("availabilities")
        .where("attendee_id", "=", req.body.timeid)
        .del()
        .then(function(x){
          return knex("attendees")
          .where("id", "=", req.body.timeid)
        })
        .then(function(y){
          // return res.redirect(`/poll/${event_url}`);
          return res.sendStatus(200);
        })
      })
    return makePollAdmin;
  };
