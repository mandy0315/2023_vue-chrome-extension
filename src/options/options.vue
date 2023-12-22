<script setup lang="ts">
import { ref } from 'vue';
import { getStorageData, setStorageData } from '@/utils/useChromeAPI';

const listLimit = ref(0);
const isShowIconCount = ref(false);

const updateOptions = async () => {
  const storageListLimit = await getStorageData('listLimit');
  const storageIsShowIconCount = await getStorageData('isShowIconCount');
  listLimit.value = storageListLimit;
  isShowIconCount.value = storageIsShowIconCount;
};
const saveOptions = async () => {
  try {
    await setStorageData({
      listLimit: listLimit.value,
      isShowIconCount: isShowIconCount.value,
    });
    console.log('Options 儲存成功');
  } catch (e) {
    console.log('Options 儲存失敗');
  }
};
updateOptions();
</script>

<template>
  <main class="mx-auto max-w-[520px] p-6 relative">
    <div class="text-gray-800 pb-2">
      <label>
        <input v-model="isShowIconCount" type="checkbox" />
        <span class="pl-2">在圖型顯示列表數量</span>
      </label>
    </div>
    <div class="text-gray-800 pb-2">
      <label class="pr-2">
        <input v-model="listLimit" type="radio" name="5列" :value="5" />
        5
      </label>
      <label class="pr-2">
        <input v-model="listLimit" type="radio" name="10列" :value="10" />
        10
      </label>
      <label class="pr-2">
        <input v-model="listLimit" type="radio" name="5列" :value="15" />
        15
      </label>
      列表限制
      <span class="text-xs text-gray-500">(縮減列表只保留列表限制數量，其他一律刪除)</span>
    </div>
    <button @click="saveOptions" class="px-2 py-1 rounded text-sm bg-blue-100 text-blue-500">儲存</button>
  </main>
</template>
