<script setup lang="ts">
import { ref } from 'vue';
import { getStorageData, setStorageData, setBadge } from '@/utils/useChromeAPI';
import useNotify from '@/composables/useNotify';

const listLimit = ref(0);
const tabsDeleteDays = ref(0);
const isShowBadgeCount = ref(false);

const updateOptions = async () => {
  const storageListLimit = await getStorageData('listLimit');
  const storageIsShowBadgeCount = await getStorageData('isShowBadgeCount');
  const storageTabsDeleteDays = await getStorageData('tabsDeleteDays');

  listLimit.value = storageListLimit;
  isShowBadgeCount.value = storageIsShowBadgeCount;
  tabsDeleteDays.value = storageTabsDeleteDays;
};

const { isShowNotify, notifyContent, setNotify } = useNotify();
const saveOptions = async () => {
  try {
    await setStorageData({
      tabsDeleteDays: tabsDeleteDays.value,
      listLimit: listLimit.value,
      isShowBadgeCount: isShowBadgeCount.value,
    });
    setNotify({
      message: '儲存成功',
    });
    setBadge();
  } catch (e) {
    console.log('Options 儲存失敗');
  }
};
updateOptions();
</script>

<template>
  <main class="mx-auto max-w-[520px] p-6 relative text-base">
    <div class="text-gray-800 pb-2">
      <label>
        <input v-model="isShowBadgeCount" type="checkbox" />
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
    <div class="text-gray-800 pb-2">
      <label class="pr-2">
        <input v-model="tabsDeleteDays" type="radio" name="3天" :value="3" />
        3
      </label>
      <label class="pr-2">
        <input v-model="tabsDeleteDays" type="radio" name="7天" :value="7" />
        7
      </label>
      <label class="pr-2">
        <input v-model="tabsDeleteDays" type="radio" name="14天" :value="14" />
        14
      </label>
      天刪除網址
    </div>

    <button @click="saveOptions" class="px-2 py-1 rounded text-sm bg-blue-100 text-blue-500">儲存</button>

    <global-notify v-if="isShowNotify" :message="notifyContent" />
  </main>
</template>
