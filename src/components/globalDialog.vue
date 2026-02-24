<script setup lang="ts">
const { title, message } = defineProps({
  title: String,
  message: String,
});
</script>

<template>
  <div class="absolute inset-0 flex justify-center items-center">
    <div
      class="bg-white px-4 pt-4 border rounded text-gray-500 shadow-md block mx-6 dark:bg-gray-500 dark:text-gray-100">
      <p class="font-bold text-lg pb-2">{{ title }}</p>
      <p class="text-base pb-3">{{ message }}</p>
      <div class="text-right text-base text-blue-500 dark:text-gray-100 relative left-2">
        <button id="cancelButton" class="p-2">取消</button>
        <button id="confirmButton" class="p-2">確認</button>
      </div>
    </div>
  </div>
</template>
