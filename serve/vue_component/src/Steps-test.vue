<template>
  <div>
    <steps :count="count" :active="active"></steps>
    <button @click="next">下一步</button>
  </div>
</template>

<script>
import Steps from "./Steps";
export default {
  name: "Steps-test.vue",
  components:{
    Steps
  },
  data() {
    return {
      count:10,
      active:0,
    }
  },
  methods: {
    next() {
      this.active++
    }
  }
}
</script>

<style scoped>

</style>
