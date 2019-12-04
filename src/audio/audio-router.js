const express = require("express");
//const AudioService = require('./things-service')
const { requireAuth } = require("../middleware/jwt-auth");
const fs = require("fs");
const mv = require("mv");
const masteringService = require('../masteringService/masteringService')

const audioRouter = express.Router();
const jsonBodyParser = express.json();

audioRouter.route("/").post(jsonBodyParser, (req, res, next) => {
  const IncomingFile = require("formidable").IncomingForm;
  const form = new IncomingFile();
  console.log(form)
  let directoryPath = null
  
  form.on("userName", (field, file) => {
    console.log(field, file)
  })


  form.on("file", (field, file) => {
    //UserID comes from request, It may need to be authenticated...
    const userID = 'tempUserID'
    const fileLocation = file.path;
    const fileName = file.name;
    const fileState = file.fileState
    //Pass the userID into the end of the new path variable. Later this will be the folder name.
    const newPath = `C:/Users/thers/AudioMastering/TestingFolder/${userID}/`;
    directoryPath = newPath
    fs.rename(fileLocation, newPath + fileName, function(err) {
      console.log(err);
    });
    
  });
  form.on("end", () => {
    console.log('form end')
    function checkFiles() {
    if (fs.readdirSync(directoryPath).length === 2) {
      console.log('beginning mastering')
      masteringService.masterFile(directoryPath);
    }
    else if (fs.readdirSync(directoryPath).length === 3) {
      return console.log('Already mastered')
    }
    else {
      console.log('waiting for files')
      setTimeout(checkFiles, 1000);
    }
  }
  checkFiles()
    res.json();
  });
  form.parse(req);
});

//audioRouter
//  .route('/')
//  .get((req, res, next) => {
//    AudioService.getAllThings(req.app.get('db'))
//      .then(things => {
//        res.json(AudioService.serializeThings(things))
//      })
//      .catch(next)
//  })
//
//audioRouter
//  .route('/:thing_id')
//  .all(requireAuth)
//  .all(checkThingExists)
//  .get((req, res) => {
//    console.log(req)
//    res.json(AudioService.serializeThing(res.thing))
//  })
//
//audioRouter.route('/:thing_id/reviews/')
//  .all(requireAuth)
//  .all(checkThingExists)
//  .get((req, res, next) => {
//    AudioService.getReviewsForThing(
//      req.app.get('db'),
//      req.params.thing_id
//    )
//      .then(reviews => {
//        res.json(AudioService.serializeThingReviews(reviews))
//      })
//      .catch(next)
//  })
//
///* async/await syntax for promises */
//async function checkThingExists(req, res, next) {
//  try {
//    const thing = await AudioService.getById(
//      req.app.get('db'),
//      req.params.thing_id
//    )
//
//    if (!thing)
//      return res.status(404).json({
//        error: `Thing doesn't exist`
//      })
//
//    res.thing = thing
//    next()
//  } catch (error) {
//    next(error)
//  }
//}

module.exports = audioRouter;
