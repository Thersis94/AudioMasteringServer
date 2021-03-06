const express = require("express");
const audioService = require('./audio-service')
const { requireAuth } = require("../middleware/jwt-auth");
const fs = require("fs");
const mv = require("mv");
const masteringService = require("../masteringService/masteringService");
const userService = require("../users/users-service")

const audioRouter = express.Router();
const jsonBodyParser = express.json();

audioRouter.route("/").post(jsonBodyParser, (req, res, next) => {
  const userName = req.headers.username;
  const IncomingFile = require("formidable").IncomingForm;
  const form = new IncomingFile();

  let newName = null
  let directoryPath = null;
  let userId = null



  form.on("file", (field, file) => {
    const fileLocation = file.path;
    const fileName = file.name;
    newName = fileName
    const rootUserDir = `C:\\Users\\thers\\AudioMastering\\TestingFolder\\`
    const newPath = `C:\\Users\\thers\\AudioMastering\\TestingFolder\\${userName}\\`;//replave with env variable

    if (!fs.readdirSync(rootUserDir).includes(userName)) {
      fs.mkdir(newPath, function (err) {
        if (err) {
          return console.error(err);
        }
        console.log("Directory created successfully!");
      });
    }
    if (fs.readdirSync(newPath)[0] != 'mastered') {
      fs.mkdir(newPath + "/mastered", function (err) {
        if (err) {
          return console.error(err);
        }
        console.log("Directory created successfully!");
      });
    }
    directoryPath = newPath;
    fs.rename(fileLocation, newPath + fileName, function (err) {
      console.log(err);
    });
  });
  form.on("end", () => {
    function checkFiles() {
      if (fs.readdirSync(directoryPath).length === 1) {
        console.log("waiting for files");
        setTimeout(checkFiles, 1000);
      }
      else {
        masteringService.masterFile(directoryPath, userName)
      }
    }
    checkFiles()
    name = "[Mastered]" + newName.slice(4)
    userService.getUserId(req.app.get("db"), userName)
      .then(userInfo => {
        user_id = userInfo.id
        const newTrack = { name, user_id }
        audioService.insertTrack(req.app.get("db"), newTrack)
      })
    res.json();
  });
  form.parse(req);
});

audioRouter.route("/").get((req, res, next) => {
  const user_name = req.headers.username
  userService.getUserId(req.app.get("db"), user_name)
    .then(userInfo => {
      user_id = userInfo.id
      audioService.getAllTracks(req.app.get("db"), user_id)
        .then(tracks => {
          res.json(tracks);
        })
    })
    .catch(next);
});

audioRouter.route("/download").get((req, res) => {
  const { username, trackname } = req.headers
  const file = `C:\\Users\\thers\\AudioMastering\\TestingFolder\\${username}\\mastered\\${trackname}`;//replace with env variable
  res.set('Content-Type', 'audio/x-wav')
  res.download(file), (err)=>{
    console.log(err)
  };
})

audioRouter.route("/").delete((req, res, next) => {
  const user_name = req.headers.username
  const track = req.headers.trackname
  const file = `C:\\Users\\thers\\AudioMastering\\TestingFolder\\${user_name}\\mastered\\${track}`;//replace with env variable


  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
  }

  userService.getUserId(req.app.get("db"), user_name)
    .then(userInfo => {
      user_id = userInfo.id
      audioService.deleteTrack(req.app.get("db"), user_id, track)
      res.status(200)
    })
    .catch(next);
})

module.exports = audioRouter;

