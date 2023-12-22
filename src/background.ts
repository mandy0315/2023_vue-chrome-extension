import { setStorageData } from '@/utils/useChromeAPI';
// 初始狀態監聽
chrome.runtime.onInstalled.addListener(async () => {
  console.log('onInstalled...');
  await setStorageData({
    listLimit: 10,
    isShowIconCount: true,
  });
});
