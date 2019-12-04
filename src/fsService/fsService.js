var fs = require('fs');

module.exports = function move(oldPath, newPath, callback) {

    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            }
            return;
        }
    });

    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error');
        writeStream.on('error');

        readStream.on('close', function () {
            fs.unlink(oldPath);
        });

        readStream.pipe(writeStream);
    }
}