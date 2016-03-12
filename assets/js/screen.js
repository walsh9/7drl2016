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
    this.player = Object.create(Game.Entity).init(Game.Entity.templates.player);
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
    Game.Map.Generators.Basic.addPlayer(this.map, this.player);
    this.grid = this.map.grid;
    this.map.engine.start();
  },
  render: function(display) {
    this.renderTiles(display);
    this.renderItems(display);
    this.renderEntities(display);
    Game.display.render(Game.stage);
  },
  renderTiles: function(display) {
    Game.display.backgroundColor = this.map.color;
    this.map.grid.eachCell( function(cell) {
      drawCell(Game.stage, cell);
    });

    function drawCell(container, cell) {
      var x = cell.x;
      var y = cell.y;
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
  renderItems: function(display) {
    for (var key in this.map.items) {
      var item = this.map.items[key];
      Game.Screen.drawTile(Game.stage, item.tile, {x: item.x, y: item.y} );
    }
  },
  handleInput: function(inputType, inputData) {
      // If the game is over, enter will bring the user to the losing screen.
    if (inputType === 'keydown') {
      // Movement
      if (inputData.keyCode === ROT.VK_LEFT || 
        inputData.keyCode === ROT.VK_H ||
        inputData.keyCode === ROT.VK_NUMPAD4 ||
        inputData.keyCode === ROT.VK_A) {
        this.move(-1, 0);
      } else if (inputData.keyCode === ROT.VK_RIGHT || 
                 inputData.keyCode === ROT.VK_L ||
                 inputData.keyCode === ROT.VK_NUMPAD6 ||
                 inputData.keyCode === ROT.VK_D) {
        this.move(1, 0);
      } else if (inputData.keyCode === ROT.VK_UP || 
                 inputData.keyCode === ROT.VK_K ||
                 inputData.keyCode === ROT.VK_NUMPAD8 ||
                 inputData.keyCode === ROT.VK_W) {
        this.move(0, -1);
      } else if (inputData.keyCode === ROT.VK_DOWN || 
                 inputData.keyCode === ROT.VK_J ||
                 inputData.keyCode === ROT.VK_NUMPAD2 ||
                 inputData.keyCode === ROT.VK_S) {
        this.move(0, 1);
      } else if (inputData.keyCode === ROT.VK_SPACE || 
                 inputData.keyCode === ROT.VK_PERIOD) {
        this.move(0, 0);
      }
      // Unlock the engine
      this.player.map.engine.unlock();
    } 
  },
  move: function(dX, dY) {
      var newX = this.player.x + dX;
      var newY = this.player.y + dY;
      // Try to move to the new cell
      this.player.tryMove(newX, newY, this.player.map);
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