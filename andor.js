/*jshint esnext: true */

function AndOr(board, player) {
  "use strict";

  this.board = board || [1, 1, 1, 1];
  this.moves = {};
  this.len = this.board.length;
  this.half = Math.ceil(this.len / 2);
  this.PLAYERS = Object.freeze({ "ME": 0, "THEM": this.half });
  this.player = player || this.PLAYERS.ME;

  this.chooseMove = function() {
    var move = -1,
    utility = -1 * 2 * this.len;

    for (var i = 0; i < this.half; i++) {
      var _i = i + this.player;
      if (this.board[_i] !== 0 && (move === -1 || this.utility(_i) > utility)) {
        move = _i;
      }
    }

    return move;
  };

  this.distribute = function(index) {
    var marbles = this.board[index];

    this.board[index] = 0;
    while (marbles > 0) {
      this.board[(++index) % this.len]++;
      marbles--;
    }
  };

  this.utility = function(move) {
    var simulate = JSON.parse(JSON.stringify(this.board)),
        utility = 0;

    this.distribute([move]);

    for (let i = 0; i < this.half; i++) {
      var _i = i + this.player;
      utility += this.board[_i];
    }

    this.board = JSON.parse(JSON.stringify(simulate));

    return utility;
  };
}

AndOr.prototype.play = function (ply) {
  var move = this.chooseMove();
  console.log("Move: " + move);
  this.distribute(move);
  return this.board;
};

module.exports = AndOr;
