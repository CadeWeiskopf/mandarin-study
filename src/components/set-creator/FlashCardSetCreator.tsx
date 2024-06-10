import pinyin from "pinyin";
import { useState, useRef, useContext } from "react";
import { TFlashCard } from "../flashcard/FlashCard";
import styles from "./FlashCardSetCreator.module.css";
import { AppContext, TFlashCardSet } from "../../context";

export const FlashCardSetCreator: React.FC = () => {
  const [hanzi, setHanzi] = useState("");
  const [flashCards, setFlashCards] = useState<TFlashCard[]>([]);
  const pinyinText: (string | null)[] = [];
  const translationRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const { worker } = useContext(AppContext);

  const handleNewFlashCardSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setFlashCards((prevFlashCards) => [
      ...prevFlashCards,
      {
        untranslated: {
          lang: "zh-CN",
          text: hanzi,
          pinyin: pinyinText.join(""),
          utterance: null,
        },
        translated: {
          lang: "en-GB",
          text: translationRef.current!.value,
          utterance: null,
        },
      },
    ]);
  };

  const handleCreateNewSet = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (flashCards.length <= 0) {
      alert("please create at least one flashcard for the set");
      return;
    }
    const newSet: TFlashCardSet = {
      id: crypto.randomUUID(),
      name: nameRef.current!.value.trim(),
      flashCards,
    };
    worker.port.postMessage(newSet);
  };

  return (
    <div>
      <h2>build a new set</h2>
      <h3>total {flashCards.length}</h3>
      <form onSubmit={handleNewFlashCardSubmit}>
        <div>
          <label htmlFor="hanzi">汉字：</label>
          <textarea
            id="hanzi"
            onInput={(event: React.FormEvent<HTMLTextAreaElement>) => {
              setHanzi(event.currentTarget.value);
            }}
          />
        </div>
        <div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {Array.from(hanzi).map((hanziChar, i) => {
              const hanziCellKey = `hanzipinyincell${i}`;
              const hanziCharPinYinOptions = pinyin(hanziChar, {
                heteronym: true,
              });
              if (hanziCharPinYinOptions.length > 1) {
                throw Error("char options longer than 1..");
              }
              if (hanziCharPinYinOptions[0].length <= 1) {
                pinyinText[i] = hanziCharPinYinOptions[0][0];
              } else {
                pinyinText[i] = null;
              }
              return (
                <div
                  key={hanziCellKey}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignContent: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",
                      fontSize: "xx-large",
                    }}
                  >
                    {hanzi[i]}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "0.25em",
                      fontSize: "x-large",
                    }}
                  >
                    {hanziCharPinYinOptions[0].length <= 1
                      ? hanziCharPinYinOptions[0]
                      : hanziCharPinYinOptions[0].map((option, j) => {
                          const pinyinOptionKey = `pinyinoption${i}-${j}`;
                          return (
                            <div
                              key={pinyinOptionKey}
                              className={styles.radioInput}
                            >
                              <input
                                type="radio"
                                required
                                id={pinyinOptionKey}
                                name={hanziCellKey}
                                value={option}
                                onInput={() => {
                                  pinyinText[i] = option;
                                }}
                              />
                              <label htmlFor={pinyinOptionKey}>{option}</label>
                            </div>
                          );
                        })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <label htmlFor="translation">Translation：</label>
          <textarea
            id="translation"
            required
            ref={translationRef}
          />
        </div>
        <div>
          <button>add to set</button>
        </div>
      </form>
      <form onSubmit={handleCreateNewSet}>
        <div>
          <label htmlFor="newsetname">Name of Set</label>
          <input
            id="newsetname"
            required
            ref={nameRef}
          />
        </div>
        <button>Create new set</button>
      </form>
    </div>
  );
};
