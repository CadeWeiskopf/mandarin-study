import { useContext, useState } from "react";
import { FlashCard, TFlashCard } from "./FlashCard";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context";

type TFlashCardDeck = {};
export const FlashCardDeck: React.FC<TFlashCardDeck> = () => {
  const [currentFlashCard, setCurrentFlashCard] = useState<TFlashCard>();
  const [currentFlashCardIndex, setCurrentFlashCardIndex] = useState(-1);
  const { flashCardSets } = useContext(AppContext);
  const { setId } = useParams();
  if (!setId) {
    return <>set not found</>;
  }
  const flashCardSet = flashCardSets?.find(
    (flashCardSet) => flashCardSet.id === setId
  );
  if (!flashCardSet) {
    return <>set not found</>;
  }

  const { flashCards } = flashCardSet;
  return (
    <>
      <p>deck</p>
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
    </>
  );
};
