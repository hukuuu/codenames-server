const shuffle = require('mout/array/shuffle');
const times = (value, times) => {
  const arr = []
  while (times--)
    arr.push(value)
  return arr
}

const types = times('red', 8)
  .concat(times('blue', 8))
  .concat(times('neutral', 7))
  .concat('assassin')

const generate = () => {
  let i = 0
  const cards = types.concat(!!Math.round(Math.random() * 1) ? 'red' : 'blue')
    .map(type => {
      return {
        type: type,
        pos: i++,
        revealed: false,
        show: false
      }
    })

  return shuffle(cards)
}

module.exports = generate;
