import React, { ReactNode, useState } from "react";
import { TFlashCard } from "./components/flashcard/FlashCard";

export type TFlashCardSet = {
  name: string;
  id: string;
  flashCards: TFlashCard[];
};

const worker = new SharedWorker(
  new URL("./flashcard-shared-worker", import.meta.url)
);

interface IAppContext {
  flashCardSets: TFlashCardSet[] | undefined;
  setFlashCardSets: React.Dispatch<
    React.SetStateAction<TFlashCardSet[] | undefined>
  >;
  worker: SharedWorker;
}

type TAppContextProvider = {
  children: ReactNode[] | ReactNode;
};

export const AppContext = React.createContext<IAppContext>({
  flashCardSets: undefined,
  setFlashCardSets: () => undefined,
  worker,
});

export const AppContextProvider: React.FC<TAppContextProvider> = (props) => {
  const [flashCardSets, setFlashCardSets] = useState<TFlashCardSet[]>();

  const updateFlashCardSets = (newFlashCardSet: TFlashCardSet) => {
    newFlashCardSet.flashCards.forEach((flashCard) => {
      const utteranceCn = new SpeechSynthesisUtterance(
        flashCard.untranslated.text
      );
      utteranceCn.lang = "zh-CN";
      utteranceCn.voice =
        speechSynthesis
          .getVoices()
          .find((voice) => voice.lang === utteranceCn.lang) ?? null;
      flashCard.untranslated.utterance = utteranceCn;

      const utteranceEn = new SpeechSynthesisUtterance(
        flashCard.translated.text
      );
      utteranceEn.lang = "en-GB";
      utteranceEn.voice =
        speechSynthesis
          .getVoices()
          .find((voice) => voice.lang === utteranceEn.lang) ?? null;
      flashCard.translated.utterance = utteranceEn;
    });
    setFlashCardSets((prevFlashCardSets) =>
      prevFlashCardSets
        ? [...prevFlashCardSets, newFlashCardSet]
        : [newFlashCardSet]
    );
  };

  worker.port.onmessage = (message) => {
    console.log("got message in app", message);
    if ("isInit" in message.data) {
      message.data.data.forEach((message: TFlashCardSet) => {
        updateFlashCardSets(message);
      });
    } else {
      updateFlashCardSets(message.data);
    }
  };

  return (
    <AppContext.Provider value={{ flashCardSets, setFlashCardSets, worker }}>
      {props.children}
    </AppContext.Provider>
  );
};
