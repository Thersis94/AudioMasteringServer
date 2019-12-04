const fs = require("fs");
const runScript = process.env.RUNSCRIPT_LOCATION
const runScriptTemp = process.env.RUNSCRIPTTEMP_LOCATION
const batLocation = process.env.BAT_LOCATION

const masteringService = {
    masterFile(newPath) {
        let rawFile = null
        let targetFile = null
        const fileLocation = newPath
        //console.log(fileLocation)
        fs.readdirSync(fileLocation).forEach(file => {
            if (file[0] === 'R') {
                rawFile = file
            }
            else {
                targetFile = file
            }
        })
        fs.readFile(runScriptTemp, 'utf8', function(err, data) {
            if (err) {
                return console.log(err)
            }
            let result = data.replace(/rawFileVariable/g, rawFile)
            result = result.replace(/targetFileVariable/g, targetFile)
            result = result.replace(/masterDirectory/g, fileLocation)

            fs.writeFile(runScript, result, 'utf8', function (err) {
                if (err) return console.log(err);
            })
        })
        //activate bat
        require('child_process').exec(batLocation, function (err, stdout, stderr) {
            if (err) {
                // Ooops.
                // console.log(stderr);
                return console.log(err);
            }
        
            // Done.
            //console.log(stdout);
        });
    }
}

module.exports = masteringService