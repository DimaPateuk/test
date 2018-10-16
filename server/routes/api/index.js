var express = require('express');
var router = express.Router();

router.use(function timeLog (req, res, next) {
  console.log('API: ', Date.now());
  next();
});

router.get('/', function (req, res) {
  res.send('default');
});

router.get('/something', function (req, res) {
  res.send('something');
});

export default router;