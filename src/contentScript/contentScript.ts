chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'extractText') {
      var text = document.body.innerText;
      sendResponse({text: text});
    }
  });
  // Example: Accessing the title of the webpage
// console.log(document.title);

// // Example: Modifying the background color of the webpage body
// document.body.style.backgroundColor = "lightblue";

chrome.runtime.sendMessage('I am loading content script', (response) => {
    console.log(response);
    console.log('I am content script')

})

window.onload = (event) => {
    console.log('page is fully loaded');
};
