// Add a startup log
console.log("Background script loaded");

// Inject our modifications when the page loads
chrome.webRequest.onCompleted.addListener(
    function(details) {
        console.log("Page loaded, injecting modifications");
        
        // Inject our modifications
        chrome.tabs.executeScript(details.tabId, {
            code: `
                const originalOpen = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function(method, url) {
                    this._url = url;  // Store URL for checking in send
                    return originalOpen.apply(this, arguments);
                };

                const originalSend = XMLHttpRequest.prototype.send;
                XMLHttpRequest.prototype.send = function(data) {
                    if(this._url && this._url.includes('espressoservices/rest/textentry')){
                        let jsonData = JSON.parse(data);
                        let html = jsonData.values[5048].value;
                        // Replace <br> tags with newlines and strip all HTML tags
                        let plaintext = html.replace(/<br\\s*\\/?>/gi, '\n').replace(/<[^>]*>/g, '');
                        console.log('Plaintext:', plaintext);
                        jsonData.values[2925].value = plaintext;
                        data = JSON.stringify(jsonData);
                    }
                    return originalSend.call(this, data);
                };
            `
        });
    },
    {
        urls: ["*://tms.artmuseums.harvard.edu/*"],
        types: ["main_frame"]
    }
);