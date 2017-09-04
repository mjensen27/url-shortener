var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var url = require('./models/url');
app.use(bodyParser.json());
app.use(cors());
app.set('json spaces', 2);


var promise = mongoose.connect(process.env.MONGO_URI, {
    useMongoClient: true
});

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

app.get('/new/:longUrl(*)', (req, res) => {
    var longUrl = req.params.longUrl;
    longUrl = longUrl.toLowerCase();
    var re = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);

    if (longUrl.match(re)) {
        url.findOne({
            'long': longUrl
        }, (err, data) => {
            if (err) return handleError(err);

            if (data) {
                var numAssign = data.short;
            } else {
                var numAssign = Math.floor(Math.random() * 10000).toString();
                var entry = new url({
                    long: longUrl,
                    short: numAssign
                });

                entry.save((err) => {
                    if (err) return handleError(err);
                });
            }
            res.json({
                'Original URL': longUrl,
                'Shortened URL': 'https://fluff-hydrant.glitch.me/' + numAssign
            });
        });

    } else {
        res.send('Invalid URL: Please use a valid format for URL');
    }
});

app.get('/:shortUrl', (req, res) => {
    var shortUrl = req.params.shortUrl;
    url.findOne({
        'short': shortUrl
    }, (err, data) => {
        if (err) return handleError(err);
        if (data) {
          var re = new RegExp(/^(http|https):\/\//i);
          if (data.long.match(re)) {
              res.redirect(301, data.long);
          } else {
              res.redirect(301, 'http://' + data.long);
          }
        } else { return }
    });
});

app.listen(process.env.PORT, () => {
    console.log('Server is online')
});