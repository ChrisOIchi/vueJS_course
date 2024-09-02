import { defineStore } from 'pinia'
import { auth, usersCollection } from '@/includes/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { signInWithEmailAndPassword } from 'firebase/auth'

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false
  }),
  actions: {
    async register(values) {
      // do something
      const userCred = await createUserWithEmailAndPassword(auth, values.email, values.password)
      const userDoc = doc(usersCollection, userCred.user.uid)

      await setDoc(userDoc, {
        name: values.name,
        last_name: values.last_name,
        email: values.email,
        age: values.age,
        country: values.country
      })
      await updateProfile(userCred.user, {
        displayName: values.name
      })

      this.userLoggedIn = true
    },
    async authenticate(values) {
      await signInWithEmailAndPassword(auth, values.email, values.password)

      this.userLoggedIn = true
    },
    async signOut() {
      await auth.signOut()
      this.userLoggedIn = false
    },
  },
})
