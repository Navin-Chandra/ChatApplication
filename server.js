var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

var dbUrl = "mongodb://localhost/learning-node";

var Message = mongoose.model('Message', {
    name: String,
    message: String
});

// var messages = [{
//         name: 'Tim',
//         message: 'Hi'
//     },
//     {
//         name: 'Jane',
//         message: 'Hello'
//     }
// ]

app.get('/messages', (req, res) => {
  

    Message.findOne({message:' badword'}, (err, censored) =>{
        console.log(censored);
        if(censored) {
            console.log('censored words found', censored);
            Message.deleteOne({_id: censored.id}, (err) =>{
            console.log('removed censored message');
            })
        }
    });

    Message.find({}, (err, messages) => {
        console.log(messages);
        res.send(messages);
    });
    

});

app.post('/messages', (req, res) => {
    // console.log(req.body);
    var message = new Message(req.body);
    message.save((err) => {
        if (err)
            sendStatus(500)

        Message.findOne({message: 'badword'}, (err, censored) =>{
            console.log(censored);
            if(censored) {
                console.log('censored words found', censored);
                Message.deleteOne({_id: censored.id}, (err) =>{
                console.log('removed censored message');
                })
            }
        });
        
      //  messages.push(req.body);
        io.emit('message', req.body)
        res.sendStatus(200);
    })

});

io.on('connection', (socket) => {
    // console.log("a user connected");

})

mongoose.connect(dbUrl, {
     useNewUrlParser: true 
}, (err) => {
    console.log("monogo db connected", err);
});

exports.test = function (req, res) {
    res.render('test');
};

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
});