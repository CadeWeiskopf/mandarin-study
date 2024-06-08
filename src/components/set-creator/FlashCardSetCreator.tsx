import pinyin from "pinyin";
import { useState, useRef } from "react";
import { TFlashCard } from "../flashcard/FlashCard";
import styles from "./FlashCardSetCreator.module.css";

type TFlashCardSetCreator = {
  flashCards: TFlashCard[];
  setFlashCards: React.Dispatch<React.SetStateAction<TFlashCard[]>>;
};
export const FlashCardSetCreator: React.FC<TFlashCardSetCreator> = ({
  flashCards,
  setFlashCards,
}) => {
  const [hanzi, setHanzi] = useState("");
  const pinyinText: (string | null)[] = [];
  const translationRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("+======", pinyinText);

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
          pinyin: pinyinText.join(""),
          utterance: utteranceCn,
        },
        translated: {
          lang: utteranceEn.lang as "en-GB",
          text: translationRef.current!.value,
          utterance: utteranceEn,
        },
      },
    ]);
  };

  return (
    <div>
      <h2>build a set</h2>
      <h3>total {flashCards.length}</h3>
      <form onSubmit={handleSubmit}>
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
              console.log(hanziChar, "=>", hanziCharPinYinOptions);
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
    </div>
  );
};
