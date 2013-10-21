
var cheerio = require('cheerio'),
  request = require('request');

var sorter = function (a, b) {
  return b.score - a.score;
};

var run = function (post, nested, done) {
  request('http://news.ycombinator.com/item?id=' + post, function (err, res, body) {
    if (err || res.statusCode !== 200) return done(err || res.statusCode);

    var $ = cheerio.load(body),
      vals = [];

    if (nested) {
      vals = {
        like: [],
        dislike: []
      };
      var next = 'like';
    }

    $('table table table').first().find('tr').each(function() {
      if (err) return;

      var title = this.find('font'),
        score = this.find('.comhead span');

      if (title.length) {
        title = title.text(); console.log(title)
        if (nested) {
          title = title.split(' - ');

          if (title.length < 2) {
            err = 'Are you sure this is a nested poll?';
            return done(err);
          }

          vals[title[1].toLowerCase()].push({ title: title[0] });
        } else {
          vals.push({ title: title });
        }
      } else if (score.length) {
        score = +(score.text().split(' ')[0]);
        if (nested) {
          var ob = vals[next][vals[next].length - 1];

          if (!ob) {
            err = 'Are you sure this is a nested poll?';
            return done(err);
          }

          ob.score = score;
          next = next === 'like' ? 'dislike' : 'like';
        } else {
          vals[vals.length - 1].score = score;
        }
      }
    });

    if (err) return;

    if (nested) {
      for (var key in vals) {
        vals[key].sort(sorter);
      }
    } else {
      vals.sort(sorter);
    }

    done(null, vals);
  });
};

/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.render('index', { error: req.query.error });
};

exports.rank = function(req, res) {
  if (!req.query.post || !req.query.post.match(/^\d+$/)) {
    return res.redirect('/?error=invalid-post');
  }

  var nested = req.query.nested && req.query.nested === 'on';
  run(req.query.post, nested, function (err, list) {
    console.log(err)
    res.render('rank', { err: err, list: list, nested: nested });
  });
};

