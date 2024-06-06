import { useEffect, useRef, useState } from "react";
import "./App.css";
import pinyin from "pinyin";

type TFlashCard = {
  untranslated: {
    lang: "zh-CN";
    text: string;
    pinyin: string;
    utterance: SpeechSynthesisUtterance;
  };
  translated: {
    lang: "en-GB";
    text: string;
    utterance: SpeechSynthesisUtterance;
  };
};

const FlashCard: React.FC<TFlashCard> = ({ untranslated, translated }) => {
  const [isTranslated, setIsTranslated] = useState(false);
  const current = isTranslated ? translated : untranslated;
  return (
    <div
      style={{
        border: "1px solid",
        textAlign: "center",
        maxWidth: "500px",
        width: "100%",
      }}
    >
      <button
        onClick={() => {
          window.speechSynthesis.speak(current.utterance);
        }}
      >
        Hear
      </button>
      <div style={{ fontSize: "xxx-large" }}>{current.text}</div>
      {"pinyin" in current && (
        <div style={{ fontSize: "xx-large" }}>{current.pinyin}</div>
      )}
      <button
        onClick={() => {
          setIsTranslated((isTranslated) => !isTranslated);
        }}
      >
        Flip
      </button>
    </div>
  );
};

type TFlashCardSetCreator = {
  flashCards: TFlashCard[];
  setFlashCards: React.Dispatch<React.SetStateAction<TFlashCard[]>>;
};
const FlashCardSetCreator: React.FC<TFlashCardSetCreator> = ({
  flashCards,
  setFlashCards,
}) => {
  const [hanziToSet, setHanziToSet] = useState<string[]>([]);
  const [hanzi, setHanzi] = useState("");
  const hanziToPinyin = pinyin(hanzi, { heteronym: true });
  const translationRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <h2>build a set</h2>
      <h3>total {flashCards.length}</h3>
      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          console.log(hanziToSet);
          const utteranceCn = new SpeechSynthesisUtterance(hanzi);
          utteranceCn.lang = "zh-CN";
          const utteranceEn = new SpeechSynthesisUtterance(
            translationRef.current!.value
          );
          utteranceEn.lang = "en-GB";

          setFlashCards((prevFlashCards) => [
            ...prevFlashCards,
            {
              untranslated: {
                lang: utteranceCn.lang as "zh-CN",
                text: hanzi,
                pinyin: hanziToPinyin
                  .map((hanziPinyinOptions, i) => {
                    if (hanziPinyinOptions.length <= 1) {
                      return hanziPinyinOptions[0];
                    }
                    return hanziToSet[i];
                  })
                  .join(""),
                utterance: utteranceCn,
              },
              translated: {
                lang: utteranceEn.lang as "en-GB",
                text: translationRef.current!.value,
                utterance: utteranceEn,
              },
            },
          ]);
        }}
      >
        <div>
          <label htmlFor="hanzi">汉字：</label>
          <input
            id="hanzi"
            onInput={(event: React.FormEvent<HTMLInputElement>) => {
              setHanzi(event.currentTarget.value);
            }}
          />
        </div>
        <div>
          <label>Pinyin: </label>
          {JSON.stringify(hanziToPinyin)}
          <div style={{ display: "flex" }}>
            {hanziToPinyin.map((charPinyinOptions, i) => {
              const hanziCellKey = `hanzipinyincell${i}`;
              return (
                <div
                  style={{ display: "flex", flexDirection: "column" }}
                  key={hanziCellKey}
                >
                  {charPinyinOptions.length <= 1
                    ? charPinyinOptions
                    : charPinyinOptions.map((option, j) => {
                        const pinyinOptionKey = `pinyinoption${i}-${j}`;
                        return (
                          <div key={pinyinOptionKey}>
                            <input
                              type="radio"
                              id={pinyinOptionKey}
                              name={hanziCellKey}
                              value={option}
                              onInput={(
                                event: React.FormEvent<HTMLInputElement>
                              ) => {
                                setHanziToSet((prevHanziToSet) => {
                                  prevHanziToSet[i] = option;
                                  return [...prevHanziToSet];
                                });
                              }}
                            />
                            <label htmlFor={pinyinOptionKey}>{option}</label>
                          </div>
                        );
                      })}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <label htmlFor="translation">Translation：</label>
          <input
            id="translation"
            ref={translationRef}
          />
        </div>
        <div>
          <button>add to set</button>
        </div>
      </form>
    </div>
  );
};

function App() {
  const [flashCards, setFlashCards] = useState<TFlashCard[]>([]);
  const [currentFlashCard, setCurrentFlashCard] = useState<TFlashCard>();
  const [currentFlashCardIndex, setCurrentFlashCardIndex] = useState(-1);
  // const currentFlashCard = flashCards[0];
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
              setCurrentFlashCardIndex(
                currentFlashCardIndex > 0
                  ? currentFlashCardIndex - 1
                  : currentFlashCardIndex
              );
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
