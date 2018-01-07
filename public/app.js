var app = new Vue({
    el: '#app',
    data() {
        return {
            name: "",
            user_writes: "",
            group_joined: false
        }
    },
    methods: {
        join_group: function() {
            console.log('im called');
            var socket = io.connect('http://localhost:7000');
            this.group_joined = true;
            socket.emit('new_user_entered', {
                new_user_name: this.name
            });

            socket.on('new_user_name', function(result) {
                alertify.success(result.name + ' Joined Room')
                    // alert(result.name + ' Joined Room');
            })
        },
        send_message: function() {
            console.log('ready to send');
            var socket = io.connect('http://localhost:7000');
            var message = {
                name: this.name,
                user_writes: this.user_writes
            }
            socket.emit('new_message', {
                new_message: message,
            });
        },
        get_all_message: function() {
            var socket = io.connect('http://localhost:7000');
            socket.on('all_messages', function(results) {
                var message_body = '';
                for (var a = 0; a < results.all_messages.length; a++) {
                    message_body += '<p><span class="name">';
                    message_body += results.all_messages[a].name;
                    message_body += '</span>';
                    message_body += results.all_messages[a].message;
                    message_body += '</p>';
                    console.log(results.all_messages[a]);
                    if (results.all_messages[a] === this.name) {
                     console.log('results.all_messages[a] ?? ',results.all_messages[a] );
                    }
                }
                $('.message').html(message_body);
            })
        }

    }
})