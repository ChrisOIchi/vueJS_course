const vm= Vue.createApp({
  data() {
    return {
      firstName: 'John',
      middleName: '',
      lastName: 'Doe',
      url: 'https://www.google.com',
      raw_url: '<a href="https://www.google.com" target="_blank">Google</a>',
      age: 20,
    }
  },
  methods: {
      decrement() {
        this.age--;
      },
      updateLastName(msg, event) {
        this.lastName = event.target.value;
        console.log(msg);
      },
      updateMiddleName(event) {
        this.middleName = event.target.value;
      }
  },
  computed: {
    fullName() {
      console.log('Running again...');
      return `${this.firstName} ${this.middleName} ${this.lastName.toUpperCase()}`;
    }
  },
  watch:{
    age(newVal, oldVal) {
      setTimeout(() => {
        this.age = 20;
      }, 3000);
    }
  }
}).mount('#app1');

// setTimeout(() => {
//   vm.firstName = 'Bob';
// }, 2000);


// Vue.createApp({
//   data() {
//     return {
//       firstName: 'Maria',
//       lastName: 'Lopez',
//     };
//   }
// }).mount('#app2');