<script setup>
import { ref } from 'vue';

const selectedColor= ref('');
const checkedLikeColor = ref(false);
const statusTxt= ref('');
const saveOptions = () => {
  chrome.storage.sync.set(
    { favoriteColor: selectedColor.value, likesColor: checkedLikeColor.value },
    () => {
      statusTxt.value = 'Options saved.';
      setTimeout(() => {
        statusTxt.value = '';
      }, 750);
    }
  );
};
const initOptions = () => {
  chrome.storage.sync.get(['favoriteColor', 'likesColor'], (items) => {
    selectedColor.value = items.favoriteColor || '';
    checkedLikeColor.value = items.likesColor || false;
  });
};
initOptions();
</script>

<template>
  <div class="p-6">
    <h1 class="text-xl py-2">選擇顏色</h1>
    <div class="pb-2">
      <select class="border-2 p-1" v-model="selectedColor" >
        <option disabled value="">請選擇</option>
        <option value="red">red</option>
        <option value="green">green</option>
        <option value="blue">blue</option>
        <option value="yellow">yellow</option>
      </select>

      <label class="ml-4 ">
        <input type="checkbox" v-model="checkedLikeColor" />
        I like colors.
      </label>
    </div>

    <div class="pb-2">status: {{ statusTxt }}</div>
    <button @click="saveOptions" class="border-2 rounded px-2">Save</button>
  </div>
</template>
