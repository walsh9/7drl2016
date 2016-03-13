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
  },
  doAction: function(index, x, y, map) {
    this.crates[index].action.call(null, x, y, map, index);
  }
};

Game.Crates.colors = [
0xC2C3C7,
0xFFA300,
0x29ADFF,
0xFF004D,
0x00E756,
];

Game.Crates.actions = {};

Game.Crates.actions.createDecoy = function(x, y, map, crateId) {
  var decoy = Object.create(Game.Entity).init(Game.Entity.templates.decoy, x, y);
  map.addEntity(decoy);
  map.targets.push(decoy);
};

Game.Crates.actions.createDigCrate = function(x, y, map, crateId) {
  var digCrate = Object.create(Game.Entity).init(Game.Entity.templates.digCrate, x, y);
  digCrate.color = Game.Crates.getColor(crateId);
  map.addEntity(digCrate);
  digCrate.falling = 2;
  digCrate.act();
};

Game.Crates.actions.createEnemy = function(x, y, map, crateId) {
  var enemy = Object.create(Game.Entity).init(Game.Entity.templates.skullbot, x, y);
  map.addEntity(enemy);
};

Game.Crates.types = [
  {
    name: "decoy",
    known: false,
    tile: "crate_decoy",
    action: Game.Crates.actions.createDecoy
  },{
    name: "exploding",
    known: false,
    tile: "crate_blast",
    action: function() {}    
  },{
    name: "enemy",
    known: false,
    tile: "crate_enemy",
    action: Game.Crates.actions.createEnemy   
  },{
    name: "wall",
    known: false,
    tile: "crate_blocks",
    action: function() {}    
  },{
    name: "dig",
    known: false,
    tile: "crate_fall",
    action: Game.Crates.actions.createDigCrate  
  }
];
