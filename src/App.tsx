import { useState } from "react";
import "./App.css";
import { FlashCardSetCreator } from "./components/set-creator/FlashCardSetCreator";
import { FlashCard, TFlashCard } from "./components/flashcard/FlashCard";

function App() {
  const [flashCards, setFlashCards] = useState<TFlashCard[]>([]);
  const [currentFlashCard, setCurrentFlashCard] = useState<TFlashCard>();
  const [currentFlashCardIndex, setCurrentFlashCardIndex] = useState(-1);
  return (
    <div className="App">
      <FlashCardSetCreator
        flashCards={flashCards}
        setFlashCards={setFlashCards}
      />
      <br />
      {flashCards.length > 0 && (
        <>
          {currentFlashCard && <FlashCard {...currentFlashCard} />}
          <button
            onClick={() => {
              const newCurrentIndex =
                currentFlashCardIndex > 0
                  ? currentFlashCardIndex - 1
                  : currentFlashCardIndex;
              setCurrentFlashCard(flashCards[newCurrentIndex]);
              setCurrentFlashCardIndex(newCurrentIndex);
              console.log(currentFlashCardIndex);
            }}
          >
            back
          </button>
          <button
            onClick={() => {
              const newCurrentIndex =
                currentFlashCardIndex < flashCards.length - 1
                  ? currentFlashCardIndex + 1
                  : currentFlashCardIndex;
              setCurrentFlashCard(flashCards[newCurrentIndex]);
              setCurrentFlashCardIndex(newCurrentIndex);
            }}
          >
            next
          </button>
        </>
      )}
    </div>
  );
}

export default App;
