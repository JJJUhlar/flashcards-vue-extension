
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

	const token = await getToken()

	chrome.action.setBadgeText({"text": "loading"})

	const input_json = JSON.stringify(new_input)

	fetch('https://flashcards-server.herokuapp.com/api/flashcards', {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		},
		body: input_json
	})
	.then(response => response.json())
	.then(data => {

		const new_created_cards = data.flashcards

		chrome.storage.session.get('created_cards')
		.then((res)=>{

			if (res.created_cards) {
				new_created_cards.concat(res.created_cards)
			}

			chrome.storage.session.set({'created_cards': new_created_cards})
			chrome.action.setBadgeText({"text": ""})
		})
		.catch(err=> {
			chrome.action.setBadgeText({"text": ""})
			console.error(err)
		})
	})
	.catch(error => {

		chrome.action.setBadgeText({"text": ""})
	})
}

async function getToken() {
	return new Promise((resolve, reject) => {
		try {
			chrome.storage.session.get('sessionToken')
				.then(({sessionToken})=>{
					resolve(sessionToken)
			})
			
		} catch (error) {
			console.error(error)
		}
	})
}

