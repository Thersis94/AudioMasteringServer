const express = require("express");
const path = require("path");
const tracksService = require("./tracks-service");
const { requireAuth } = require("../middleware/jwt-auth");

const tracksRouter = express.Router();
const jsonBodyParser = express.json();

tracksRouter.route("/").get((req, res, next) => {
  tracksService.getAllTracks(req.app.get("db"))
    .then(tracks => {
      res.json(tracksService.serializeTracks(tracks));
    })
    .catch(next);
});
