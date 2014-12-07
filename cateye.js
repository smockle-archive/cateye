#!/usr/bin/env node

var path = require("path"),
    readline = require("readline");
    dashdash = require("dashdash"),
    Mancala = require("./mancala");

var options = [
  {
    names: ['help', 'h'],
    type: 'bool',
    help: 'Print this help and exit.'
  },
  {
    names: ['andor', 'a'],
    type: 'bool',
    help: 'Play mancala against an And-Or algorithm-based opponent.'
  },
  {
    names: ['minimax', 'm'],
    type: 'bool',
    help: 'Play mancala against a Minimax algorithm-based opponent.'
  }
];

var parser = dashdash.createParser({options: options});
try {
  var opts = parser.parse(process.argv);
} catch (e) {
  console.error('%s: error: %s', path.basename(process.argv[1]), e.message);
  process.exit(1);
}

if (opts.help) {
  var help = parser.help().trimRight();
  console.log('usage: node cateye.js [OPTIONS]\n' + 'options:\n' + help);
  process.exit(0);
}

var game;

if (opts.andor) {
  game = new Mancala("AndOr");
}

if (opts.minimax) {
  game = new Mancala("Minimax");
}

if (opts.andor || opts.minimax) {
  var prompt = readline.createInterface(process.stdin, process.stdout);

  prompt.on('line', function(line) {
    game.play(line.trim());
    game.print();
    prompt.prompt();
  }).on('close', function() {
    process.exit(0);
  });

  game.print();
  prompt.prompt();
}
