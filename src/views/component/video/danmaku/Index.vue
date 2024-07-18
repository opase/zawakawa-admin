<template>
    <div>
      <p>Video ID: {{ videoId }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { ref, onMounted } from 'vue';
  
  const route = useRoute();
  const videoId = ref<string | null>(null);
  
  onMounted(() => {
    videoId.value = route.params.videoId as string;
  });
  </script>
  