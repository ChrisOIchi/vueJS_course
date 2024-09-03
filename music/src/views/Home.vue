<template>
  <!-- Introduction -->
  <section class="mb-8 py-20 text-white text-center relative">
    <div
      class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"
    ></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
        <p class="w-full md:w-8/12 mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis, congue
          augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et
          sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.
        </p>
      </div>
    </div>

    <img
      class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="/assets/img/introduction-music.png"
    />
  </section>

  <!-- Main Content -->
  <section class="container mx-auto">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Songs</span>
        <!-- Icon -->
        <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i>
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <app-song-item v-for="song in songs" :key="song.docID" :song="song" />
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section>
</template>

<script>
import { auth, songsCollection } from '@/includes/firebase'
import AppSongItem from '@/components/SongItem.vue'
import { query, where, getDocs, limit, startAfter, orderBy } from 'firebase/firestore'
export default {
  name: 'Home',
  components: {
    AppSongItem
  },
  data() {
    return {
      songs: [],
      maxPerPage: 3
    }
  },
  async created() {
    this.getSongs()
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement
      const { innerHeight } = window
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight
      if (bottomOfWindow) {
        this.getSongs()
      }
    },
    async getSongs() {
      const uid = auth.currentUser.uid

      // Si no hay lastDoc definido, realizamos la primera consulta
      if (!this.lastDoc) {
        const firstQuery = query(
          songsCollection,
          where('uid', '==', uid),
          orderBy('modified_name'),
          limit(this.maxPerPage)
        )

        const firstSnapshot = await getDocs(firstQuery)

        if (!firstSnapshot.empty) {
          this.lastDoc = firstSnapshot.docs[firstSnapshot.docs.length - 1] // Actualiza lastDoc
          this.songs = firstSnapshot.docs.map((document) => ({
            ...document.data(),
            docID: document.id
          }))
        }
      } else {
        // Si lastDoc ya está definido, hacemos una consulta después del último documento
        const nextQuery = query(
          songsCollection,
          where('uid', '==', uid),
          orderBy('modified_name'),
          limit(this.maxPerPage),
          startAfter(this.lastDoc) // Comienza después del último documento cargado
        )

        const nextSnapshot = await getDocs(nextQuery)

        if (!nextSnapshot.empty) {
          this.lastDoc = nextSnapshot.docs[nextSnapshot.docs.length - 1] // Actualiza lastDoc

          nextSnapshot.forEach((document) => {
            this.songs.push({
              ...document.data(),
              docID: document.id
            })
          })
        }
      }
    }
  }
}
</script>
