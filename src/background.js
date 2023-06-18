
chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		title: "make flashcard for '%s'",
		contexts: ['page','selection'],
		type: "normal",
		visible: true,
		enabled: true,
		id: "flashcardContextMenu"
	})
});

chrome.contextMenus.onClicked.addListener(
		cardMaker
	);
	
async function cardMaker (info,tab) {

	const new_input = {
		"text": info.selectionText,
		"origin": tab.url
	}

	if (!new_input.text) {
		console.log('no text selected')
		return
	}

	if (new_input.text.length < 10 || new_input.text.length > 2000 ) {
		console.log('text too short or too long (max length 2000 characters): ', new_input.text.length)
		return
	}

	chrome.storage.session.get('sessionToken')
		.then(({sessionToken}) => {
			chrome.action.setBadgeText({"text": "loading"})
			fetch('https://flashcards-server.herokuapp.com/api/flashcards', {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${sessionToken}`
				},
				body: JSON.stringify(new_input)
			})
			.then(response => response.json())
			.then(data => {
				chrome.storage.session.get('cards', (result) => {
					if (result.cards) {
						chrome.storage.session.set({"created_cards": [...result.created_cards, ...data.flashcards] })
					} else {
						chrome.storage.session.set({"created_cards": data.flashcards })
					}
				})
				chrome.action.setBadgeText({"text": ""})
			})
			.catch(error => {
				chrome.action.setBadgeText({"text": ""})
			})

		})
		.catch(error => {
			console.log(error)
		})
}