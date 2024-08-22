<template>
  <div class="result">
    <div class="title">{{ results[resultIndex].title }}</div>
    <div class="desc">
      {{ results[resultIndex].desc }}
    </div>
  </div>
</template>

<script>
export default {
  props: ["results", "totalCorrect"],
  computed: {
    resultIndex() {
      let index = 0;
      this.results.forEach((result, ri) => {
        if (
          this.totalCorrect >= result.min &&
          this.totalCorrect <= result.max
        ) {
          index = ri;
        }
      });
      return index;
    },
  },
};
</script>

<style lang="scss" scoped></style>
