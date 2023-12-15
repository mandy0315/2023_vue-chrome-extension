<script setup>
import { ref } from 'vue';

const isMinimize = ref(false);

</script>

<template>
  <div>
    <div v-if="!isMinimize" class="bg-white w-[330px] h-[435px] shadow-md">
      <div class="bg-gray-100 pl-4 h-10 flex justify-between items-center">
        <img class="w-[24px] h-[24px]" src="/images/hello_extensions.png" alt="">
        <button @click="isMinimize = true" class="p-4 cursor-pointer"><div class="border-b-2 border-gray-500 w-4"></div></button>
      </div>
      <div class="text-xl text-red-500">Hello content test</div>
    </div>
    <button v-else @click="isMinimize = false" class="bg-white shadow-md w-[35px] h-[35px] absolute bottom-1 right-1">
      <img class="w-[24px] h-[24px] mx-auto" src="/images/hello_extensions.png" alt="">
    </button>
  </div>
</template>
