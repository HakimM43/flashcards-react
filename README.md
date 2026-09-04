# Flashcards Study App

A browser-based flashcards study app built with React, TypeScript, and Vite.

## Technologies Used

- React
- TypeScript
- Vite
- CSS
- LocalStorage

## Features

- Create, edit, and delete decks
- Create, edit, and delete flashcards
- Flip cards to view answers
- Previous and Next card navigation
- Shuffle cards
- Search cards by keyword
- Save decks and cards using LocalStorage
- Restore saved data after refreshing the page
- Responsive layout
- Keyboard focus styles for accessibility
- Keyboard shortcuts using Space to flip and the Left/Right arrow keys to navigate cards

## Reflection

- AI saved me time by helping me set up the React and TypeScript structure and organize the functions needed for decks, cards, search, navigation, and LocalStorage.

- One AI-generated version of the app had a bug where the Flip button did not work because the event handling was missing. I identified the missing connection while testing and fixed it by connecting the Flip control to the flipCard() function.

- I refactored the project from a plain HTML, CSS, and JavaScript version into React and TypeScript. I used React state such as `decks`, `activeDeckId`, `currentCardIndex`, `searchTerm`, and `isFlipped` instead of manually updating the DOM.

- I added accessibility improvements including an `aria-label` on the card search input and visible focus styles for buttons and inputs.

- I improved my AI prompts by asking for complete updated files such as `App.tsx` instead of individual lines. This made it easier to keep the code organized, compare changes, and avoid accidentally leaving out required code.

## Running the Project

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown by Vite in your browser, usually:

http://localhost:5173/