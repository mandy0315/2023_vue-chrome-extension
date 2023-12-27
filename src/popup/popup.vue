<script setup lang="ts">
import { computed, ref } from 'vue';
import useNotify from '@/composables/useNotify';
import { useConfirmDialog } from '@/composables/useDialog';
import { getCurrentTab, setStorageData, getStorageData, openOptions, setBadge } from '@/utils/useChromeAPI';
import { dateFormat } from '@/utils/useDayTime';

import type { Tab } from '@/types';

const tabInfo = ref({
  title: '',
  url: '',
});
const tabList = ref<Array<Tab>>([]);
const isRepeatURL = ref(false);
const isAddTab = ref(true);
const isDarkMode = ref(false);
const editTabUrl = ref('');
const listLimit = ref(10);

const isListOverLimit = computed(() => {
  return tabList.value.length >= listLimit.value;
});

const updateCurrTabInfo = async () => {
  const tab = await getCurrentTab();
  tabInfo.value.title = tab.title || '';
  tabInfo.value.url = tab.url || '';
};
const updateTabList = async () => {
  const storageTabList = await getStorageData('tabList');
  const arr: Array<Tab> = Object.values(storageTabList) || [];
  if (arr.length > 0) {
    tabList.value = arr;
  }
  // test data
  // tabList.value = [
  //   {
  //     title:
  //       '測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試測試1',
  //     url: 'https://www.google.com',
  //     updateDate: '2023/12/26',
  //   },
  //   {
  //     title: '測試測試測試測試測試2',
  //     url: 'http://www.chinasgp.cn/article/2824.html',
  //     updateDate: '2023/12/26',
  //   },
  //   {
  //     title: '測試測試測試測試測試3',
  //     url: 'http://www.chinasgp.cn/article/2825.html',
  //     updateDate: '2023/12/26',
  //   },
  //   {
  //     title: '測試測試測試測試測試4',
  //     url: 'http://www.chinasgp.cn/article/2826.html',
  //     updateDate: '2023/12/26',
  //   },
  //   {
  //     title: '測試測試測試測試測試5',
  //     url: 'http://www.chinasgp.cn/article/2827.html',
  //     updateDate: '2023/12/26',
  //   },
  //   {
  //     title: '測試測試測試測試測試6',
  //     url: 'http://www.chinasgp.cn/article/2828.html',
  //     updateDate: '2023/12/26',
  //   },
  //   {
  //     title: '測試測試測試測試測試7',
  //     url: 'http://www.chinasgp.cn/article/2829.html',
  //     updateDate: '2023/12/26',
  //   },
  //   {
  //     title: '測試測試測試測試測試8',
  //     url: 'http://www.chinasgp.cn/article/2830.html',
  //     updateDate: '2023/12/26',
  //   },
  //   {
  //     title: '測試測試測試測試測試9',
  //     url: 'http://www.chinasgp.cn/article/2831.html',
  //     updateDate: '2023/12/26',
  //   },
  //   {
  //     title: '測試測試測試測試測試10',
  //     url: 'http://www.chinasgp.cn/article/2832.html',
  //     updateDate: '2023/12/26',
  //   },
  // ];
};
const updatelistLimit = async () => {
  const storagelistLimit = await getStorageData('listLimit');
  listLimit.value = storagelistLimit;
  if (tabList.value.length > listLimit.value) {
    tabList.value = tabList.value.slice(0, listLimit.value);
    await setStorageData({ tabList: tabList.value });
  }
};

const toggleAddTab = () => {
  isAddTab.value = !isAddTab.value;
  if (isAddTab.value) {
    updateCurrTabInfo();
  }
};

const { isShowNotify, notifyContent, setNotify } = useNotify();
const { isShowDialog, setConfirmDialog, dialogContent } = useConfirmDialog();

const saveTab = async () => {
  const newTab = {
    title: tabInfo.value.title,
    url: tabInfo.value.url,
    updateDate: dateFormat(new Date()),
  };

  let newTabList = [];

  if (editTabUrl.value === '') {
    // 新增Tab
    // - 檢查是否有重複網址
    if (tabList.value.length > 0) {
      const findUrl = tabList.value.find((tab: Tab) => tab.url === newTab.url);
      if (findUrl) {
        isRepeatURL.value = true;
        return;
      }
    }
    newTabList = [...tabList.value, newTab];
  } else {
    // 編輯Tab

    // - 檢查是否有重複網址
    const filterTabList = tabList.value.filter((tab: Tab) => tab.url !== editTabUrl.value);
    const findUrl = filterTabList.find((tab: Tab) => tab.url === newTab.url);
    if (findUrl) {
      isRepeatURL.value = true;
      return;
    }

    newTabList = tabList.value.map((tab: Tab) => {
      if (tab.url === editTabUrl.value) {
        return newTab;
      }
      return tab;
    });
  }

  try {
    await setStorageData({ tabList: newTabList });
    tabList.value = newTabList;
    setNotify({
      message: `${editTabUrl.value === '' ? '新增' : '修改'}成功`,
    });
    setBadge();
    editTabUrl.value = '';
  } catch (err) {
    console.log('tab 儲存失敗');
  }
};
const deleteTab = async (currUrl: string) => {
  tabList.value = tabList.value.filter((tab: Tab) => tab.url !== currUrl);
  try {
    await setStorageData({ tabList: tabList.value });
    setBadge();
  } catch (err) {
    console.log('tab 刪除失敗');
  }
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
const deleteAllDialog = async () => {
  const deleteAllTabs = async () => {
    try {
      await setStorageData({ tabList: [] });
      tabList.value = [];
      setBadge();
    } catch (err) {
      console.log('刪除失敗');
    }
  };

  try {
    await setConfirmDialog({
      title: '刪除全部列表',
      message: '刪除全部列表後將無法復原，您確定要刪除嗎？',
    });
    deleteAllTabs();
  } catch (err) {
    console.log('cancel');
  }
};

updateCurrTabInfo();
updateTabList();
updatelistLimit();
</script>

<template>
  <main class="w-[520px] relative" :class="{ dark: isDarkMode }">
    <header class="px-4 h-12 flex items-center bg-blue-300 dark:bg-gray-600">
      <h1 class="text-gray-50 text-lg font-bold">SCRATCH URLS</h1>
      <button class="ml-auto text-white px-2" @click="isDarkMode = !isDarkMode">
        <i-material-symbols:wb-sunny-rounded v-if="isDarkMode" class="text-white text-[20px]" />
        <i-material-symbols:nights-stay-rounded v-else class="text-white text-[18px]" />
      </button>
      <button @click="openOptions" class="px-2">
        <i-material-symbols:settings-rounded class="text-white text-[18px]" />
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
              :disabled="isListOverLimit"
              class="block text-base w-full border-gray-200 border rounded-md p-1 mb-2 dark:text-gray-100 dark:bg-gray-600 dark:border-gray-400"
            />
            <input
              type="text"
              v-model="tabInfo.url"
              placeholder="輸入網址"
              :disabled="isListOverLimit"
              class="block w-full text-base border-gray-200 border rounded-md p-1 mb-2 dark:text-gray-100 dark:bg-gray-600 dark:border-gray-400"
            />
            <button
              @click="saveTab"
              :disabled="isListOverLimit"
              class="px-2 py-1 rounded text-sm"
              :class="
                isListOverLimit
                  ? 'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-600 dark:text-gray-400'
                  : 'bg-blue-100 text-blue-500 dark:bg-gray-600 dark:text-white'
              "
            >
              儲存
            </button>
          </div>
        </div>
      </section>
      <section class="px-4 pt-10 pb-4">
        <template v-if="tabList.length > 0">
          <div class="flex items-center pb-2">
            <h2 class="text-base font-black text-gray-500 pr-2 dark:text-gray-100">暫存列表</h2>
            <span class="text-gray-500 text-sm dark:text-gray-100">＊限制暫存 {{ listLimit }} 列網址</span>
            <button
              @click="deleteAllDialog"
              class="px-2 py-1 rounded text-sm ml-auto bg-red-100 text-red-500 dark:bg-gray-600 dark:text-white"
            >
              全部刪除
            </button>
          </div>

          <ul>
            <template v-for="(tab, index) in tabList" :key="tab.title">
              <li class="flex border-b py-2 pr-4 dark:border-gray-600">
                <span class="text-sm pr-2 w-6 text-right text-gray-500 dark:text-gray-100">{{ index + 1 }}</span>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-100">
                    {{ tab.updateDate }}
                  </p>
                  <a
                    data-tooltip-group
                    :href="tab.url"
                    target="_blank"
                    :alt="tab.url"
                    rel="noreferrer noopener"
                    class="relative"
                  >
                    <p
                      class="underline text-base underline-offset-2 truncate w-[380px] text-blue-500 dark:text-gray-100"
                    >
                      {{ tab.title }}
                    </p>
                    <div
                      data-tooltip
                      class="absolute shadow-md top-6 z-10 truncate w-[380px] rounded left-0 bg-white px-2 py-1 text-sm text-gray-400 dark:bg-gray-800"
                    >
                      {{ tab.url }}
                    </div>
                  </a>
                </div>

                <div class="ml-auto flex items-center">
                  <button @click="editTab(tab.title, tab.url)" class="px-1">
                    <i-material-symbols:edit-square-rounded class="text-gray-500 text-base dark:text-gray-100" />
                  </button>
                  <button class="px-1" @click="deleteTab(tab.url)">
                    <i-material-symbols:delete class="text-gray-500 text-base dark:text-gray-100" />
                  </button>
                </div>
              </li>
              <div v-if="editTabUrl === tab.url" class="bg-gray-100 px-4 py-2 dark:bg-gray-800">
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
          <p class="text-gray-500 font-black text-base">暫無資料</p>
        </div>
      </section>
      <footer class="text-xs mt-auto text-gray-400 bg-blue-50 text-center py-1 dark:bg-gray-800">
        2023@ 我是一隻小敏蟲 -
        <a
          href="https://github.com/mandy0315/chrome_extension_vue"
          class="underline underline-offset-2"
          target="_blank"
          rel="noreferrer noopener"
          >暫存網址套件</a
        >
      </footer>
    </div>
    <global-notify v-if="isShowNotify" :message="notifyContent" />
    <global-dialog v-if="isShowDialog" :title="dialogContent.title" :message="dialogContent.message" />
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
