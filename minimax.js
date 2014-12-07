/*jshint esnext: true */

// TODO: Find a better place for this polyfill.
if (![].includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    if (this === undefined || this === null) {
      throw new TypeError('Cannot convert this value to object');
    }
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) k = 0;
    }
    while (k < len) {
      var currentElement = O[k];
      if (searchElement === currentElement ||
        (searchElement !== searchElement && currentElement !== currentElement)) {
          return true;
        }
        k++;
      }
      return false;
    }
}

function Minimax(board, player) {
  "use strict";

  this.board = board || [1, 1, 1, 1];
  this.moves = {};
  this.len = this.board.length;
  this.half = Math.ceil(this.len / 2);
  this.PLAYERS = Object.freeze({ "ME": 0, "THEM": this.half });
  this.player = player || this.PLAYERS.ME;

  this.chooseMove = function() {
    // 1. Draw the boards that result from my potential moves.
    // 2. Draw the boards that result from their potential countermoves.
    // 3. Draw the boards that result from my potential counter-countermoves.

    var backup = JSON.parse(JSON.stringify(this.board));
    var ply = 2;
    var boards = [[]];
    var moves = [[[]]];
    var utility = [[]];

    // Push first board.
    boards[0].push(JSON.parse(JSON.stringify(this.board)));

    for (let i = 0; i <= ply; i++) {
      // Try each board.
      for (let j = 0, boardsLength = (boards[i] || "").length; j < boardsLength; j++) {
        // Set board.
        this.board = JSON.parse(JSON.stringify(boards[i][j]));

        // Get list of available moves.
        if (moves[i] === undefined) { moves[i] = []; }
        if (moves[j] === undefined) { moves[j] = []; }
        moves[i][j] = this.moves();

        // Try each move.
        for (let k = 0, movesLength = (moves[i][j] || "").length; k < movesLength; k++) {
          this.distribute(moves[i][j][k]);

          // Push unique result board into boards.
          if (boards[i+1] === undefined) { boards[i+1] = []; }
          if (!boards[i+1].includes(this.board)) {
            boards[i+1].push(this.board);

            // Get utility for this board.
            if (utility[i+1] === undefined) { utility[i+1] = []; }
                utility[i+1].push(this.utility());
          }

          this.board = JSON.parse(JSON.stringify(boards[i][j]));
        }
      }

      // Swap point of view.
      this.swapPlayer();
    }

    // 4. Circle the board from the set 3. that is worst for me.
    // 5. Circle the board from the set 2. that points to a circled board.
    // 6. Circle the board from the set 1. that points to a circled board.

    var worstIndex = utility[ply+1].indexOf(Math.min.apply(Math, utility[ply+1]));
    var worstBoard = boards[ply+1][worstIndex];

    var getParent = function (board, level) {
      var idx = boards[level].indexOf(board);
      var container = -1;
      var total = -1;

      for (let i = 0, ilen = moves[level-1].length; i < ilen; i++) {
        if (total === idx) { break; }
        container = i;
        for (let j = 0, jlen = moves[level-1][i].length; j < jlen; j++) {
          total = total + 1;
          if (total === idx) { break; }
        }
      }

      return boards[level-1][container];
    };

    // console.log("Circle this board:");
    // console.log(getParent(getParent(worstBoard, ply+1), ply));
    //
    // console.log("Circle this board:");
    // console.log(getParent(worstBoard, ply+1));
    //
    // console.log("Circle this board:");
    // console.log(worstBoard);

    // Reset board.
    this.board = JSON.parse(JSON.stringify(backup));

    // 7. Choose a move that results in an uncircled board.
    var dontChoose = boards[ply-1].indexOf(getParent(getParent(worstBoard, ply+1), ply));
    return moves[0][0][+!dontChoose] || moves[0][0][0];
  };

  this.distribute = function(index) {
    var marbles = this.board[index];

    this.board[index] = 0;
    while (marbles > 0) {
      this.board[(++index) % this.len]++;
      marbles--;
    }
  };

  this.moves = function() {
    var moves = [];

    for (let i = 0; i < this.half; i++) {
      var _i = i + this.player;
      if (this.board[_i] !== 0) {
        moves.push(_i);
      }
    }

    return moves;
  };

  this.getPlayer = function () {
    var self = this;
    return Object.keys(this.PLAYERS).filter(function(key) { return self.PLAYERS[key] === self.player; })[0];
  };

  this.swapPlayer = function () {
    this.player = (this.player == this.PLAYERS.ME) ? this.PLAYERS.THEM : this.PLAYERS.ME;
    return this.player;
  };

  this.utility = function() {
    var utility = 0;

    for (let i = 0; i < this.half; i++) {
      var _i = i + this.player;
      utility += this.board[_i];
    }

    return utility;
  };

  this.divider = function() {
    var div = "-----".split(""),
    len = (this.half - 1) * 4 + 5;

    while(div.length < len) {
      div.push("-");
    }

    return div.join("");
  };

  this.topHalf = function() {
    var div = "|".split("");

    for (var i = 0; i < this.half; i++) {
      div.push(" ");
      div.push(this.board[i]);
      div.push(" |");
    }

    return div.join("");
  };

  this.bottomHalf = function() {
    var div = "|".split("");

    for (var i = (this.len - 1); i >= this.half; i--) {
      div.push(" ");
      div.push(this.board[i]);
      div.push(" |");
    }

    return div.join("");
  };
}

Minimax.prototype.play = function (ply) {
  this.distribute(this.chooseMove());
  return this.board;
};

Minimax.prototype.print = function() {
  console.log(this.divider());
  console.log(this.topHalf());
  console.log(this.divider());
  console.log(this.bottomHalf());
  console.log(this.divider());
};

module.exports = Minimax;
