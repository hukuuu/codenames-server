'use strict';
var shuffle = require('mout/array/shuffle')
var mixin = require('mout/object/mixIn')

const red = 'red'
const blue = 'blue'
const assassin = 'assassin'
const neutral = 'neutral'

class Game {


  constructor(cards) {
    this.cards = cards
    const initialState = this._computeInitialState(this.cards)
    this.turn = initialState.turn
    this.first = initialState.first
    this.winner = false

    this.redTurnCount = 0
    this.blueTurnCount = 0
  }

  getTellState() {
    const cards = this.cards.map(
      c => ({
        text: c.text,
        pos: c.pos,
        revealed: c.revealed,
        type: c.type
      }))

    return {
      cards,
      blueHint: this.blueHint,
      redHint: this.redHint,
      turn: this.turn,
      winner: this.winner,
      show:true
    }
  }

  getGuessState() {
    const cards = this.cards.map(
      c => ({
        text: c.text,
        pos: c.pos,
        revealed: c.revealed,
        type: c.revealed ? c.type : undefined
      }))
    return {
      cards,
      blueHint: this.blueHint,
      redHint: this.redHint,
      turn: this.turn,
      winner: this.winner
    }
  }

  getState() {
    return {
      cards: this.cards,
      turn: this.turn,
      winner: this.winner
    }
  }

  redTell(hint) {
    this._tryThrow('red-tell')
    this.redHint = hint
    this.redTurnCount = this._getCountValue(hint.count)
    this.turn = 'red-guess'
  }

  blueTell(hint) {
    this._tryThrow('blue-tell')
    this.blueHint = hint
    this.blueTurnCount = this._getCountValue(hint.count)
    this.turn = 'blue-guess'
  }

  redGuess(pos) {
    this._tryThrow('red-guess')
    this._revealCard(pos)
    this._computeWinner()

    this.redTurnCount--

    if(this._findCard(pos).type !== 'red' || this.redTurnCount === 0)
      this.turn = 'blue-tell'
  }

  blueGuess(pos) {
    this._tryThrow('blue-guess')
    this._revealCard(pos)
    this._computeWinner()

    this.blueTurnCount--

    if(this._findCard(pos).type !== 'blue' || this.blueTurnCount === 0)
      this.turn = 'red-tell'
  }

  pass() {
    if(this.turn === 'blue-guess')
      this.turn = 'red-tell'
    if(this.turn === 'red-guess')
      this.turn = 'blue-tell'
  }

  _getCountValue(count) {
    if(count === 'infinity' || count === 0)
      return 0
    return count + 1
  }

  _computeWinner() {

    const revealed = this.cards.filter(
      c => c.revealed
    )

    let reds = 0
    let blues = 0
    let assassins = 0

    revealed.forEach(c => {
      if (c.type === assassin)
        assassins++
        if (c.type === red)
          reds++
          if (c.type === blue)
            blues++
    })

    if (assassins === 1) {
      this.winner = this.turn === 'blue-guess' ? 'red' : 'blue'
      return
    }

    if (this.first === 'red') {
      if (reds === 9) {
        this.winner = 'red'
        return
      }
      if (blues === 8) {
        this.winner = 'blue'
        return
      }
    } else {
      if (blues === 9) {
        this.winner = 'blue'
        return
      }
      if (reds === 8) {
        this.winner = 'red'
        return
      }
    }


    this.winner = false

  }


  _revealCard(pos) {
    const card = this._findCard(pos)
    if (!!card.revealed) {
      throw new Error('illegal state: card already revealed pos[' + pos + ']')
    } else {
      card.revealed = true
    }

  }

  _tryThrow(expected) {
    if (this.turn !== expected)
      throw new Error(
        'illegal state' +
        ' you tried: ' + expected +
        ' but turn is: ' + this.turn
      )
  }

  _findCard(pos) {
    return this.cards.filter(
      card => card.pos === pos
    )[0]
  }

  _computeInitialState(cards) {
    const redCards = cards.filter(card => card.type === red)
      .length
    if (redCards === 9)
      return {
        turn: 'red-tell',
        first: 'red'
      }
    else
      return {
        turn: 'blue-tell',
        first: 'blue'
      }
  }

}

module.exports = Game;
