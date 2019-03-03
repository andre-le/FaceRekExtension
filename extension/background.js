chrome.webRequest.onBeforeRequest.addListener(
    async function() {
        chrome.tabs.update({
            url: chrome.extension.getURL("redirect2.html")
        })
    },
    { urls: ["*://www.facebook.com/*"] },
    ["blocking"]
)
