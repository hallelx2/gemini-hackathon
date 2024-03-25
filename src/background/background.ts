chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log(msg);
    console.log(sender);
    sendResponse("From the background Script");
});

chrome.commands.onCommand.addListener(function(command) {
    if (command === "myCommand") {
      // Execute your function here by invoking the Speech function
      console.log("My command was triggered!");
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'executeFunction' });
      });
    }
});


