export const generateRandomBit = (): number => {
  return Math.round(Math.random());
}

export const generateRandomMessageArray = (messageBitCount: number = 1, length: number): string[] => {
  const msgArr = [];
  for(let i = 0; i < length; i++) {
    let current = "";
    for(let j = 0; j < messageBitCount; j++) {
      current += generateRandomBit().toString();
    }
    msgArr.push(current);
  }

  return msgArr;
};
