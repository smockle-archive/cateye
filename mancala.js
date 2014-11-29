function isInt(value) {
  return !isNaN(value) && (function (x) { return (x | 0) === x; }) (parseFloat(value));
}

function Mancala() {
  // public variables
  this.board = [ 2, 2, 2, 2 ];

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

    for (var i = half; i < len; i++) {
      div.push(" ");
      div.push(this.board[i]);
      div.push(" |");
    }

    return div.join("");
  };
}

// public functions
Mancala.prototype.play = function(input) {
  var map = {
    move: function() { this.move(args); }.bind(this),
    print: function() { this.print(); }.bind(this),
    exit: function() { this.exit(); }.bind(this)
  };

  var args = input.split(" ");
  command = args.shift();

  if (map.hasOwnProperty(command)) {
    map[command](args);
  } else {
    console.error("error: invalid input");
    this.exit();
  }
};

Mancala.prototype.move = function(args) {
  var index = args[0];
  if (!isInt(index)) {
    console.error("error: invalid input");
    this.exit();
  }

  var marbles = this.board[index];
  this.board[index] = 0;
  while (marbles > 0) {
    this.board[index++]++;
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
