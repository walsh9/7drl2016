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
    if (this.crates[index].known || true) {
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

Game.Crates.actions.explode = function(x, y, map, crateId) {
  var blastZone = [{x: x - 1, y: y - 1}, {x: x, y: y - 1}, {x: x + 1, y: y - 1},
                   {x: x - 1, y: y},     {x: x, y: y},     {x: x + 1, y: y},
                   {x: x - 1, y: y + 1}, {x: x, y: y + 1}, {x: x + 1, y: y + 1}];
  console.log('BOOM');
  function blastCell(pos) {
    var cell = map.grid.getCell(pos.x, pos.y);
    if (cell) {
      Game.Screen.addEffect("boom", pos, 0xffffff, 200);
      var target = map.entityAt(cell.x, cell.y);
      if (target) {
        target.kill('explosion');
      }
      cell.blasted = true;
      cell.neighbors().forEach(function(neighbor){ //link to blasted neigbors
        if (neighbor.blasted && !cell.linked(neighbor)) {
          cell.link(neighbor);
        }
      });
    }
  }
  function cleanUp(pos) {
    var cell = map.grid.getCell(pos.x, pos.y);
    if (cell) {
      cell.blasted = undefined;
    }
  }
  blastZone.forEach(blastCell);
  Game.display.render(Game.stage);
  blastZone.forEach(cleanUp);

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
    action: Game.Crates.actions.explode    
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
