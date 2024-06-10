import { useState } from "react";

export type TFlashCard = {
  untranslated: {
    lang: "zh-CN";
    text: string;
    pinyin: string;
    utterance: SpeechSynthesisUtterance | null;
  };
  translated: {
    lang: "en-GB";
    text: string;
    utterance: SpeechSynthesisUtterance | null;
  };
};

export const FlashCard: React.FC<TFlashCard> = ({
  untranslated,
  translated,
}) => {
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
          if (current.utterance) {
            window.speechSynthesis.speak(current.utterance);
          }
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
