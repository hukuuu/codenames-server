const chai = require('chai')
const assert = chai.assert

const generate = require('../cards-generator')

describe('Cards Generator', function() {

  const cards = generate()

  it('should be a function', function() {
    assert.typeOf(generate, 'function')
  });

  it('cards should be 25', function() {
    assert.lengthOf(cards, 25, 'aa')
  });

  it('should have 17 red/blue cards', function() {
    const redBlueCards = cards
      .filter(card => card.type === 'red' || card.type === 'blue')
      .length

    assert.equal(redBlueCards, 17)
  })

  it('should have 7 neutral cards', function() {
    const neutralCards = cards
      .filter(card => card.type === 'neutral')
      .length

    assert.equal(neutralCards, 7)
  });

  it('should have 1 assassin card', function() {
    const assassinCard = cards
      .filter(card => card.type === 'assassin')
      .length

    assert.equal(assassinCard, 1)
  });

  it('cards should be random', function() {
    assert.equal(
      (cards[0].type == cards[1].type) &&
      (cards[0].type == cards[2].type) &&
      (cards[0].type == cards[3].type) &&
      (cards[0].type == cards[4].type) &&
      (cards[0].type == cards[5].type) &&
      (cards[0].type == cards[6].type) &&
      (cards[0].type == cards[7].type), false)
  })

});
