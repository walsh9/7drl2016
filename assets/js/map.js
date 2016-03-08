Game.Map = {
  init: function(grid) {
    this.grid = grid;
    return this;
  },
  randomDug: function() {
    var cell;
    for (var x = 0; x < this.grid.size * 4; x++) {
      cell = this.grid.randomCell();
      if (cell.dug) {
        return cell;
      }
    }
  },
  randomUndug: function() {
    var cell;
    for (var x = 0; x < this.grid.size * 4; x++) {
      cell = this.grid.randomCell();
      if (!cell.dug) {
        return cell;
      }
    }
  },
  generateTunnels: function() {
    var cell, linkTarget;
    cell = this.grid.randomCell();
    for (var linkCount = 0; linkCount < 80; linkCount++) {
      var undugNeighbors = cell.neighbors().filter(function(cell) {return !cell.dug;});
      linkTarget = undugNeighbors[Math.floor(ROT.RNG.getUniform() * (undugNeighbors.length - 1))];
      if (linkTarget && ROT.RNG.getUniform() < 0.95) {
        cell.link(linkTarget);
        cell = linkTarget;
      } else {
        cell = this.randomUndug();
      }
    }
    return this;
  }
};