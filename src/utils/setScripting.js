const setScripting = async (tabId,tabUrl) => { 
  const urlIsVaild = getUrlIsVaild(tabUrl);
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
  if (!El){
    const iframeEl = document.createElement('iframe');
    iframeEl.sandbox = 'allow-scripts allow-popups'; //允許在iframe裡使用js
    iframeEl.setAttribute('id', 'ma-iframe');
    iframeEl.setAttribute('src', scriptURL);
    iframeEl.setAttribute('style', 'z-index:2147483647; position:fixed; bottom:30px; right:20px; border: 0px; width: 335px; height: 440px;');
    document.body.appendChild(iframeEl);
  }
};

export default setScripting;