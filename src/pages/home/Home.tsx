import { useContext } from "react";
import { FlashCardSetCreator } from "../../components/set-creator/FlashCardSetCreator";
import { Link } from "react-router-dom";
import { AppContext } from "../../context";

export const Home: React.FC = () => {
  const { flashCardSets } = useContext(AppContext);
  console.log("home", flashCardSets);
  return (
    <>
      <FlashCardSetCreator />
      <hr />
      <div>
        {flashCardSets?.map((flashCardSet) => (
          <Link
            key={`flashcardset-${flashCardSet.id}`}
            to={`/set/${flashCardSet.id}`}
          >
            flashcard set with {flashCardSet.name} total
          </Link>
        ))}
      </div>
    </>
  );
};
