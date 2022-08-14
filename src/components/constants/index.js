import randomWords from "random-words";
export const SECONDS = 60;
export const COUNT_WORDS = 250;

export const generateWords = () => {
    return new Array(COUNT_WORDS).fill(null).map(() => randomWords());
  };