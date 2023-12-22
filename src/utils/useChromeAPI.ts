import { TabList } from '@/types/popup';
import { SetStorageData } from '@/types/useChromeAPI';

export const getCurrentTab = async () => {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

export const setStorageData = async (obj: SetStorageData): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(obj, () => {
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
