import pinyin from "pinyin";

// refactor this to give an indicator
// but it shouldnt actually replace the pinyin
export const applyToneSandhi = (text: string) => {
  const words = text.split("");
  const sandhiApplied = [];

  for (let i = 0; i < words.length - 1; i++) {
    const currentPinyin = pinyin(words[i], {
      style: pinyin.STYLE_TONE,
    })[0][0];

    if (
      pinyin(words[i], { style: pinyin.STYLE_TONE2 })[0][0].endsWith("3") &&
      pinyin(words[i + 1], { style: pinyin.STYLE_TONE2 })[0][0].endsWith("3")
    ) {
      // if current and next are both third tone
      // change the current third tone to a second tone
      const secondTone = pinyin(words[i], { style: pinyin.STYLE_TONE })[0][0]
        .replace("ǎ", "á")
        .replace("ě", "é")
        .replace("ǐ", "í")
        .replace("ǒ", "ó")
        .replace("ǔ", "ú");
      sandhiApplied.push(secondTone);
    } else {
      sandhiApplied.push(currentPinyin);
    }
  }

  // Add the last word which doesn't have a following word to check
  sandhiApplied.push(
    pinyin(words[words.length - 1], { style: pinyin.STYLE_TONE })[0][0]
  );

  return sandhiApplied.join("");
};
