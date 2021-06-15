export const shuffle = (arr: any[]) => {
  let currentIndex = arr.length;

  while(0 !== currentIndex) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex], arr[currentIndex]];
  }

  return arr;
};

export const getPermutation = (n: number) => {
  const perm = [];

  for(let i = 0; i < n; i++) {
    perm.push(i);
  }

  return shuffle(perm);
};

export const getPermutationInverse = (perm: number[]) => {
  const inverse: number[] = new Array(perm.length);
  for(let i = 0; i < perm.length; i++) {
    inverse[perm[i]] = i;
  }

  return inverse;
};

