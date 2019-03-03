chrome.webRequest.onBeforeRequest.addListener(
    function() {
        chrome.tabs.getSelected(null, function(tab) {
            if (localStorage.getItem(tab.url)) return
            else
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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method === "updateKeys") {
        localStorage.setItem(request.key, true)
        sendResponse()
    }
})
