<script setup lang="ts">
const props = defineProps({
  notifyMsg: String,
});
</script>

<template>
  <div class="flex justify-center items-center fixed top-0 left-0 w-[520px] h-[380px]">
    <div class="bg-white px-4 py-2 border rounded text-xl text-gray-500 shadow-md">
      <i-teenyicons:tick-circle-solid class="inline-block mr-2 text-blue-300" />
      <span class="inline-block align-middle">{{ notifyMsg }}</span>
    </div>
  </div>
</template>
