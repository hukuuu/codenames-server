const chai = require('chai')
const assert = chai.assert

const Game = require('../game')


var game = null

beforeEach(function() {
  let cards = [{
    "type": "red",
    "pos": 0,
    "revealed": false,
    "show": false
  }, {
    "type": "red",
    "pos": 1,
    "revealed": false,
    "show": false
  }, {
    "type": "red",
    "pos": 2,
    "revealed": false,
    "show": false
  }, {
    "type": "red",
    "pos": 3,
    "revealed": false,
    "show": false
  }, {
    "type": "red",
    "pos": 4,
    "revealed": false,
    "show": false
  }, {
    "type": "red",
    "pos": 5,
    "revealed": false,
    "show": false
  }, {
    "type": "red",
    "pos": 6,
    "revealed": false,
    "show": false
  }, {
    "type": "red",
    "pos": 7,
    "revealed": false,
    "show": false
  }, {
    "type": "blue",
    "pos": 8,
    "revealed": false,
    "show": false
  }, {
    "type": "blue",
    "pos": 9,
    "revealed": false,
    "show": false
  }, {
    "type": "blue",
    "pos": 10,
    "revealed": false,
    "show": false
  }, {
    "type": "blue",
    "pos": 11,
    "revealed": false,
    "show": false
  }, {
    "type": "blue",
    "pos": 12,
    "revealed": false,
    "show": false
  }, {
    "type": "blue",
    "pos": 13,
    "revealed": false,
    "show": false
  }, {
    "type": "blue",
    "pos": 14,
    "revealed": false,
    "show": false
  }, {
    "type": "blue",
    "pos": 15,
    "revealed": false,
    "show": false
  }, {
    "type": "neutral",
    "pos": 16,
    "revealed": false,
    "show": false
  }, {
    "type": "neutral",
    "pos": 17,
    "revealed": false,
    "show": false
  }, {
    "type": "neutral",
    "pos": 18,
    "revealed": false,
    "show": false
  }, {
    "type": "neutral",
    "pos": 19,
    "revealed": false,
    "show": false
  }, {
    "type": "neutral",
    "pos": 20,
    "revealed": false,
    "show": false
  }, {
    "type": "neutral",
    "pos": 21,
    "revealed": false,
    "show": false
  }, {
    "type": "neutral",
    "pos": 22,
    "revealed": false,
    "show": false
  }, {
    "type": "assassin",
    "pos": 23,
    "revealed": false,
    "show": false
  }, {
    "type": "blue",
    "pos": 24,
    "revealed": false,
    "show": false
  }]
  game = new Game(cards)
})

describe('Game', function() {

  describe('initial state', function() {

    it('should have cards', function() {
      assert.property(game.getState(), 'cards')
    });

    it('should calculate initial turn', function() {
      assert.equal(game.getState()
        .turn, 'blue tell')
    })

  });

  describe('blueTell("hint")', function() {

    it('should throw if illegal state', function() {
      try {
        game.blueTell('eee')
        game.blueGuess(0)
        game.redTell('asdf')
        game.redGuess(0)
      } catch (e) {
        return
      }
      assert.fail(null, null, 'should throw error')
    })

    it('should update the hints', function() {
      let hint = 'bluehint'
      game.blueTell(hint)
      assert.equal(game.getState()
        .blueHint, hint)
    });

  });

  describe('redTell("hint")', function() {

    it('should throw if illegal state', function() {
      try {
        game.redTell('asdf')
      } catch (e) {
        return
      }
      assert.fail(null, null, 'should throw error')
    })

    it('should update the hints', function() {
      const hint = 'redhint'
      game.blueTell(hint)
      game.blueGuess(0)
      game.redTell(hint)
      assert.equal(game.getState()
        .redHint, hint)
    });

  });

  describe('redGuess(pos)', function() {

    it('should throw if illegal state', function() {
      try {
        game.redGuess(0)
      } catch (e) {
        return
      }
      assert.fail(null, null, 'should throw error')
    })

    it('should throw if invalid pos', function() {
      try {
        game.blueTell('')
        game.blueGuess(0)
        game.redTell('')
        game.redGuess('invalid')
      } catch (e) {
        return
      }
      assert.fail(null, null, 'should throw error')
    })


  });

  describe('blueGuess(pos)', function() {

    it('should throw if illegal state', function() {
      try {
        game.blueGuess(0)
      } catch (e) {
        return
      }
      assert.fail(null, null, 'should throw error')
    })

    it('should throw if invalid pos', function() {
      try {
        game.blueTell('foo')
        game.blueGuess('invalid')
      } catch (e) {
        return
      }
      assert.fail(null, null, 'should throw error')
    })

  });

  describe('tell/guess("hint")', function() {

    it('should throw if illegal state', function() {
      try {
        game.blueTell('eee')
        game.blueTell('eee')
      } catch (e) {
        return
      }
      assert.fail(null, null, 'should throw error')
    })

    it('should update the turn', function() {
      const hint = 'hoho'

      assert.equal(game.getState()
        .turn, 'blue tell')
      game.blueTell(hint)

      assert.equal(game.getState()
        .turn, 'blue guess')
      game.blueGuess(0)

      assert.equal(game.getState()
        .turn, 'red tell')
      game.redTell(hint)

      assert.equal(game.getState()
        .turn, 'red guess')
      game.redGuess(1)

      assert.equal(game.getState()
        .turn, 'blue tell')
      game.blueTell(hint)

      assert.equal(game.getState()
        .turn, 'blue guess')
      game.blueGuess(2)

      assert.equal(game.getState()
        .turn, 'red tell')
      game.redTell(hint)

      assert.equal(game.getState()
        .turn, 'red guess')
      game.redGuess(3)
      assert.equal(game.getState()
        .turn, 'blue tell')
      game.blueTell(hint)

      assert.equal(game.getState()
        .turn, 'blue guess')
      game.blueGuess(4)

      assert.equal(game.getState()
        .turn, 'red tell')
      game.redTell(hint)

      assert.equal(game.getState()
        .turn, 'red guess')
      game.redGuess(5)
      assert.equal(game.getState()
        .turn, 'blue tell')
      game.blueTell(hint)

      assert.equal(game.getState()
        .turn, 'blue guess')
      game.blueGuess(6)

      assert.equal(game.getState()
        .turn, 'red tell')
      game.redTell(hint)

      assert.equal(game.getState()
        .turn, 'red guess')
      game.redGuess(7)
      assert.equal(game.getState()
        .turn, 'blue tell')
      game.blueTell(hint)

      assert.equal(game.getState()
        .turn, 'blue guess')
      game.blueGuess(8)

      assert.equal(game.getState()
        .turn, 'red tell')
      game.redTell(hint)

      assert.equal(game.getState()
        .turn, 'red guess')
      game.redGuess(9)
    })

  });

  describe('winner is updated', function() {

    it('if assassin hit by red', function() {
      game.blueTell('foo')
      game.blueGuess(0)
      game.redTell('foo')
      game.redGuess(23)

      const winner = game.getState()
        .winner
      assert.equal(winner, 'blue')
    });

    it('if assassin hit by blue', function() {
      game.blueTell('foo')
      game.blueGuess(23)
      const winner = game.getState()
        .winner
      assert.equal(winner, 'red')
    });

  });

  describe('getTellState', function() {

    describe('all cards', function() {

      it('should have show', function() {
        const state = game.getTellState()
        state.cards.forEach(
          c => {
            assert.isTrue(c.show)
          }
        )
      });

    });


    it('should have the turn', function() {
      const state = game.getTellState()
      assert.property(state, 'turn')
    });

    it('should have the winner', function() {
      const state = game.getTellState()
      assert.property(state, 'winner')
    });

  });

  describe('getGuessState', function() {

    describe('all cards', function() {
      it('should not have show', function() {

        const state = game.getGuessState()
          // console.log(state.cards)
        state.cards.forEach(
          c => {
            assert.isTrue(!c.show)
          }
        )

      });
    });

    it('should have the turn', function() {
      const state = game.getTellState()
      assert.property(state, 'turn')
    });

    it('should have the winner', function() {
      const state = game.getTellState()
      assert.property(state, 'winner')
    });

  });

});
