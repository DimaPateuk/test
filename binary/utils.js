const fs = require('fs');

var exports = module.exports = {};

const h = 3*60*60*1000;
exports.time = function time(date) {
    return date
        ? new Date(+new Date(date))
        : new Date(+new Date());
}

exports.tryAfterSomeTime = function tryAfterSomeTime (cb) {
    return setTimeout(cb, 100);
}

exports.appenedAsync = function appenedAsync (path, data) {
    return new Promise((res) => {
        fs.appendFile(path, data, res);
    });
}
exports.getYoutubeLikeToDisplay = function getYoutubeLikeToDisplay(millisec) {
    var seconds = (millisec / 1000).toFixed(0);
    var minutes = Math.floor(seconds / 60);
    var hours = "";
    if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        hours = (hours >= 10) ? hours : "0" + hours;
        minutes = minutes - (hours * 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
    }

    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    if (hours != "") {
        return hours + ":" + minutes + ":" + seconds;
    }
    return minutes + ":" + seconds;
}

exports.toStr = function toStr (data) {
    return JSON.stringify(data);
}

exports.toJson = function toJson (data) {
    return JSON.parse(data);
}

exports.tryAfterSomeTime = function tryAfterSomeTime (cb) {
    return setTimeout(cb, 100);
}

exports.appenedAsync = function appenedAsync (path, data) {
    return new Promise((res) => {
        fs.appendFile(path, data, res);
    });
}
