
var cheerio = require('cheerio'),
  cron = require('cron').CronJob,
  request = require('request');

var langs = {
  like: [],
  dislike: []
};

var next = 'like';

var refresh = function () { console.log('running')
  request('http://news.ycombinator.com/item?id=6527104', function (err, res, body) {
    var $ = cheerio.load(body);

    var newLangs = {
      like: [],
      dislike: []
    };

    $('table table table').first().find('tr').each(function() {
      var langParts = this.find('font');
      if (langParts.length) {
        langParts = langParts.text().toLowerCase().split(' - ');
        newLangs[langParts[1]].push({ name: langParts[0] });
        return;
      }

      var score = this.find('.comhead span');
      if (score.length) {
        score = score.text().split(' ')[0];
        newLangs[next][newLangs[next].length - 1].score = +score;
        next = next === 'like' ? 'dislike' : 'like';
      }
    });

    for (var favour in newLangs) {
      newLangs[favour].sort(function (a, b) {
        return b.score - a.score;
      });
    }

    langs = newLangs;
    console.log('done')
  });
};

new cron('*/30 * * * * *', refresh, null, true);
refresh();

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { langs: langs });
};