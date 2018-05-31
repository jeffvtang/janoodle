const express = require('express');
const makePollAdmin = express.Router();

module.exports = function() {
  makePollAdmin.get('/', (req, res) => {
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

  makePollAdmin.post('/poll', (req, res) => {
    res.render('poll.ejs');
  });

  return makePollAdmin;
};
