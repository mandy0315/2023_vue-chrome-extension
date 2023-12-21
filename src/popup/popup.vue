<script setup lang="ts">
import { getCurrentTab, setStorageData, getStorageData } from '@/utils/useChromeAPI';
import { computed, onMounted, ref } from 'vue';

import { TabList } from '@/types/popup';

const tabInfo = ref({
  title: '',
  url: '',
});
const tabList = ref<TabList>([]);
const isRepeatURL = ref(false);
const isAddTab = ref(true);
const isDarkMode = ref(false);
const editTabUrl = ref('');
const listLimit = ref(10);

const isListOverLimit = computed(() => {
  return tabList.value.length > listLimit.value;
});

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
  // test data
  // tabList.value = [
  //   {
  //     tabTitle:
  //       '測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試1',
  //     tabUrl: 'https://www.google.com',
  //   },
  //   {
  //     tabTitle: '測試測試測試測試測試2',
  //     tabUrl: 'http://www.chinasgp.cn/article/2824.html',
  //   },
  //   {
  //     tabTitle: '測試測試測試測試測試3',
  //     tabUrl: 'http://www.chinasgp.cn/article/2825.html',
  //   },
  //   {
  //     tabTitle: '測試測試測試測試測試4',
  //     tabUrl: 'http://www.chinasgp.cn/article/2826.html',
  //   },
  //   {
  //     tabTitle: '測試測試測試測試測試5',
  //     tabUrl: 'http://www.chinasgp.cn/article/2827.html',
  //   },
  //   {
  //     tabTitle: '測試測試測試測試測試6',
  //     tabUrl: 'http://www.chinasgp.cn/article/2828.html',
  //   },
  //   {
  //     tabTitle: '測試測試測試測試測試7',
  //     tabUrl: 'http://www.chinasgp.cn/article/2829.html',
  //   },
  //   {
  //     tabTitle: '測試測試測試測試測試8',
  //     tabUrl: 'http://www.chinasgp.cn/article/2830.html',
  //   },
  //   {
  //     tabTitle: '測試測試測試測試測試9',
  //     tabUrl: 'http://www.chinasgp.cn/article/2831.html',
  //   },
  //   {
  //     tabTitle: '測試測試測試測試測試10',
  //     tabUrl: 'http://www.chinasgp.cn/article/2832.html',
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

  const checkIsRepeatURL = () => {
    isRepeatURL.value = false;

    const findUrl = tabList.value.find((item: TabList[0]) => item.tabUrl === tab.tabUrl);
    if (findUrl) {
      isRepeatURL.value = true;
    }
  };

  if (editTabUrl.value === '') {
    // 新增Tab
    if (tabList.value.length > 0) {
      checkIsRepeatURL();
      if (isRepeatURL.value) return;
      tabList.value.push(tab);
      await setStorageData({ tabList: tabList.value });
    } else {
      await setStorageData({ tabList: [tab] });
    }
  } else {
    // 編輯Tab
    tabList.value = tabList.value.map((item: TabList[0]) => {
      if (item.tabUrl === editTabUrl.value) {
        checkIsRepeatURL();
        return isRepeatURL.value ? item : tab;
      }
      return item;
    });

    if (!isRepeatURL.value) {
      editTabUrl.value = '';
      await setStorageData({ tabList: tabList.value });
    }
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
  isRepeatURL.value = false;
};
const cancelTab = () => {
  isRepeatURL.value = false;
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
  <main class="w-[520px]" :class="{ dark: isDarkMode }">
    <header class="px-4 h-12 flex items-center bg-blue-300 dark:bg-gray-600">
      <h1 class="text-gray-50 text-lg font-bold">SCRATCH URLS</h1>
      <button class="ml-auto text-white text-[20px]" @click="isDarkMode = !isDarkMode">
        <i-material-symbols:wb-sunny-rounded v-if="isDarkMode" class="text-white text-[20px]" />
        <i-material-symbols:nights-stay-rounded v-else class="text-white text-[18px]" />
      </button>
    </header>
    <div
      class="h-[380px] bg-white dark:bg-black overflow-hidden overflow-y-scroll c-scrollbar-style relative flex flex-col"
    >
      <section class="relative">
        <button
          @click="toggleAddTab"
          :disabled="editTabUrl !== ''"
          class="rounded-b-md inline-block py-1 px-2 absolute top-0 right-2 shadow border-l border-r border-b"
          :class="
            editTabUrl !== ''
              ? 'bg-gray-100 text-gray-300 dark:bg-gray-800 dark:text-gray-400'
              : ' bg-white text-gray-500 dark:bg-gray-600 dark:text-gray-100'
          "
        >
          <i-ic:outline-remove-circle v-if="isAddTab" class="inline-block text-base" />
          <i-material-symbols:add-circle-rounded v-else class="inline-block text-base" />

          <span class="text-sm pl-1">新增網址</span>
        </button>
        <div class="bg-gray-100 dark:bg-gray-800 transition-all duration-200" :class="isAddTab ? 'h-[180px]' : 'h-0'">
          <div v-if="isAddTab" class="px-4 py-4">
            <div class="h-8">
              <p v-show="isRepeatURL" class="text-base text-red-600 dark:text-yellow-300">
                * 網址已經存在，請重新確認 !
              </p>
              <p v-show="isListOverLimit" class="text-base text-red-600 dark:text-yellow-300">
                * 超過暫存數量！請選擇擴充或刪除列表網址
              </p>
            </div>
            <input
              type="text"
              v-model="tabInfo.title"
              placeholder="輸入網址名稱"
              class="block text-base w-full border-gray-200 border rounded-md p-1 mb-2 dark:text-gray-100 dark:bg-gray-600 dark:border-gray-400"
            />
            <input
              type="text"
              v-model="tabInfo.url"
              placeholder="輸入網址"
              class="block w-full text-base border-gray-200 border rounded-md p-1 mb-2 dark:text-gray-100 dark:bg-gray-600 dark:border-gray-400"
            />
            <button
              @click="saveTab"
              class="bg-blue-100 text-blue-500 dark:bg-gray-600 dark:text-white px-2 py-1 rounded text-sm"
            >
              儲存
            </button>
          </div>
        </div>
      </section>
      <section class="px-4 py-6">
        <template v-if="tabList.length > 0">
          <div>
            <h2 class="text-base font-black text-gray-500 pb-3 inline-block pr-2 dark:text-gray-100">暫存列表</h2>
            <span class="text-gray-500 text-sm dark:text-gray-100">＊限制暫存 {{ listLimit }} 列網址</span>
          </div>

          <ul>
            <template v-for="item in tabList" :key="item.tabTitle">
              <li class="flex border-b py-2 px-4 dark:border-gray-600">
                <a
                  data-tooltip-group
                  :href="item.tabUrl"
                  target="_blank"
                  :alt="item.tabUrl"
                  rel="noreferrer noopener"
                  class="relative"
                >
                  <p class="underline text-base underline-offset-2 truncate w-[380px] text-blue-500 dark:text-gray-100">
                    {{ item.tabTitle }}
                  </p>
                  <div
                    data-tooltip
                    class="absolute shadow-md top-6 z-10 truncate w-[380px] rounded left-0 bg-white px-2 py-1 text-sm text-gray-400 dark:bg-gray-800"
                  >
                    {{ item.tabUrl }}
                  </div>
                </a>

                <div class="ml-auto">
                  <button @click="editTab(item.tabTitle, item.tabUrl)" class="px-1">
                    <i-material-symbols:edit-square-rounded class="text-gray-500 text-base dark:text-gray-100" />
                  </button>
                  <button class="px-1" @click="deleteTab(item.tabUrl)">
                    <i-material-symbols:delete class="text-gray-500 text-base dark:text-gray-100" />
                  </button>
                </div>
              </li>
              <div v-if="editTabUrl === item.tabUrl" class="bg-gray-100 px-4 py-2 dark:bg-gray-800">
                <p v-if="isRepeatURL" class="text-red-600 text-sm pb-1">* 網址已經存在，請重新確認 !</p>
                <input
                  type="text"
                  v-model="tabInfo.title"
                  placeholder="輸入網址名稱"
                  class="block w-full border-gray-200 text-sm border rounded-md dark:text-gray-100 p-1 mb-2 dark:bg-gray-600 dark:border-gray-400"
                />
                <input
                  type="text"
                  v-model="tabInfo.url"
                  placeholder="輸入網址"
                  class="block w-full border-gray-200 text-sm border rounded-md p-1 dark:text-gray-100 mb-2 dark:bg-gray-600 dark:border-gray-400"
                />
                <button
                  @click="saveTab"
                  class="bg-blue-100 text-blue-500 px-2 py-1 mr-2 rounded text-sm dark:bg-gray-600 dark:text-white"
                >
                  修改
                </button>
                <button
                  @click="cancelTab"
                  class="bg-blue-100 text-blue-500 px-2 py-1 rounded text-sm dark:bg-gray-600 dark:text-white"
                >
                  取消
                </button>
              </div>
            </template>
          </ul>
        </template>
        <div v-else class="flex flex-col items-center justify-center h-[120px]">
          <i-material-symbols:data-info-alert-rounded class="text-[35px] text-gray-500" />
          <p class="text-gray-500 font-black">暫無資料</p>
        </div>
      </section>
      <footer class="text-xs mt-auto text-gray-400 bg-blue-50 text-center py-1 dark:bg-gray-800">
        2023@ 我是一隻<a
          href="https://github.com/mandy0315?tab=repositories"
          class="underline underline-offset-2"
          target="_blank"
          rel="noreferrer noopener"
          >小敏蟲</a
        >
        - 暫存網址套件
      </footer>
    </div>
  </main>
</template>

<style scoped lang="scss">
.c-scrollbar-style {
  &::-webkit-scrollbar {
    @apply w-[6px] bg-gray-200;
  }
  &::-webkit-scrollbar-thumb {
    @apply rounded bg-blue-200 dark:bg-gray-500;
  }
}
</style>
