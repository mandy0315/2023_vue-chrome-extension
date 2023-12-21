<script setup lang="ts">
import { getCurrentTab, setStorageData, getStorageData } from '@/utils/useChromeAPI';
import { onMounted, ref } from 'vue';

import { TabList } from '@/types/popup';

const tabInfo = ref({
  title: '',
  url: '',
});
const tabList = ref<TabList>([]);
const isRepeatURL = ref(false);
const isAddTab = ref(true);
const editTabUrl = ref('');

const updateCurrTabInfo = async () => {
  const tab = await getCurrentTab();
  tabInfo.value.title = tab.title || '';
  tabInfo.value.url = tab.url || '';
};
const updateTabList = async () => {
  const storageTabList = await getStorageData('tabList');
  const arr = Object.values(storageTabList) || [];
  if (arr.length > 0) {
    tabList.value = arr as TabList;
  }
  // tabList.value = [
  //   {
  //     tabTitle: '測試測試測試測試測試1',
  //     tabUrl: 'https://www.google.com',
  //   },
  //   {
  //     tabTitle: '測試測試測試測試測試2',
  //     tabUrl: 'http://www.chinasgp.cn/article/2824.html',
  //   },
  //   {
  //     tabTitle: '測試測試測試測試測試3',
  //     tabUrl:
  //       'https://stackoverflow.com/questions/70375337/chrome-extension-chrome-runtime-lasterror-no-tab-with-id-error',
  //   },
  // ];
};

const toggleAddTab = () => {
  isAddTab.value = !isAddTab.value;
  if (isAddTab.value) {
    updateCurrTabInfo();
  }
};

const saveTab = async () => {
  const tab = {
    tabTitle: tabInfo.value.title,
    tabUrl: tabInfo.value.url,
  };

  if (editTabUrl.value === '') {
    // 新增Tab
    isRepeatURL.value = false;
    if (tabList.value.length > 0) {
      const findUrl = tabList.value.find((item: TabList[0]) => item.tabUrl === tab.tabUrl);
      if (findUrl) {
        isRepeatURL.value = true;
      } else {
        tabList.value.push(tab);
        await setStorageData({ tabList: tabList.value });
      }
    } else {
      await setStorageData({ tabList: [tab] });
    }
  } else {
    // 編輯Tab
    tabList.value = tabList.value.map((item: TabList[0]) => {
      if (item.tabUrl === editTabUrl.value) return tab;
      return item;
    });
    await setStorageData({ tabList: tabList.value });
    editTabUrl.value = '';
  }

  updateTabList();
};
const deleteTab = async (currUrl: string) => {
  tabList.value = tabList.value.filter((item: TabList[0]) => item.tabUrl !== currUrl);
  await setStorageData({ tabList: tabList.value });
};
const editTab = (currTitle: string, currUrl: string) => {
  isAddTab.value = false;
  if (editTabUrl.value === currUrl) {
    editTabUrl.value = '';
    tabInfo.value.title = '';
    tabInfo.value.url = '';
  } else {
    editTabUrl.value = currUrl;
    tabInfo.value.title = currTitle;
    tabInfo.value.url = currUrl;
  }
};
const cancelTab = () => {
  editTabUrl.value = '';
  tabInfo.value.title = '';
  tabInfo.value.url = '';
};

onMounted(() => {
  updateCurrTabInfo();
  updateTabList();
});
</script>

<template>
  <main class="w-[520px] h-[400px] bg-white">
    <header class="px-4 h-12 flex items-center bg-blue-300 shadow">
      <h1 class="text-gray-50">SCRATCH URLS</h1>
    </header>
    <section class="relative">
      <button
        @click="toggleAddTab"
        :disabled="editTabUrl !== ''"
        class="rounded-b-md inline-block py-1 px-2 absolute top-0 right-0 shadow border-l border-r border-b"
        :class="editTabUrl !== '' ? 'bg-gray-100 text-gray-300' : ' bg-white text-gray-500'"
      >
        <i-ic:outline-remove-circle v-if="isAddTab" class="inline-block" />
        <i-material-symbols:add-circle-rounded v-else class="inline-block" />

        <span class="text-sm pl-1">新增網址</span>
      </button>
      <div class="bg-gray-100 transition-all duration-200" :class="isAddTab ? 'h-[180px]' : 'h-0'">
        <div v-if="isAddTab" class="px-4 py-4">
          <div class="h-8">
            <p v-if="isRepeatURL" class="text-red-600">* 網址已經存在，請重新確認 !</p>
          </div>
          <input
            type="text"
            v-model="tabInfo.title"
            placeholder="輸入網址名稱"
            class="block w-full border-gray-200 border rounded-md p-1 mb-2"
          />
          <input
            type="text"
            v-model="tabInfo.url"
            placeholder="輸入網址"
            class="block w-full border-gray-200 border rounded-md p-1 mb-2"
          />
          <button @click="saveTab" class="bg-blue-100 text-blue-500 px-2 py-1 rounded text-sm">儲存</button>
        </div>
      </div>
    </section>
    <section class="px-4 py-10">
      <ul v-if="tabList.length > 0">
        <template v-for="item in tabList" :key="item.tabTitle">
          <li class="flex border-b py-2 px-4">
            <a
              :href="item.tabUrl"
              target="_blank"
              class="text-blue-500 underline underline-offset-2"
              :alt="item.tabUrl"
              >{{ item.tabTitle }}</a
            >

            <div class="ml-auto">
              <button @click="editTab(item.tabTitle, item.tabUrl)" class="px-1">
                <i-material-symbols:edit-square-rounded class="text-gray-500" />
              </button>
              <button class="px-1" @click="deleteTab(item.tabUrl)">
                <i-material-symbols:delete class="text-gray-500" />
              </button>
            </div>
          </li>
          <div v-if="editTabUrl === item.tabUrl" class="bg-gray-100 px-4 py-2">
            <input
              type="text"
              v-model="tabInfo.title"
              placeholder="輸入網址名稱"
              class="block w-full border-gray-200 text-sm border rounded-md p-1 mb-2"
            />
            <input
              type="text"
              v-model="tabInfo.url"
              placeholder="輸入網址"
              class="block w-full border-gray-200 text-sm border rounded-md p-1 mb-2"
            />
            <button @click="saveTab" class="bg-blue-100 text-blue-500 px-2 py-1 mr-2 rounded text-sm">修改</button>
            <button @click="cancelTab" class="bg-blue-100 text-blue-500 px-2 py-1 rounded text-sm">取消</button>
          </div>
        </template>
      </ul>
      <div v-else>沒有資料</div>
    </section>
  </main>
</template>
