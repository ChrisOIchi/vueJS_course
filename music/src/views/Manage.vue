<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload" @uploadComplete="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <composition-item
              v-for="(song, i) in songs"
              :key="song.docID"
              :song="song"
              :updateSong="updateSong"
              :index="i"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import useUserStore from '@/stores/user'
import AppUpload from '@/components/Upload.vue'
import CompositionItem from '@/components/CompositionItem.vue'
import { query, where, getDocs } from 'firebase/firestore'
import { songsCollection, auth } from '@/includes/firebase'

export default {
  name: 'Manage',
  components: {
    AppUpload,
    CompositionItem
  },
  data() {
    return {
      songs: [],
      unsaveFlag: false
    }
  },
  methods: {
    async showSongs() {
      const uid = auth.currentUser.uid
      const q = query(songsCollection, where('uid', '==', uid))
      const querySnapshot = await getDocs(q)

      querySnapshot.forEach((doc) => {
        const song = {
          ...doc.data(),
          docID: doc.id
        }
        this.songs.push(song)
      })
    },
    updateSong(i, values) {
      // Actualizar la canción
      this.songs[i].modified_name = values.modified_name
      this.songs[i].genre = values.genre
    },
    removeSong(i) {
      this.songs.splice(i, 1)
    },
    addSong(song) {

      this.songs.push(song)
    },
    updateUnsavedFlag(value) {
      this.unsaveFlag = value
    }
  },
  mounted() {
    this.showSongs()
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsaveFlag) {
      next()
    } else {
      const leave = confirm('You have unsaved changes. Are you sure you want to leave?');
      next(leave);
    }
  }
  // beforeRouteEnter(to, from, next) {
  //   const userStore = useUserStore()
  //   if (!userStore.userLoggedIn) {
  //     next({ name: 'home' })
  //   } else {
  //     next()
  //   }
  // }
}
</script>
