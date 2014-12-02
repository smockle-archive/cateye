function Mancala() {
  // public constants
  this.BOARD = [ 2, 2, 2, 2 ];

  // public variables
  this.board = JSON.parse(JSON.stringify(this.BOARD));
  this.len = this.board.length;

  // private variables
  var half = Math.ceil(this.len / 2);

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
    var div = "|".split("");

    for (var i = (this.len - 1); i >= half; i--) {
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

    for (empties = 0, i = 0; i < half; i++) {
      if (this.board[i] === 0) {
        empties++;
      }
    }
    if (empties === half) { console.log("game over"); return true; }

    for (empties = 0, i = half; i < this.len; i++) {
      if (this.board[i] === 0) {
        empties++;
      }
    }
    if (empties === half) { console.log("game over"); return true; }

    return false;
  };

  this.countermove = function() {
    var move = -1,
        utility = -1 * 2 * this.len;

    for (var i = half; i < this.len; i++) {
      if (this.board[i] !== 0 && (move === -1 || this.utility(i) > utility)) {
        move = i;
      }
    }

    this.distribute(move);

    if (this.over()) {
      this.print();
      this.exit();
    }
    
    return true;
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

    for (utility = 0, i = half; i < this.len; i++) {
      utility += this.board[i];
    }

    this.board = JSON.parse(JSON.stringify(simulate));

    return utility;
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
  for (var j = 0; j < len; j++) {
    console.log("Testing " + player + " move. (" + moves[j] + ")");
    this.distribute(moves[j]);
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
  var index = this.firstInt(args)
      half = Math.ceil(this.len / 2);

  if (this.board[index] === 0 || index >= half) {
    console.error("error: invalid move");
    return false;
  }

  this.distribute(index);

  if (this.over()) {
    this.print();
    this.exit();
  }

  this.print();

  console.log("opponents move");
  this.countermove();
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
