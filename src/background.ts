import { setStorageData, setBadge, createAlarms } from '@/utils/useChromeAPI';

/** event */

// 初始狀態監聽
chrome.runtime.onInstalled.addListener(async () => {
  console.log('onInstalled...');
  await setStorageData({
    listLimit: 10,
    isShowBadgeCount: true,
  });
  setBadge();
  setDailyUpdateAlarm();
});

// 鬧鐘監聽器
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'expirationTabs') {
    updateExpirationTabs();
  }
});

/** utils */
const getTimeUntilUpdate = () => {
  const now = new Date();
  const targetTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    15, // 時
    20, // 分
    0, // 秒
  );

  let timeUntilUpdate = targetTime.getTime() - now.getTime();
  if (timeUntilUpdate < 0) {
    /** 超過時間設定明天同時間
     * 24 * 60 * 60 * 1000 => 24 小時轉毫秒
     */
    timeUntilUpdate += 24 * 60 * 60 * 1000;
  }
  return timeUntilUpdate;
};
const setDailyUpdateAlarm = async () => {
  const timeUntilUpdate = getTimeUntilUpdate();

  /** 建立鬧鐘 */
  createAlarms('expirationTabs', {
    when: Date.now() + timeUntilUpdate,
    periodInMinutes: 24 * 60,
  });
};
const updateExpirationTabs = () => {
  console.log('updateExpirationTabs...');
};
