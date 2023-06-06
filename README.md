# flashcards-vue-extension

This is a rebuild of my previous flashcards extension using Vue 3 and Vite.


## Install

The extension is awaiting review in the chrome webstore. For now, you must install manually.

1. Clone and pull the repo.
2. `cd` into the repo and run `npm install` to install packages and then `npm run build`. You should see the built extension appear in the `dist` folder.
3. Go to google chrome manage extensions page: [chrome://extensions/](chrome://extensions/) and click 'Load Unpacked.' Navigate to your the `dist` folder where the extension was built. Select this folder.
4. You should now see the tile appear for Super Flashcards. Enable it and click on the puzzle piece in the top right corner to pin it to the browser bar.


## How to use.

1. Currently, you can log in as a test user to demo the functionality. Click on the login panel and use the demo credentials user Test1, password password123.
2. You may have to wait a couple of minutes for the Heroku server to spin up, so that you can retrieve flashcards to review, and also to use it for generating flashcards.

**Create Flashcards**
3. You can enter flashcards manually, or highlight any text you want to summarise and right click. Select 'make flashcards for ...' from the context menu. You will see the `loading` badge appear on the flashcards icon in the corner of your browser. When the loading badge disappears it means that the flashcards have been generated (or it failed to connect whoops).
4. Click on the icon and the create panel to view the  flashcards that have been generated. You can move between them, edit, and delete any cards and then click 'save cards' to add them into your deck of flashcards.

**Review Flashcards**
5. When reviewing flashcards, click on the review panel. Come up with the answer to each prompt, and then click on `easy` if you got the card right. If you get the card wrong, however, click `dunno`. The page where the card was generated will open in a new tab for you to review the information.