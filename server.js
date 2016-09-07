const http = require('http');
const sockjs = require('sockjs');
const echo = sockjs.createServer({
  sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js'
});
const uuid = require('uuid')
const util = require('util')

const players = []
const sessions = []

const server = http.createServer();
echo.installHandlers(server, {
  prefix: '/echo'
});
server.listen(9999, '0.0.0.0');

echo.on('connection', function(conn) {

  let player = {
    id: uuid.v1(),
    conn: conn
  }

  players.push(player)


  player.conn.on('data', function(message) {
    handleMessage(player, JSON.parse(message))
  });

  player.conn.on('close', function() {
    players.splice(players.indexOf(player), 1)
  });
});



function handleMessage(player, msg) {
  switch (msg.type) {
    case 'setName':
      console.log('set player name: ' + message.value)
      player.name = msg.value
      break;

    case 'getSessions':
      player.conn.write(message('sessions', sessions))
      break;
    case 'createSession':
      console.log(player.name)
      var session = {
        id: uuid.v1(),
        name: 'session' + (sessions.length + 1),
        players: [player.name]
      }
      sessions.push(session)
      console.log(sessions)
      player.conn.write(message('sessions', sessions))
      break;

    default:
      console.log('unknown message: ' + JSON.stringify(msg, null, 4))
      break;

  }

}

function message(type, value) {
  var msg = JSON.stringify(JSON.parse(util.inspect({
    type: type,
    value: value
  })))
  console.log('[send] ' + msg)
  return msg
}
