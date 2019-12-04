const express = require("express");
//const AudioService = require('./things-service')
const { requireAuth } = require("../middleware/jwt-auth");
const fs = require("fs");
const mv = require("mv");
const masteringService = require("../masteringService/masteringService");

const audioRouter = express.Router();
const jsonBodyParser = express.json();

audioRouter.route("/").post(jsonBodyParser, (req, res, next) => {
  const userID = req.headers.username;
  const IncomingFile = require("formidable").IncomingForm;
  const form = new IncomingFile();

  let directoryPath = null;

  form.on("file", (field, file) => {
    const fileLocation = file.path;
    const fileName = file.name;
    const newPath = `C:/Users/thers/AudioMastering/TestingFolder/${userID}/`;
    directoryPath = newPath;
    fs.rename(fileLocation, newPath + fileName, function(err) {
      console.log(err);
    });
  });
  form.on("end", () => {
    console.log("form end");
    function checkFiles() {
      if (fs.readdirSync(directoryPath).length === 3) {
        console.log("beginning mastering");
        masteringService.masterFile(directoryPath);
      } else if (fs.readdirSync(directoryPath).length === 1) {
        return console.log("Already mastered");
      } else if (fs.readdirSync(directoryPath).length === 2) {
        console.log("waiting for files");
        setTimeout(checkFiles, 1000);
      }
    }
    checkFiles();
    function checkForCompletedMaster() {
      const storeArr = fs.readdirSync(directoryPath);
      let masterExists = 0;
      let raw = null;
      let target = null;
      let masteredFile = null;
      for (let i = 0; i < storeArr.length; i++) {
        if (storeArr[i][0] === "R") {
          raw = storeArr[i];
        }
        if (storeArr[i][0] === "T") {
          target = storeArr[i];
        }
        if (storeArr[i][0] === "[") {
          masteredFile = storeArr[i];
          masterExists = 1;
        }
      }
      if (masterExists) {
        if (raw === null || target === null || masteredFile === null) {
          console.log("stopping for null inputs");
        } else {
          fs.unlinkSync(directoryPath + raw);
          fs.unlinkSync(directoryPath + target);
          fs.rename(
            directoryPath + masteredFile,
            directoryPath + "mastered/" + masteredFile,
            function(err) {
              console.log(err);
            }
          );
        }
      } else {
        setTimeout(checkForCompletedMaster, 1000);
      }
    }
    checkForCompletedMaster();
    //add a response to inform client of success or failure
    res.json();
  });
  form.parse(req);
});

module.exports = audioRouter;
