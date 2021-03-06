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

    try {
    fs.readdirSync(fileLocation).forEach(file => {
      if (file[0] === "R") {
        rawFile = file;
        futureName = file.slice(4);
      }
    });
  }
  catch(err) {
    console.log(err)
  }

  try {
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
  }
  catch(err) {
    console.log(err)
  }

    function runBat() {
      console.log('activation child procress')
      require("child_process").exec(batLocation, function(err, stdout, stderr) {
        if (err) {
          console.log(err);
          setTimeout(runBat, 1000);
        }
        else {
          try {
            fs.unlinkSync(fileLocation + rawFile);
          }
          catch(err) {
            console.log(err)
          }
        }
      });
    }

    try {
      console.log('calling bat')      

    runBat()
    }
    catch(err) {
      console.log(err)
    }
  }
};

module.exports = masteringService;