Game.Crates = {};

Game.Crates = {
  init: function() {
    this.colors = Game.Crates.colors.randomize();
    this.crates = Game.Crates.types.randomize();
  },
  random: function(limit) {
    limit = limit || this.crates.length - 1;
    return Math.floor(ROT.RNG.getUniform() * limit);
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

Game.Crates.Group = {
  init: function() {
    this.crateList = [];
    return this;
  },
  add: function(crate) {
    this.crateList.push(crate)
  },
  remove: function(crateToRemove) {
    this.crateList = this.crateList.filter(function(crate) {
      return crate !== crateToRemove
    });
  },
  act: function() {
    this.sanityCheck();
    this._sortCrates();
    return this.crateList.reduce(function(prevPromise, crate) {
      return prevPromise.then(function() {
        return crate.act();
      });
    }, Promise.resolve());
  },
  _sortCrates: function() {
    this.crateList = this.crateList.sort(function(crateA, crateB) {
      return (crateB.y * 100 + crateB.x) - (crateA.y * 100 + crateA.x);
    });
  },
  sanityCheck: function() {
    var entitiesInMotion = Object.keys(Game.currentScreen.map.entities)
      .map(function(key) {
        return Game.currentScreen.map.entities[key]
      })
      .filter(function(entity) {
        return ((entity.crateType !== undefined && entity.falling > 0) || 
          entity.isPlayer || 
          entity.canKill
        );
      });
    if (entitiesInMotion.length === 0) {
      Game.currentScreen.map.engine.lock();
    }
  }
}

Game.Crates.colors = [
0xC2C3C7,
0xFFA300,
0x29ADFF,
0xFF004D,
0x00E756,
];

Game.Crates.actions = {};

Game.Crates.actions.createDecoy = function(x, y, map, crateId) {
  Game.Sound.play('decoy_hello');
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
  Game.Sound.play('skull_hello');
  var enemy = Object.create(Game.Entity).init(Game.Entity.templates.skullbot, x, y);
  map.addEntity(enemy);
};

Game.Crates.actions.explode = function(x, y, map, crateId) {
  var blastZone = [{x: x - 1, y: y - 1}, {x: x, y: y - 1}, {x: x + 1, y: y - 1},
                   {x: x - 1, y: y},     {x: x, y: y},     {x: x + 1, y: y},
                   {x: x - 1, y: y + 1}, {x: x, y: y + 1}, {x: x + 1, y: y + 1}];
  function blastCell(pos) {
    Game.Screen.addEffect("boom", pos, 0xffffff, 300);
    var cell = map.grid.getCell(pos.x, pos.y);
    if (cell) {
      var target = map.entityAt(cell.x, cell.y);
      if (target) {
        target.kill({tile:'explosion', niceToBots: false});
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

  Game.Sound.play('explode_1');
  blastZone.forEach(blastCell);
  Game.display.render(Game.stage);
  blastZone.forEach(cleanUp);
};

Game.Crates.actions.laserBlast = function(x, y, map, crateId) {
  var blastZone = [                   {x: x, y: y - 2},
                                      {x: x, y: y - 1},
  {x: x - 2, y: y}, {x: x - 1, y: y}, {x: x, y: y}, {x: x + 1, y: y}, {x: x + 2, y: y},
                                      {x: x, y: y + 1},
                                      {x: x, y: y + 2}];
  var zapcolor = 0xffffff;
  var zapduration = 300;
  Game.Screen.addEffect("laser_top", blastZone[0], zapcolor, zapduration);
  Game.Screen.addEffect("laser_vertical", blastZone[1], zapcolor, zapduration);
  Game.Screen.addEffect("laser_left", blastZone[2], zapcolor, zapduration);
  Game.Screen.addEffect("laser_horizontal", blastZone[3], zapcolor, zapduration);
  Game.Screen.addEffect("laser_center", blastZone[4], zapcolor, zapduration);
  Game.Screen.addEffect("laser_horizontal", blastZone[5], zapcolor, zapduration);
  Game.Screen.addEffect("laser_right", blastZone[6], zapcolor, zapduration);
  Game.Screen.addEffect("laser_vertical", blastZone[7], zapcolor, zapduration);
  Game.Screen.addEffect("laser_bottom", blastZone[8], zapcolor, zapduration);
  function blastCell(pos) {
    var cell = map.grid.getCell(pos.x, pos.y);
    if (cell) {
      var target = map.entityAt(cell.x, cell.y);
      if (target) {
        target.kill({tile:'explosion', niceToBots: false});
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

  Game.Sound.play('explode_2');
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
    name: "laser",
    known: false,
    tile: "crate_cross",
    action: Game.Crates.actions.laserBlast
  },{
    name: "dig",
    known: false,
    tile: "crate_fall",
    action: Game.Crates.actions.createDigCrate  
  }
];
