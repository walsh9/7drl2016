Game.Sound = {
  init: function() {
    var soundJSON = PIXI.loader.resources["assets/sound/sounds.json"];
    this.sound = new Howl({
      src: ['assets/sound/sounds.ogg', 'assets/sound/sounds.mp3'],
      sprite: soundJSON.data.sprite
    });
    return this;
  },
  play(audio) {
    if (typeof audio === 'string' || audio instanceof String) {
      this._playOneSound(audio);
    } else if (Array.isArray(audio)) {
      this._playSounds(audio);
    } else {
      throw new Error('Can only play a string or array of strings');
    };
  },
  _playOneSound(name) {
    var soundId = this.sound.play(name);
    var self = this;
    return new Promise(function(resolve) {
      self.sound.on('end', resolve, soundId);
    });
  },
  _playSounds(names) {
    var self = this;
    return names.reduce(function(prevPromise, name) {
      return prevPromise.then(function() {
        return self._playOneSound(name);
      });
    }, Promise.resolve());
  }
};