chrome.webRequest.onBeforeRequest.addListener(
    function() {
        chrome.tabs.getSelected(null, function(tab) {
            console.log(tab.url);
            if (localStorage.getItem(tab.url)) return
            else if(tab.url == "https://www.facebook.com/")
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
        localStorage.setItem(request.key, true);
        sendResponse()
    } else if(request.method == "updateBlocks") {
        localStorage.setItem("blocks", request.key);
        console.log(localStorage.getItem("blocks").split(","));
        sendResponse()
    }
})
