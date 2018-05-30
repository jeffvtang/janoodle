"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    res.status(200).send();

    /*knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });*/
  });

  return router;
}
