Game.Crates = {};

Game.Crates = {
  init: function() {
    this.colors = Game.Crates.colors.randomize();
    this.crates = Game.Crates.types.randomize();
  },
  random: function() {
    return Math.floor(ROT.RNG.getUniform() * this.crates.length);
  },
  getTile: function(index) {
    if (this.crates[index].known) {
      return this.crates[index].tile;
    } else {
      return "crate_unknown";
    }
  },
  getColor: function(index) {
    return this.colors[index];
  },
  identify: function(index) {
    this.crates[index].known = true;
  }
};

Game.Crates.types = [
  {
    name: "decoy",
    known: false,
    tile: "crate_decoy",
    action: function() {}
  },{
    name: "exploding",
    known: false,
    tile: "crate_blast",
    action: function() {}    
  }
];

Game.Crates.colors = [
0xff00ff,
0xffbbcc
];