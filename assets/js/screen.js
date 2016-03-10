Game.Screen = {};

Game.Screen.drawTile = function(container, tileIndex, pos) {
      var textures = PIXI.loader.resources["assets/i/tileset.json"].textures;
      var tile = new PIXI.Sprite(textures[tileIndex]);
      tile.position.x = pos.x * Game.tileSize.x;
      tile.position.y = pos.y * Game.tileSize.y;
      container.addChild(tile);
};

Game.Screen.titleScreen = {
  enter: function() {    console.log("Entered start screen."); },
  exit: function() { console.log("Exited start screen."); },
  render: function(display) {
    // Render title screen
  },
  handleInput: function(inputType, inputData) {
    Game.switchScreen(Game.Screen.playScreen);
  }
};

Game.Screen.playScreen = {
  player: null,
  level: 1,
  gameEnded: false,
  enter: function() {
    this.newLevel(this.level);
  },
  everyTurn: function() {

  },
  exit: function() { 
    console.log("Exited play screen."); 
  },
  newLevel: function(level) {
    var width = Game.mapSize.x;
    var height = Game.mapSize.y;
    this.map = Game.Map.Generators.Basic.create(width, height);
    Game.Map.Generators.Basic.populate(this.map);
    this.grid = this.map.grid;
  },
  render: function(display) {
    this.renderTiles(display);
    this.renderEntities(display);
    Game.display.render(Game.stage);
  },
  renderTiles: function(display) {
    Game.display.backgroundColor = 0x996633;
    this.map.grid.eachCell( function(cell) {
      drawCell(Game.stage, cell);
    });

    function drawCell(container, cell) {
      var x = cell.column;
      var y = cell.row;
      var pos = {x: x, y: y};
      if (cell.dug) {
        if (cell.east  && cell.east.dug && cell.linked(cell.east))  { Game.Screen.drawTile(container, "dugeast", pos); }
        if (cell.west  && cell.west.dug && cell.linked(cell.west))  { Game.Screen.drawTile(container, "dugwest", pos); }
        if (cell.north && cell.north.dug && cell.linked(cell.north)) { Game.Screen.drawTile(container, "dugnorth", pos); }
        if (cell.south && cell.south.dug && cell.linked(cell.south)) { Game.Screen.drawTile(container, "dugsouth", pos); }
      }
    }
  },
  renderEntities: function(display) {
    for (var key in this.map.entities) {
      var entity = this.map.entities[key];
      Game.Screen.drawTile(Game.stage, entity.tile, {x: entity.x, y: entity.y} );
    }
  },
  handleInput: function(inputType, inputData) {

  },
};

Game.Screen.winScreen = {
  enter: function() {
      console.log("Entered win screen."); 
  },
  exit: function() { 
    console.log("Exited win screen."); 
  },
  render: function(display) {
      //render win screen
  },
  handleInput: function(inputType, inputData) {

  }
};

Game.Screen.loseScreen = {
  enter: function() { 
    console.log("Entered lose screen."); 
  },
  exit: function() { console.log("Exited lose screen."); },
  render: function(display) {
    //render lose screen
  },
  handleInput: function(inputType, inputData) {

  }
};