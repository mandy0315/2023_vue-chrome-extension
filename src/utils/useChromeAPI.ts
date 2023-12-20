import { TabList } from '@/types/popup';

export const getCurrentTab = async () => {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

export const setStorageData = async (obj: { [key in string]: string | TabList }) => {
  try {
    await chrome.storage.local.set(obj);
    console.log('存取資料成功');
  } catch (e) {
    console.log('存取資料失敗');
  }
};

export const getStorageData = async (key: string) => {
  try {
    const data = await chrome.storage.local.get(key);
    return data[key];
  } catch (e) {
    console.log('取得資料失敗');
  }
};
