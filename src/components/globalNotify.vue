<script setup lang="ts">
const props = defineProps({
  message: String,
});
</script>

<template>
  <div class="absolute inset-0 flex justify-center items-center">
    <div
      class="bg-white px-4 py-2 border rounded text-xl text-gray-500 shadow-md inline-block dark:bg-gray-500 dark:text-gray-100"
    >
      <i-teenyicons:tick-circle-solid class="inline-block mr-2 text-blue-300 dark:text-gray-100" />
      <span class="inline-block align-middle dark:text-gray-100">{{ message }}</span>
    </div>
  </div>
</template>
