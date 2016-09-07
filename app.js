var sock = new SockJS('http://localhost:9999/echo');

sock.onopen = function() {
  window.socket = sock
  console.log('gogo')
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
var sessions = $('#sessions')

var MODES = {
  CHOOSE_NAME: 'choose-name',
  CHOOSE_SESSION: 'choose-session'
}

var state = {
  mode: MODES.CHOOSE_NAME
}


init()

function init() {

  $('#name-button')
    .on('click', chooseName)

  $('#session-button')
    .on('click', createSession)

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
      if (!!msg.value.length)
        sessions.empty()
        .append(msg.value.map(function(session) {
            return '<li id="' + session.id + '">' + session.name + '</li>'
          })
          .join(''))
      break;
    default:
      console.log('couldnt handle message: ' + JSON.stringify(msg))

  }
}

function update() {

  switch (state.mode) {

    case MODES.CHOOSE_NAME:
      chooseNameSection.show()
      chooseSessionSection.hide()
      break;

    case MODES.CHOOSE_SESSION:
      chooseSessionSection.show()
      chooseNameSection.hide()
      sock.send(message('getSessions'))
      break;

    default:
      break;
  }

}


function message(type, value) {
  var msg = JSON.stringify({
    type: type,
    value: value
  })
  console.log('[send] ' + msg)
  return msg
}
