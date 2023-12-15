import setScripting from "./utils/setScripting";

// 初始狀態監聽
chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
});

chrome.tabs.onUpdated.addListener(async(tabId,changeInfo,tab) => {
  console.log('onUpdated...');
  if (changeInfo.status === 'loading') {
    setScripting(tabId,tab.url);
  }
})

