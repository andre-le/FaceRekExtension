chrome.webRequest.onBeforeRequest.addListener(
    function() {
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.update({
                url:
                    chrome.extension.getURL("redirect.html") +
                    "?url=" +
                    encodeURIComponent(tab.url)
            })
        })
    },
    { urls: ["*://www.facebook.com/*"] },
    ["blocking"]
)
