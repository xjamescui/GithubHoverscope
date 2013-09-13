function openPopup(file) {
	var file_url = $(file).attr("href");
	var title = $(file).text();

	//config tooltip

	var tooltip = $(file).qtip({
		overwrite: false,
		content: {
			title: title,
			text: "..."
		},
		hide: {
			fixed: true,
			delay: 200
		},
		position: {
			my: 'left center'
		},
		style: {
			classes: 'qtip-bootstrap'
		}
	});
	tooltip = tooltip.qtip('api');
	tooltip.show();


	//dynamic content filling
	$.ajax({
		url: file_url,
		type: 'GET',
		dataType: 'html'
	})
		.done(function(data) {

			var content = $(data).find("div.blob-wrapper, #readme, table.files");

			//a simple work around to get include the element itself when using $.html()
			//creats a dummy <p>
			var content_displayed = content.wrap('<p/>').parent().html();
			//undo the "work around" after it is used: remove dummy <p>
			content.unwrap();

			//fill content into tooltip
			tooltip.set("content.button", true);
			tooltip.set("content.text", content_displayed);
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			//console.log("complete");
		});

}

//main function
function microscope() {
	$("a.js-directory-link").each(function(index, file) {
		
		//underline each file, to show that the extension is "there"
		$(file).css({
			"border-bottom": '1px dotted'
		});

		$(file).hoverIntent(function() {
			/* Stuff to do when the mouse enters the element */

			//open the new tooltip
			openPopup(file);


		}, function() {
			/* Stuff to do when the mouse leaves the element */
		});

		$(file).click(function(event) {
			$(file).qtip("toggle", false);
		});
	});
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.message === "hello?") {
			sendResponse({
				message: "I am here!"
			});
		} else if (request.message === "run") {
			microscope();
		}
	});