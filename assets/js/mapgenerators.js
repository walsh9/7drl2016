Game.Map.Generators.Basic = {
  create: function(width, height) {
    var linkTarget = {};
    var grid = Object.create(Game.Grid).init(width, height);
    var map = Object.create(Game.Map).init(grid);
    var cell = map.grid.randomCell();
    for (var linkCount = 0; linkCount < 80; linkCount++) {
      var undugNeighbors = cell.neighbors().filter(function(cell) {return !cell.dug;});
      linkTarget = undugNeighbors[Math.floor(ROT.RNG.getUniform() * (undugNeighbors.length - 1))];
      if (linkTarget && ROT.RNG.getUniform() < 0.95) {
        cell.link(linkTarget);
        cell = linkTarget;
      } else {
        cell = map.randomUndug();
      }
    }
    console.log(map);
    return map;
  },
  populate: function(map) {
    var target, n;
    var enemyCount = 4;
    var crateCount = 6;
    for (n = 0; n < enemyCount; n++) {
      target = map.randomDug();
      var enemy = Object.create(Game.Entity).init(Game.Entity.templates.skullbot);
      enemy.map = map;
      enemy.setPosition(target.column, target.row);
    }
    for (n = 0; n < crateCount; n++) {
      target = map.randomStable();
      var crate = Object.create(Game.Entity).init(Game.Entity.templates.crate);
      crate.map = map;
      crate.setPosition(target.column, target.row);
    }
    return map;
  }
};