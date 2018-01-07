var express = require('express');
var app = express();

var path = require('path');

var server = app.listen(7000);

var io = require('socket.io').listen(server);

global.mongoskin = require('mongoskin');

var connection_str = 'mongodb://@localhost:27017/chat-app';

global.db = mongoskin.db(connection_str);

db.bind('chats');

var messages = [];

io.sockets.on('connection', function(socket) {
    socket.on('new_user_entered', function(name) {
        var sessionid = socket.id;

        socket.broadcast.emit('new_user_name', {
            name: name.new_user_name
        });

        console.log(' new user ', messages);
        getAllChats(function(err, messages) {
            if (err) {
                return err;
            } else {
                io.emit('all_messages', {
                    all_messages: messages
                });
            }
        });
    });

    socket.on('new_message', function(message) {
        console.log('message in server ', message);
        var new_chat = {
            name: message.new_message.name,
            message: message.new_message.user_writes
        };

        console.log('new_chat obj ', new_chat);
        db.chats.insert(new_chat, function(err, data) {
            if (err) return err;
        });
        getAllChats(function(err, messages) {
            if (err) {
                return err;
            } else {
                io.emit('all_messages', {
                    all_messages: messages
                });
            }
        });
    });
});

function getAllChats(callback) {
    console.log('get all chats ');
    db.chats.find().toArray(function(err, messages) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            console.log(messages);
            callback(null, messages);
        }
    });
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.resolve(__dirname, 'public')));

app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
});