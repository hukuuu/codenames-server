var sock = new SockJS('http://localhost:9999/echo');

sock.onopen = function() {
  window.socket = sock
  console.log('gogo')
  state.mode = MODES.CHOOSE_NAME
  update()
};
sock.onmessage = function(e) {
  console.log('[receive]', e.data);
  handleMessage(JSON.parse(e.data))
};
sock.onclose = function() {
  console.log('close');
};

var chooseNameSection = $('#choose-name-section')
var chooseSessionSection = $('#choose-session-section')
var loadingSection = $('#loading')
var lobbySection = $('#lobby')
var sessions = $('#sessions')
var lobbyPlayers = $('#lobby-players')


var MODES = {
  LOADING: 'loading',
  CHOOSE_NAME: 'choose-name',
  CHOOSE_SESSION: 'choose-session'
}

var state = {
  mode: MODES.LOADING,
  sessionId: ''
}


init()

function init() {

  $('#name-button')
    .on('click', chooseName)

  $('#session-button')
    .on('click', createSession)

  lobbyPlayers
    .on('click', getSlot(''))
  $('#blue-tell-slot')
    .on('click', getSlot('blue-tell'))
  $('#blue-guess-slot')
    .on('click', getSlot('blue-guess'))
  $('#red-tell-slot')
    .on('click', getSlot('red-tell'))
  $('#red-guess-slot')
    .on('click', getSlot('red-guess'))

  update()

}

function getSlot(slot) {
  return function() {
    sock.send(message('getSlot', {
      sessionId: state.session.id,
      slot: slot
    }))
  }
}

function createSession() {
  sock.send(message('createSession'))
}

function chooseName() {
  sock.send(message('setName', $('#name')
    .val()))

  state.mode = MODES.CHOOSE_SESSION
  update()

}

function handleMessage(msg) {
  switch (msg.type) {
    case 'sessions':
      listSessions(msg.value)
      break;
    case 'sessionPlayers':
      listSessionPlayers(msg.value)
      break;
    default:
      console.log('couldnt handle message: ' + JSON.stringify(msg))

  }
}

function listSessions(s) {
  sessions.empty()
    .append(s.map(function(session) {
        return '<li id="' + session.id + '">' + session.name + '</li>'
      })
      .join(''))

  sessions.children()
    .on('click', function() {
      var el = $(this)
      var session = {
        id: el.attr('id'),
        name: el.text()
      }

      sock.send(message('joinSession', session.id))
      state.session = session
      state.mode = MODES.LOBBY
      update()
    })

}

function listSessionPlayers(sessionPlayers) {
  var list = lobbyPlayers.find('ul')
  list.empty()
  $('.slots .row div h1:nth-child(2)')
    .text('[empty]')
  sessionPlayers.forEach(function(player) {
    if (player.slot) {
      $('#' + player.slot + '-name')
        .text(player.name)
    } else {
      list.append('<li>' + player.name + '</li>')
    }
  })

}

function update() {

  switch (state.mode) {

    case MODES.LOADING:
      hideAll()
      loadingSection.show()
      break;

    case MODES.CHOOSE_NAME:
      hideAll()
      chooseNameSection.show()
      break;

    case MODES.CHOOSE_SESSION:
      hideAll()
      chooseSessionSection.show()
      sock.send(message('getSessions'))
      break;

    case MODES.LOBBY:
      showLobby()
      break;

    default:
      break;
  }

}

function showLobby() {
  hideAll()
  lobbySection.show()
  $('#lobby-name')
    .text('Game ' + state.session.name)
  sock.send(message('getSessionPlayers', state.session.id))
}

function hideAll() {
  loadingSection.hide()
  chooseNameSection.hide()
  chooseSessionSection.hide()
  lobbySection.hide()
}

function message(type, value) {
  var msg = JSON.stringify({
    type: type,
    value: value
  })
  console.log('[send] ' + msg)
  return msg
}
