<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @dragend.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple  @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"> </i> {{ upload.name }}</div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div class="transition-all progress-bar bg-blue-400" 
            :class="upload.variant"
            :style="{ width: `${upload.current_progress}%` }"

        ></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage, auth, songsCollection } from '@/includes/firebase'
import { doc, addDoc, query, where, getDocs } from 'firebase/firestore'
export default {
  name: 'Upload',
  data() {
    return {
      is_dragover: false,
      uploads: []
    };
  },
  props:['addSong'],
  methods: {
    async upload($event) {
      this.is_dragover = false


      const files = $event.dataTransfer 
        ? [...$event.dataTransfer.files] 
        : [...$event.target.files];

      for (const file of files) {
        if (file.type !== 'audio/mpeg') {
          continue;
        }

        // Check if a song with the same name already exists 
        const q=query(songsCollection, where("original_name", "==", file.name));
        const querySnapshot = await getDocs(q);

        if(!querySnapshot.empty){
          alert(`A file with the name ${file.name} already exists. Please rename it`);
          continue;
        }

        const songRef = doc(songsCollection);
        const docID= songRef.id;
        
        const metadata = {
          customMetadata:{
            docID: docID
          }
        };

        const storageRef = ref(storage);
        const songsRef = ref(storageRef, `songs/${file.name}`);
        const uploadTask =uploadBytesResumable(songsRef, file, metadata);

        const uploadIndex = this.uploads.push({
          uploadTask,
          curren_progress: 0,
          name: file.name,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          text_class: '',
        })-1;



        uploadTask.on('state_changed', (snapshot)=>
        {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploads[uploadIndex].current_progress = progress;
        }, (error)=>{
          this.uploads[uploadIndex].variant = 'text-red-500';
          this.uploads[uploadIndex].icon = 'fas fa-times';
          this.uploads[uploadIndex].text_class = 'text-red-400';
          console.error(error);
        }, async()=>{
          const song={
            uid: auth.currentUser.uid,
            display_name: auth.currentUser.displayName,
            original_name: uploadTask.snapshot.metadata.name,
            modified_name: uploadTask.snapshot.metadata.name,
            genre: '',
            comment_count: 0,
            url: await getDownloadURL(uploadTask.snapshot.ref),
            docID: docID
          };

          const songRef=await addDoc(songsCollection, song);
          console.log(songRef.songs)

          this.uploads[uploadIndex].variant = 'bg-green-500';
          this.uploads[uploadIndex].icon = 'fas fa-check';
          this.uploads[uploadIndex].text_class = 'text-green-400';

        }) 
      }
    },
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.uploadTask.cancel();
    });
  }
}
</script>


