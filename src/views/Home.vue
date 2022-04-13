<template>
  <div class="home">
    <Navbar />
    <Index />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import axios from "../utils/http";
import Navbar from "../components/Navbar.vue";
import Index from "../views/index.vue";
onMounted(async () => {
  try {
    const data = await axios.get("/api/users/current");
  } catch (error) {
    console.log(error);
  }
});
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
}
</style>