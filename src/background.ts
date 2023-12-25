import { setStorageData, setBadge } from '@/utils/useChromeAPI';

/** event */

// 初始狀態監聽
chrome.runtime.onInstalled.addListener(async () => {
  console.log('onInstalled...');
  await setStorageData({
    listLimit: 10,
    isShowBadgeCount: true,
  });
  setBadge();
});
