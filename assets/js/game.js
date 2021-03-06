var Game = {
  display: null,
  stage: null,
  currentScreen: null,
  tileSize: {x: 34, y: 34},
  mapSize: {x: 13, y: 15},
  init: function() {
    this.display = PIXI.autoDetectRenderer(Game.mapSize.x * Game.tileSize.x, (Game.mapSize.y + 2) * Game.tileSize.y);
    document.querySelector('.game').appendChild(this.display.view);
    this.stage = new PIXI.Container();
    this.switchScreen(Game.Screen.playScreen);
    window.addEventListener('keydown', function(e) {
      if (e.keyCode === ROT.VK_SPACE ||
          e.keyCode === ROT.VK_DOWN ||
          e.keyCode === ROT.VK_UP) {
        e.preventDefault();
      }
      Game.currentScreen.handleInput('keydown', e);
    });
    Game.Sound.init().play('bootup');
    return this;
  },
  refresh: function() {
    if (this.currentScreen) {
      while (this.stage.children[0]) { this.stage.removeChild(this.stage.children[0]); }
      this.currentScreen.render(this.display);
    }
  },
  switchScreen: function(screen) {
    if (this.currentScreen !== null) {
        this.currentScreen.exit();
    }

    this.currentScreen = screen;
    if (!this.currentScreen !== null) {
      this.currentScreen.enter();
      this.refresh();
    }
  }
};

Game.loaded = {};
Game.loaded.tiles = false;
Game.loaded.fonts = false;

// Load Tiles
PIXI.loader
.add(["assets/i/tileset.json","assets/sound/sounds.json"])
.load(function() {Game.loaded.tiles = true;});
//Load Fonts
if (window.WebFont) {
  WebFont.load({
    google: {
      families: ['Audiowide']
    },
    active: function() {Game.loaded.fonts = true;},
    // Let game start after font loading timeout. we tried.
    inactive: function() {Game.loaded.fonts = true;}
  });
} else {
  //Probably not online. Let the game start.
  Game.loaded.fonts = true;
}




window.addEventListener('load', function() {

  (function setup() {
    console.log('waiting');
    if (Game.loaded.tiles && Game.loaded.fonts) {
      Game.init().refresh();
    } else {
      window.setTimeout(setup, 100);
    }
  })();
}, false);