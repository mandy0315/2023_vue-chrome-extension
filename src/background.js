chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  console.log('prevState',prevState);
  const nextState = prevState === 'ON' ? 'OFF' : 'ON'

  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });
});