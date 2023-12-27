import type { StorageDataOptions, AlarmsOptions } from '@/types';

export const getCurrentTab = async () => {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

export const setStorageData = async (options: StorageDataOptions): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(options, () => {
      if (chrome.runtime.lastError) {
        reject(false); // 表示失敗
      } else {
        resolve(true); // 表示成功
      }
    });
  });
};

export const getStorageData = async (key: string) => {
  try {
    const data = await chrome.storage.sync.get([key]);
    return data[key];
  } catch (e) {
    console.log('取得資料失敗');
  }
};

export const openOptions = () => {
  chrome.runtime.openOptionsPage();
};

export const setBadge = async () => {
  const isShowBadgeCount = await getStorageData('isShowBadgeCount');
  const tabList = await getStorageData('tabList');
  const tabListLen = Object.values(tabList).length || 0;

  if (isShowBadgeCount) {
    chrome.action.setBadgeText({ text: `${tabListLen}` });
    chrome.action.setBadgeBackgroundColor({ color: '#dbeafe' });
    chrome.action.setBadgeTextColor({ color: '#3b82f6' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
};

export const createAlarms = async (name: string, options: Partial<AlarmsOptions>) => {
  try {
    await chrome.alarms.create(name, options);
  } catch (e) {
    console.log('建立鬧鐘失敗');
  }
};
