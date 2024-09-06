import { defineStore } from 'pinia'
import { Howl } from 'howler';
import helper from '@/includes/helper';

export default defineStore('player', {
  state: () => ({
    current_song: {},
    sound: null,
    seek:"00:00",
    duration:"00:00",
    playerProgress: "0%",
  }),
  actions: {
    async newSong(song) {
      // do something
      if (this.sound instanceof Howl) {
        this.sound.stop()
      }
      this.current_song = song

      this.sound = new Howl({
        src: [song.url],
        html5: true,
      })

      this.sound.play()

      this.sound.on('play', () => {
        requestAnimationFrame(this.progress);
      })
    },

    async toggleAudio() {
      if (!this.sound.playing) {
        return
      }

      this.sound.playing() ? this.sound.pause() : this.sound.play()
    },
    progress(){
      if (!this.sound) return;

      this.seek = helper.formatTime(this.sound.seek());
      this.duration = helper.formatTime(this.sound.duration());
      this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`;


      if (this.sound.playing()) {
        requestAnimationFrame(this.progress);
      };
    },
    updateSeek(e){
      if (!this.sound.playing) return;

      const {x, width} = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - x;
      const percentage = clickX / width;
      const seconds = this.sound.duration() * percentage;

      this.sound.seek(seconds);

      this.sound.once("seek", this.progress);
     }
  },
  getters: {
    playing: (state) => {
      if (state.sound && state.sound.playing()) {
        return state.sound.playing()
      }

      return false;
    }
  }
})
