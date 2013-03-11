/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path');

var app = express();


//SETUP MAILCHIMP API - You must replace your API Key and List ID which you can find in your Mailchimp Account
var MailChimpAPI = require('mailchimp').MailChimpAPI;
var apiKey = 'xxxxyyyyxxxxyyyyxxxxyyyyxxxxxxxx-us6';  // Change this to your Key
var listID = 'uuuuhhhh99';  // Change this to your List ID


// See Mailchimp Node Module - https://github.com/gomfunkel/node-mailchimp
try {
    var mcApi = new MailChimpAPI(apiKey, { version : '1.3', secure : false });
} catch (error) {
    console.log(error.message);
}


//SETUP
app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

// REQUIRE EJS - To view html files directly
app.engine('html', require('ejs').renderFile);
//

// ROUTES
app.get('/', function(req, res) {
    res.render('index.html', {
        pageName : 'Home'
    });
});

//app.get('/', routes.index);
//app.get('/users', user.list);

// Accept the Post from the Form on the Index page and use listSubscribe from API
// Turn the Double Optin off and send messages back

app.post('/subscribe', function(req, res){
    console.log(req);
    mcApi.listSubscribe({id: listID, email_address:req.body.email, double_optin: false}, function (error, data) {
        if (error){
            console.log(error);
            res.send("<p class='error'>Something went wrong. Please try again.</p>");
        }
        else {
            console.log(data);
            res.send("<p class='success'>Thanks for signing up!</p>");
        }
    })
});


// START SERVER
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
