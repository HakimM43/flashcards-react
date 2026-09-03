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

## Reflection

- AI saved me time by helping me set up the React and TypeScript structure and organize the functions needed for decks, cards, search, navigation, and LocalStorage.

- One issue I identified was that the New Deck button appeared not to work while I was testing the app inside the VS Code browser preview. I tested the same Vite app in Microsoft Edge and confirmed that the button and browser prompts worked correctly.

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