# interceptor

- Go to "chrome://extensions" (or "brave://extensions", etc.)
- Enable Developer Mode
- Load unpacked, select the root folder of this repo
![extension_panel](https://github.com/user-attachments/assets/e15d7780-10d5-4279-bb3a-3ec487bc96ad)



xhr.js is a modified version of the production file at https://tms.artmuseums.harvard.edu/galsys/dojo/request/xhr.js

This extension accomplishes the same modification by overloading the XMLHttpRequest object and modifying the request when it comes in from the production version of xhr.js.





