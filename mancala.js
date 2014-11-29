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
    print: function() { this.print(); }.bind(this),
    exit: function() { this.exit(); }.bind(this)
  };

  if (map.hasOwnProperty(input)) {
    map[input]();
  } else {
    console.log("invalid input");
    this.exit();
  }
};

Mancala.prototype.move = function(index) {
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
