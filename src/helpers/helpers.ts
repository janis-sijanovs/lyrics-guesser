export const randomNumber = (from: number, to: number) =>
  Math.floor(Math.random() * (to - from)) + from;

export const getRandom = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

export const getLines = <T>(array: T[], lineCount: number): T[] => {
  const length = array.length;

  if (length <= lineCount) {
    return array;
  }

  const newArray = array.splice(
    Math.floor(Math.random() * (length - lineCount)),
    lineCount
  );

  return newArray;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const delay = (miliseconds: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2);
    }, miliseconds);
  });
};
