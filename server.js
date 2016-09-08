const http = require('http');
const sockjs = require('sockjs');
const echo = sockjs.createServer({
  sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js'
});
const uuid = require('uuid')
const util = require('util')

const players = []
const sessions = []
const connections = []

const server = http.createServer();
echo.installHandlers(server, {
  prefix: '/echo'
});
server.listen(9999, '0.0.0.0');

echo.on('connection', function(conn) {

  let player = {
    id: uuid.v1()
  }

  connections.push({
    id: player.id,
    conn: conn
  })

  players.push(player)

  conn.on('data', function(message) {
    console.log('[receive] ' + message)
    handleMessage(player, conn, JSON.parse(message))
  });

  conn.on('close', function() {
    console.log('close???')
    console.log(player.currentSessionId)
    var session = findSession(player.currentSessionId)
    session.players.splice(session.players.indexOf(player), 1)
    broadcastSession(session, (message('sessionPlayers', session.players)))

    players.splice(players.indexOf(player), 1)
    connections.splice(connections.indexOf(connections.filter(function(connection) {
      return connection.id === player.id
    })[0]), 1)
  });

});



function handleMessage(player, conn, msg) {
  switch (msg.type) {
    case 'setName':
      player.name = msg.value
      break;

    case 'getSessions':
      conn.write(message('sessions', sessions))
      break;

    case 'createSession':
      var session = {
        id: uuid.v1(),
        name: 'session' + (sessions.length + 1),
        players: []
      }
      sessions.push(session)
      broadcast(connections, message('sessions', sessions))
      break;

    case 'joinSession':
      player.currentSessionId = msg.value
      var session = findSession(msg.value)
      session.players.push(player)
      broadcastSession(session, (message('sessionPlayers', session.players)))
      break;

    case 'getSlot':
      getSlot(conn, player, findSession(msg.value.sessionId), msg.value.slot)
      break;

    // case 'getSessionPlayers':
    //   conn.write(message('sessionPlayers', findSession(msg.value)
    //     .players))
    //   break;

    default:
      console.log('unknown message: ' + JSON.stringify(msg, null, 4))
      break;

  }

}

function getSlot(conn, player, session, slot) {
  var slotTaken = session.players.filter(function(player) {
      return player.slot === slot
    })
    .length > 0
  if (!slotTaken || !slot) {
    player.slot = slot
  }
  broadcastSession(session, (message('sessionPlayers', session.players)))
}

function findSession(id) {
  return sessions.filter(function(session) {
    return session.id === id
  })[0]
}

function message(type, value) {
  var msg = JSON.stringify({
    type: type,
    value: value
  })
  console.log('[send] ' + msg)
  return msg
}

function broadcast(connections, message) {
  connections.forEach(function(conn) {
    conn.conn.write(message)
  })
}

function broadcastSession(session, message) {
  var ids = session.players.map(function(player) {
    return player.id
  })
  console.log(players)
  var conns = connections.filter(function(conn) {
    return ids.indexOf(conn.id) > -1
  })
  console.log(conns.length)

  return broadcast(conns, message)
}
