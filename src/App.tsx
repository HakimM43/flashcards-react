import { useEffect, useMemo, useState } from "react";
import "./App.css";

type Flashcard = {
  id: string;
  front: string;
  back: string;
};

type Deck = {
  id: string;
  name: string;
  cards: Flashcard[];
};

function App() {
  const [decks, setDecks] = useState<Deck[]>(() => {
    const savedDecks = localStorage.getItem("reactFlashcardDecks");

    if (!savedDecks) {
      return [];
    }

    try {
      return JSON.parse(savedDecks);
    } catch {
      return [];
    }
  });

  const [activeDeckId, setActiveDeckId] = useState<string | null>(() => {
    return localStorage.getItem("reactActiveDeckId");
  });

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  const activeDeck = decks.find((deck) => deck.id === activeDeckId);

  const visibleCards = useMemo(() => {
    if (!activeDeck) {
      return [];
    }

    const term = searchTerm.trim().toLowerCase();

    if (term === "") {
      return activeDeck.cards;
    }

    return activeDeck.cards.filter((card) => {
      return (
        card.front.toLowerCase().includes(term) ||
        card.back.toLowerCase().includes(term)
      );
    });
  }, [activeDeck, searchTerm]);

  useEffect(() => {
    localStorage.setItem("reactFlashcardDecks", JSON.stringify(decks));
  }, [decks]);

  useEffect(() => {
    if (activeDeckId) {
      localStorage.setItem("reactActiveDeckId", activeDeckId);
    } else {
      localStorage.removeItem("reactActiveDeckId");
    }
  }, [activeDeckId]);

  useEffect(() => {
    if (
      activeDeckId &&
      !decks.some((deck) => deck.id === activeDeckId)
    ) {
      setActiveDeckId(decks.length > 0 ? decks[0].id : null);
    }
  }, [decks, activeDeckId]);

  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [searchTerm, activeDeckId]);

useEffect(() => {
  function handleKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;

    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();

      if (visibleCards.length > 0) {
        setIsFlipped((currentValue) => !currentValue);
      }
    }

    if (event.key === "ArrowRight") {
      if (visibleCards.length > 0) {
        setCurrentCardIndex((currentIndex) =>
          currentIndex + 1 >= visibleCards.length
            ? 0
            : currentIndex + 1
        );

        setIsFlipped(false);
      }
    }

    if (event.key === "ArrowLeft") {
      if (visibleCards.length > 0) {
        setCurrentCardIndex((currentIndex) =>
          currentIndex - 1 < 0
            ? visibleCards.length - 1
            : currentIndex - 1
        );

        setIsFlipped(false);
      }
    }
  }

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [visibleCards.length]);
  
  function createDeck() {
    const deckName = prompt("Enter a name for your new deck:");

    if (!deckName || deckName.trim() === "") {
      return;
    }

    const newDeck: Deck = {
      id: Date.now().toString(),
      name: deckName.trim(),
      cards: [],
    };

    setDecks((currentDecks) => [...currentDecks, newDeck]);
    setActiveDeckId(newDeck.id);
    setCurrentCardIndex(0);
    setSearchTerm("");
    setIsFlipped(false);
  }

  function editDeck() {
    if (!activeDeck) {
      alert("Select a deck first.");
      return;
    }

    const newName = prompt("Enter a new deck name:", activeDeck.name);

    if (!newName || newName.trim() === "") {
      return;
    }

    setDecks((currentDecks) =>
      currentDecks.map((deck) =>
        deck.id === activeDeck.id
          ? { ...deck, name: newName.trim() }
          : deck
      )
    );
  }

  function deleteDeck() {
    if (!activeDeck) {
      alert("Select a deck first.");
      return;
    }

    const confirmed = confirm(`Delete "${activeDeck.name}"?`);

    if (!confirmed) {
      return;
    }

    const remainingDecks = decks.filter(
      (deck) => deck.id !== activeDeck.id
    );

    setDecks(remainingDecks);
    setActiveDeckId(
      remainingDecks.length > 0 ? remainingDecks[0].id : null
    );

    setCurrentCardIndex(0);
    setSearchTerm("");
    setIsFlipped(false);
  }

  function createCard() {
    if (!activeDeck) {
      alert("Create or select a deck first.");
      return;
    }

    const front = prompt("Enter the FRONT of the flashcard:");

    if (!front || front.trim() === "") {
      return;
    }

    const back = prompt("Enter the BACK of the flashcard:");

    if (!back || back.trim() === "") {
      return;
    }

    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: front.trim(),
      back: back.trim(),
    };

    setDecks((currentDecks) =>
      currentDecks.map((deck) =>
        deck.id === activeDeck.id
          ? { ...deck, cards: [...deck.cards, newCard] }
          : deck
      )
    );

    setSearchTerm("");
    setCurrentCardIndex(activeDeck.cards.length);
    setIsFlipped(false);
  }

  function flipCard() {
    if (visibleCards.length === 0) {
      return;
    }

    setIsFlipped((currentValue) => !currentValue);
  }

  function nextCard() {
    if (visibleCards.length === 0) {
      return;
    }

    setCurrentCardIndex((currentIndex) =>
      currentIndex + 1 >= visibleCards.length
        ? 0
        : currentIndex + 1
    );

    setIsFlipped(false);
  }

  function previousCard() {
    if (visibleCards.length === 0) {
      return;
    }

    setCurrentCardIndex((currentIndex) =>
      currentIndex - 1 < 0
        ? visibleCards.length - 1
        : currentIndex - 1
    );

    setIsFlipped(false);
  }

  function shuffleCards() {
    if (!activeDeck || activeDeck.cards.length < 2) {
      return;
    }

    const shuffledCards = [...activeDeck.cards];

    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));

      const temporaryCard = shuffledCards[i];
      shuffledCards[i] = shuffledCards[randomIndex];
      shuffledCards[randomIndex] = temporaryCard;
    }

    setDecks((currentDecks) =>
      currentDecks.map((deck) =>
        deck.id === activeDeck.id
          ? { ...deck, cards: shuffledCards }
          : deck
      )
    );

    setSearchTerm("");
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }

  function editCard() {
    const currentCard = visibleCards[currentCardIndex];

    if (!activeDeck || !currentCard) {
      alert("Select a card first.");
      return;
    }

    const newFront = prompt(
      "Edit the FRONT of the flashcard:",
      currentCard.front
    );

    if (!newFront || newFront.trim() === "") {
      return;
    }

    const newBack = prompt(
      "Edit the BACK of the flashcard:",
      currentCard.back
    );

    if (!newBack || newBack.trim() === "") {
      return;
    }

    setDecks((currentDecks) =>
      currentDecks.map((deck) => {
        if (deck.id !== activeDeck.id) {
          return deck;
        }

        return {
          ...deck,
          cards: deck.cards.map((card) =>
            card.id === currentCard.id
              ? {
                  ...card,
                  front: newFront.trim(),
                  back: newBack.trim(),
                }
              : card
          ),
        };
      })
    );

    setIsFlipped(false);
  }

  function deleteCard() {
    const currentCard = visibleCards[currentCardIndex];

    if (!activeDeck || !currentCard) {
      alert("Select a card first.");
      return;
    }

    const confirmed = confirm(
      `Delete this card?\n\n${currentCard.front}`
    );

    if (!confirmed) {
      return;
    }

    setDecks((currentDecks) =>
      currentDecks.map((deck) =>
        deck.id === activeDeck.id
          ? {
              ...deck,
              cards: deck.cards.filter(
                (card) => card.id !== currentCard.id
              ),
            }
          : deck
      )
    );

    setCurrentCardIndex(0);
    setIsFlipped(false);
  }

  const currentCard =
    visibleCards.length > 0
      ? visibleCards[
          Math.min(currentCardIndex, visibleCards.length - 1)
        ]
      : null;

  return (
    <div className="app">
      <header>
        <h1>Flashcards Study App</h1>

        <button onClick={createDeck}>+ New Deck</button>
      </header>

      <div className="app-container">
        <aside className="sidebar">
          <h2>My Decks</h2>

          <nav className="deck-list">
            {decks.length === 0 ? (
              <p>No decks yet.</p>
            ) : (
              decks.map((deck) => (
                <button
                  key={deck.id}
                  className={
                    deck.id === activeDeckId
                      ? "deck-button active"
                      : "deck-button"
                  }
                  onClick={() => {
                    setActiveDeckId(deck.id);
                    setSearchTerm("");
                  }}
                >
                  {deck.name}
                </button>
              ))
            )}
          </nav>
        </aside>

        <main>
          <section className="deck-header">
            <div>
              <h2>
                {activeDeck ? activeDeck.name : "Select a Deck"}
              </h2>

              <div className="deck-actions">
                <button onClick={editDeck}>Edit Deck</button>
                <button onClick={deleteDeck}>Delete Deck</button>
              </div>
            </div>

            <div className="toolbar">
              <input
                type="search"
                value={searchTerm}
                placeholder="Search cards..."
                aria-label="Search cards"
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />

              <button onClick={shuffleCards}>Shuffle</button>

              <button onClick={createCard}>+ New Card</button>
            </div>
          </section>

          <section className="card-area">
            <button
              className={`flashcard ${
                isFlipped ? "flipped" : ""
              }`}
              onClick={flipCard}
            >
              <div className="card-front">
                {!activeDeck
                  ? "Select or create a deck to begin."
                  : activeDeck.cards.length === 0
                  ? "No cards yet. Click + New Card."
                  : visibleCards.length === 0
                  ? "No matching cards found."
                  : currentCard?.front}
              </div>

              <div className="card-back">
                {currentCard?.back || ""}
              </div>
            </button>
          </section>

          <section className="study-controls">
            <button onClick={previousCard}>Previous</button>

            <button onClick={flipCard}>Flip</button>

            <button onClick={nextCard}>Next</button>

            <button onClick={editCard}>Edit Card</button>

            <button onClick={deleteCard}>Delete Card</button>
          </section>
        </main>
      </div>

      <footer>
        <p>
          Use Previous, Flip, and Next to study your flashcards.
        </p>
      </footer>
    </div>
  );
}

export default App;