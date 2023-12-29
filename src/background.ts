import { setStorageData, setBadge, createAlarms, getStorageData } from '@/utils/useChromeAPI';
import { dateDiff } from '@/utils/useDayTime';

import type { Tab } from '@/types';

/** event */

// 初始狀態監聽
chrome.runtime.onInstalled.addListener(async () => {
  console.log('onInstalled...');
  await setStorageData({
    tabsDeleteDays: 7,
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
    23, // 時
    0, // 分
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

  /** 建立每日鬧鐘 */
  createAlarms('expirationTabs', {
    when: Date.now() + timeUntilUpdate,
    periodInMinutes: 24 * 60,
  });
};
const updateExpirationTabs = async () => {
  const storageTabsDeleteDays = await getStorageData('tabsDeleteDays');
  const storageTabList = await getStorageData('tabList');
  const tabList: Array<Tab> = Object.values(storageTabList) || [];
  if (tabList.length === 0) return;

  const newTabList = tabList.filter((tab: Tab) => {
    const diffDays = dateDiff(tab.updateDate, new Date());
    return diffDays < storageTabsDeleteDays;
  });

  await setStorageData({
    tabList: newTabList,
  });
};
