const fs = require("fs");
const tracksService = require("../tracks/tracks-service");
const runScript = process.env.RUNSCRIPT_LOCATION;
const runScriptTemp = process.env.RUNSCRIPTTEMP_LOCATION;
const batLocation = process.env.BAT_LOCATION;

const express = require("express");
const path = require("path");
const app = express();

const masteringService = {
  masterFile(newPath, userID) {
    let rawFile = null;
    const rootFolder = `C:/Users/thers/AudioMastering/TestingFolder/`;//Replace with a env variable
    const fileLocation = newPath;
    let futureName = null;
    fs.readdirSync(fileLocation).forEach(file => {
      if (file[0] === "R") {
        rawFile = file;
        futureName = file.slice(4);
      }
    });
    fs.readFile(runScriptTemp, "utf8", function(err, data) {
      if (err) {
        return console.log(err);
      }
      let result = data.replace(/rawFileVariable/g, fileLocation + rawFile);
      result = result.replace(
        /outputFile/g,
        fileLocation + `mastered/` + "[Mastered]" + futureName
      );
      fs.writeFile(runScript, result, "utf8", function(err) {
        if (err) return console.log(err);
      });
    });
    function runBat() {
      require("child_process").exec(batLocation, function(err, stdout, stderr) {
        if (err) {
          console.log(err);
          setTimeout(runBat, 1000);
        }
        else {
          fs.unlinkSync(fileLocation + rawFile);
        }
      });
    }
    runBat()
  }
};

module.exports = masteringService;
runScript