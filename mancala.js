var Minimax = require("./minimax");
var AndOr = require("./andor");

function Mancala(strategy) {
  // public constants
  this.BOARD = Object.freeze([ 1, 1, 1, 1 ]);
  this.STRATEGIES = Object.freeze({ "Minimax": "Minimax", "AndOr": "AndOr" });

  // public variables
  this.board = JSON.parse(JSON.stringify(this.BOARD));
  this.strategy = strategy || this.STRATEGIES.Minimax;
  this.len = this.board.length;
  this.half = Math.ceil(this.len / 2);
  this.PLAYERS = Object.freeze({ "ME": 0, "THEM": this.half });
  this.player = this.PLAYERS.ME;

  // private variables

  // private functions
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

  this.firstInt = function(args) {
    var index = args[0];

    function isInt(value) {
      return !isNaN(value) && (function (x) { return (x | 0) === x; }) (parseFloat(value));
    }

    if (!isInt(index)) {
      console.error("error: invalid input");
      this.exit();
    }

    return index;
  };

  this.over = function() {
    var empties,
        i;

    for (empties = 0, i = 0; i < this.half; i++) {
      if (this.board[i] === 0) {
        empties++;
      }
    }
    if (empties === this.half) { console.log("game over"); return true; }

    for (empties = 0, i = this.half; i < this.len; i++) {
      if (this.board[i] === 0) {
        empties++;
      }
    }
    if (empties === this.half) { console.log("game over"); return true; }

    return false;
  };

  this.getPlayer = function () {
    var self = this;
    return Object.keys(this.PLAYERS).filter(function(key) { return self.PLAYERS[key] === self.player; })[0];
  };

  this.swapPlayer = function () {
    this.player = (this.player == this.PLAYERS.ME) ? this.PLAYERS.THEM : this.PLAYERS.ME;
    return this.player;
  };

  this.distribute = function(index) {
    var marbles = this.board[index];

    this.board[index] = 0;
    while (marbles > 0) {
      this.board[(++index) % this.len]++;
      marbles--;
    }
  };
}

// public functions
Mancala.prototype.play = function(input) {
  var map = {
    all: function() { this.all("my"); }.bind(this),
    move: function() { this.move(args); }.bind(this),
    print: function() { this.print(); }.bind(this),
    reset: function() { this.reset(); }.bind(this),
    exit: function() { this.exit(); }.bind(this)
  };

  var args = input.split(" ");
  command = args.shift();

  if (map.hasOwnProperty(command)) {
    map[command](args);
  } else {
    console.error("error: invalid input");
  }
};

Mancala.prototype.all = function(player) {
  var limit = 500;
  this.print();
  while (!this.over() && limit > 0) {
    if (this.strategy == this.STRATEGIES.Minimax) {
      var minimax = new Minimax(this.board, this.player);
      console.log(this.getPlayer());
      this.board = minimax.play();
    } else if (this.strategy == this.STRATEGIES.AndOr) {
      var andor = new AndOr(this.board, this.player);
      console.log(this.getPlayer());
      this.board = andor.play();
    }
    this.print();
    this.swapPlayer();
  }
};

Mancala.prototype.reset = function() {
  this.board = JSON.parse(JSON.stringify(this.BOARD));
};

Mancala.prototype.move = function(args) {
  var index = this.firstInt(args);

  // Check valid move
  if (this.board[index] === 0 || index >= this.half) {
    console.error("error: invalid move");
    return false;
  }

  // My move
  this.distribute(index);

  // Check for game over
  if (this.over()) {
    this.print();
    this.exit();
  }

  this.print();

  // Opponent's move
  this.swapPlayer();
  console.log(this.getPlayer());
  if (this.strategy == this.STRATEGIES.Minimax) {
    var minimax = new Minimax(this.board, this.player);
    this.board = minimax.play();
  } else if (this.strategy == this.STRATEGIES.AndOr) {
    var andor = new AndOr(this.board, this.player);
    this.board = andor.play();
  }
  this.swapPlayer();

  // Check for game over
  if (this.over()) {
    this.print();
    this.exit();
  }

  return true;
};

Mancala.prototype.print = function() {
  console.log(this.divider());
  console.log(this.topHalf());
  console.log(this.divider());
  console.log(this.bottomHalf());
  console.log(this.divider());
};

Mancala.prototype.exit = function() {
  process.exit(0);
};

module.exports = Mancala;
