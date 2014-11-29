function Mancala() {
  // public constants
  this.BOARD = [ 2, 2, 2, 2 ];

  // public variables
  this.board = JSON.parse(JSON.stringify(this.BOARD));

  // private variables
  var half = Math.ceil(this.board.length / 2);

  // private functions
  this.divider = function() {
    var div = "-----".split(""),
        len = (half - 1) * 4 + 5;

    while(div.length < len) {
      div.push("-");
    }

    return div.join("");
  };

  this.topHalf = function() {
    var div = "|".split("");

    for (var i = 0; i < half; i++) {
      div.push(" ");
      div.push(this.board[i]);
      div.push(" |");
    }

    return div.join("");
  };

  this.bottomHalf = function() {
    var div = "|".split(""),
        len = this.board.length;

    for (var i = len - 1; i >= half; i--) {
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
        i,
        len = this.board.length;

    for (empties = 0, i = 0; i < half; i++) {
      if (this.board[i] === 0) {
        empties++;
      }
    }
    if (empties === half) { console.log("game over"); return true; }

    for (empties = 0, i = half; i < len; i++) {
      if (this.board[i] === 0) {
        empties++;
      }
    }
    if (empties === half) { console.log("game over"); return true; }

    return false;
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
    // this.exit();
  }
};

Mancala.prototype.all = function(player) {
  var simulate = JSON.parse(JSON.stringify(this.board)),
      half = Math.ceil(simulate.length / 2),
      empties = 0,
      moves = [];

  for (var i = 0; i < half; i++) {
    if (player === "their") { _i = i + half; } else { _i = i; }
    if (simulate[_i] !== 0) {
      moves.push(_i);
    }
  }

  var len = moves.length;
  for (var j = 0; j < moves.length; j++) {
    console.log("Testing " + player + " move. (" + moves[j] + ")");
    this.move([moves[j]]);
    this.print();

    if (this.over()) {
      continue;
    } else {
      return (this.all(player === "their" ? "my" : "their"));
    }
  }
};

Mancala.prototype.reset = function() {
  this.board = JSON.parse(JSON.stringify(this.BOARD));
};

Mancala.prototype.move = function(args) {
  var index = this.firstInt(args),
      marbles = this.board[index],
      len = this.board.length;

  this.board[index] = 0;
  while (marbles > 0) {
    this.board[(++index) % len]++;
    marbles--;
  }
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
