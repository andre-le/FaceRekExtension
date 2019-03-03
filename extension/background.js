chrome.webRequest.onBeforeRequest.addListener(
    function() {
        chrome.tabs.getSelected(null, function(tab) {
            if (
                tab.url.indexOf("redirect.html") !== -1 ||
                localStorage.getItem(tab.url) ||
                !localStorage.getItem("sites") ||
                localStorage
                    .getItem("sites")
                    .split(",")
                    .every(s => tab.url.indexOf(s) < 0)
            )
                return

            chrome.tabs.update({
                url:
                    chrome.extension.getURL("redirect.html") +
                    "?url=" +
                    encodeURIComponent(tab.url)
            })
        })
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
)

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method === "updateKeys") {
        localStorage.setItem(request.key, true)
        sendResponse()
    } else if (request.method == "updateBlocks") {
        localStorage.setItem("sites", request.key)
        sendResponse()
    }
})
