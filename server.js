'use strict';
const http = require('http');
const sockjs = require('sockjs');
const echo = sockjs.createServer({
  sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js'
});
const uuid = require('uuid')
const util = require('util')

const Game = require('./game/game');
const generateCards = require('./game/cards-generator');

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
    if (session) {
      session.players.splice(session.players.indexOf(player), 1)
      if (session.players.length)
        broadcastSession(session, (message('sessionPlayers', session.players)))
      else
        sessions.splice(sessions.indexOf(session), 1)
    }

    players.splice(players.indexOf(player), 1)
    connections.splice(connections.indexOf(findConnection(player.id)), 1)
  });

});



function handleMessage(player, conn, msg) {
  let session = null
  switch (msg.type) {
    case 'setName':
      player.name = msg.value
      conn.write(message('sessions', stripGame(sessions)))
      break;

    case 'getSessions':
      conn.write(message('sessions', stripGame(sessions)))
      break;

    case 'createSession':
      session = {
        id: uuid.v1(),
        name: 'session' + (sessions.length + 1),
        players: [],
        game: getNewGame()
      }
      sessions.push(session)
      broadcast(connections, message('sessions', stripGame(sessions)))
      break;

    case 'joinSession':
      player.currentSessionId = msg.value
      session = findSession(msg.value)
      session.players.push(player)
      broadcastSession(session, (message('sessionPlayers', session.players)))
      break;

    case 'getSlot':
      getSlot(conn, player, findSession(msg.value.sessionId), msg.value.slot)
      break;

    case 'startGame':

      session = findSession(msg.value)
      broadcastSession(session, (message('gameStarted')))
      broadcastGameState(session)

      break;

    case 'redTell':
      play(player, conn, msg)
      break;

    case 'blueTell':
      play(player, conn, msg)
      break;

    case 'redGuess':
      play(player, conn, msg)
      break;

    case 'blueGuess':
      play(player, conn, msg)
      break;

    case 'pass':
      pass(player)
      break;

    default:
      console.log('unknown message: ' + JSON.stringify(msg, null, 4))
      break;

  }

}

function pass(player) {
  const session =  findSession(player.currentSessionId)
  session.game.pass(player)
  broadcastGameState(session)
}

function play(player, conn, msg) {
  const session = findSession(msg.value.sessionId)
  try {
    session.game[msg.type](player, msg.value.value)
    broadcastGameState(session)
  } catch (e) {
    conn.write(message('error',e.message))
  }
}

function stripGame(sessions) {
  return sessions.map(
    s => ({
      'id': s.id,
      'name': s.name,
      'players': s.players
    })
  )
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

function getNewGame() {
  return new Game(generateCards())
}

function broadcastGameState(session) {

  session.players.forEach(player => {
    const connection = findConnection(player.id)
    const method = player.slot.indexOf('guess') > -1 ? 'getGuessState' : 'getTellState'
    const state = session.game[method]()
    connection.conn.write(message('gameState', state))
  })

}

function findConnection(playerId) {
  return connections.filter(
    c => c.id === playerId
  )[0]
}
