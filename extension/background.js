chrome.webRequest.onBeforeRequest.addListener(
    async function() {
        chrome.tabs.update({
            url: chrome.extension.getURL("redirect.html")
        })
    },
    { urls: ["*://www.facebook.com/*"] },
    ["blocking"]
)
