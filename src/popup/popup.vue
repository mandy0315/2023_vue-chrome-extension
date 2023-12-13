<script setup>
const toOptions = () => {
  chrome.runtime.openOptionsPage();
};
</script>

<template>
  <div class="text-xl text-red-500">Hello</div>
  <button @click="toOptions" class="border-2 rounded px-2">Go to options</button>
</template>
