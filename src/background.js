// 初始狀態監聽
chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
});

chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab) => {
  console.log('onUpdated...');
  if (changeInfo.status === 'loading') {
    setScripting(tabId,tab.url);
  }
})

const setScripting = async (tabId,tabUrl) => { 
  const urlIsVaild = getUrlIsVaild(tabUrl);
  console.log(urlIsVaild);
  if(!urlIsVaild) return false;
  const scriptURL = await chrome.runtime.getURL('content.html');
  await chrome.scripting.executeScript({
    target: { tabId },
    func: injectedIframe,
    args: [scriptURL]
  });
};

const getUrlIsVaild = (tabUrl) => {
  const pattern = new RegExp('https://github.com/mandy0315/*');
  return pattern.test(tabUrl);
}

const injectedIframe = (scriptURL) => { 
  const El = document.querySelector('#ma-iframe');
  if (El) return false;
  const iframeEl = document.createElement('iframe');
  iframeEl.sandbox = 'allow-scripts allow-popups'; //允許在iframe裡使用js
  iframeEl.setAttribute('id', 'ma-iframe');
  iframeEl.setAttribute('src', scriptURL);
  iframeEl.setAttribute(
    'style',
    'width:335px; height:440px; z-index:2147483647; position:fixed; bottom:30px;right:20px;font-size:16px; background: #ffffff;  box-shadow: 2px 2px 10px rgba(0,0,0,.5); border: 0px;'
  );
  document.body.appendChild(iframeEl);
};
