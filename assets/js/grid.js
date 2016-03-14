Game.Grid = {
  init: function(width, height) {
    this.width = width;
    this.height = height;
    this.size = width * height;
    this.grid = this.prepareGrid();
    this.configureCells();
    return this;
  },
  prepareGrid: function() {
    var x, y;
    var grid = [];
    for(y = 0; y < this.height; y++) {
      grid[y] = [];
      for(x = 0; x < this.width; x++) {
        grid[y][x] = Object.create(Cell).init(x, y);
      }
    }
    return grid;
  },
  configureCells: function() {
    this.eachCell( function(cell) {
      var x = cell.x;
      var y = cell.y;
      cell.north = this.getCell(x, y - 1);
      cell.south = this.getCell(x, y + 1);
      cell.east  = this.getCell(x + 1, y);
      cell.west  = this.getCell(x - 1, y);
    });
  },
  getCell: function(x, y) {
    if  ((x < 0 || x >= this.width) || (y < 0 || y >= this.height)) {
      return undefined;
    }
    return this.grid[y][x];
  },
  randomCell: function() {
    var x = Math.floor(ROT.RNG.getUniform() * (this.width));
    var y = Math.floor(ROT.RNG.getUniform() * (this.height));
    return this.getCell(x, y);
  },
  eachCell: function(callback) {
    var self = this;
    this.grid.forEach(function (y) {
      y.forEach(function(cell) {
        callback.call(self, cell);
      });
    });
  },
  filterCells: function(callback) {
    var cells = [];
    var self = this;
    this.eachCell(function(cell) {
      if (callback.call(self, cell) === true) {
        cells.push(cell);
      }
    });
    return cells;
  }
};

var Cell = {
  init: function(x, y) {
    this.x = x;
    this.y = y;
    this.diggable = true;
    this.dug = false;
    this.impassable = false;
    this.links = [];
    return this;
  },
  link: function(cell, bidi) {
    if (bidi !== false) {bidi = true;}
    this.dug = true;
    if (!this.linked(cell))  {
      this.links.push(cell);
    }
    if (bidi) {
      cell.link(this, false);
    }
  },
  unlink: function(cell, bidi) {
    if (bidi !== false) 
      {bidi = true;}
    this.links = this.links.filter( function(link) {return link !== cell;} );
    if (bidi) {
      cell.unlink(this, false);
    }
  },
  linked: function(cell) {
    return this.links.filter( function(link) {return link === cell;} ).length > 0;
  },
  neighbors: function() {
    var list = [];
    if (this.north) { list.push(this.north); }
    if (this.south) { list.push(this.south); }
    if (this.east) { list.push(this.east); }
    if (this.west) { list.push(this.west); }
    return list.filter( function(neighbor) {
      return (neighbor.impassable === false);
    }).randomize();
  },
  randomLink: function() {
    if (this.links.length > 0) {
      return this.links.filter( function(cell) {
      return !cell.impassable;
    }).random();
    }
    return null;
  }
};