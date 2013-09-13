chrome.tabs.onUpdated.addListener(function(id, info, tab) {
	// console.log('tab state: '+info.status);
	if (info.status == "complete") {
		if (tab.url.toLowerCase().indexOf("github.com") > -1) {
			// console.log('we are at github.com!');
			chrome.pageAction.show(tab.id);

			//check if content_Script is already running
			chrome.tabs.query({
				active: true,
				currentWindow: true
			}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					message: "hello?"
				}, function(response) {

					if (response) {
						//send another message to run content script
						chrome.tabs.sendMessage(tabs[0].id, {
							message: "run"
						}, function(response) {});
					} 
					else {
						console.log('content_script not injected yet');
					}
				});
			});

		} else {
			return;
		}
	} else return;

});