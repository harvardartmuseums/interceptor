console.log('Content script loaded');

const code = `
    console.log('Injected script running');
    
    // Store original XMLHttpRequest
    const OriginalXHR = window.XMLHttpRequest;
    
    // Create new constructor that wraps the original
    window.XMLHttpRequest = function() {
        const xhr = new OriginalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;
        
        xhr.open = function(method, url) {
            console.log('XHR open intercepted:', method, url);
            this._method = method;  // Store method as well
            this._url = url;
            return originalOpen.apply(this, arguments);
        };
        
        xhr.send = function(data) {
            console.log('XHR send intercepted:', this._method, this._url);
            if(this._method === 'PUT' && this._url && this._url.includes('espressoservices/rest/textentry')){
                try {
                    let jsonData = JSON.parse(data);
                    let html = jsonData.values[5048].value;
                    // Replace <br> tags with newlines and strip all HTML tags
                    let plaintext = html.replace(/<br[^>]*>/gi, '\\n').replace(/<[^>]*>/g, '');
                    console.log('Plaintext:', plaintext);
                    jsonData.values[2925].value = plaintext;
                    data = JSON.stringify(jsonData);
                } catch (error) {
                    console.error('Error processing request:', error);
                    return originalSend.call(this, data);
                }
            }
            return originalSend.call(this, data);
        };
        
        return xhr;
    };
    
    console.log('XMLHttpRequest overridden');
`;

const script = document.createElement('script');
const blob = new Blob([code], { type: 'text/javascript' });
const url = URL.createObjectURL(blob);
script.src = url;
const parent = (document.head || document.documentElement);
parent.appendChild(script); 