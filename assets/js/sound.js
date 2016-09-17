Game.Sound = {
  init: function() {
    var soundJSON = PIXI.loader.resources["assets/sound/sounds.json"];
    this.sound = new Howl({
      src: ['assets/sound/sounds.ogg', 'assets/sound/sounds.mp3'],
      sprite: soundJSON.data.sprite
    });
    this.muted = (location.hash === "#silent");
    return this;
  },
  play: function(audio) {
    if (!this.muted) {
      if (typeof audio === 'string' || audio instanceof String) {
        this._playOneSound(audio);
      } else if (Array.isArray(audio)) {
        this._playSounds(audio);
      } else {
        throw new Error('Can only play a string or array of strings');
      }
    }
  },
  mute: function() {
    this.muted = true;
    location.hash = "#silent";
  },
  unmute: function() {
    this.muted = false;
    location.hash = "";
  },
  toggleMute: function() {
    if (this.muted) {
      this.unmute();
    } else {
      this.mute();
    }
  },
  _playOneSound: function(name) {
    var soundId = this.sound.play(name);
    var self = this;
    return new Promise(function(resolve) {
      self.sound.on('end', resolve, soundId);
    });
  },
  _playSounds: function(names) {
    var self = this;
    return names.reduce(function(prevPromise, name) {
      return prevPromise.then(function() {
        return self._playOneSound(name);
      });
    }, Promise.resolve());
  }
};