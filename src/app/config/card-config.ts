const signs = ["♥", "♦", "♣", "♠"];
const cards: TCard[] = [];
export type TCardWithIdx = {
  position: number[]; // [col, row]
  property: TCard;
  flipped: boolean; // true = show the number side / back side
}

const cardNumbers = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// generate 52 cards, 13 per sign, 2 colors
const generateCards = () => {
  signs.forEach((sign) => {
    for (let i = 0; i < 13; i++) {
      cards.push({
        sign: sign,
        number: cardNumbers[i],
        color: sign === "♥" || sign === "♦" ? "red" : "black",
      });
    }
});

return cards
}

const tableau: TCardWithIdx[][] = []
const sortCardsToTableau = (cards: TCard[]) => {
  for (let i = 0; i < 7; i++) {
    const deck = [];
    for (let j = 0; j < i + 1; j++) {
      const currPickedIdx = Math.floor(Math.random() * cards.length)
      // console.log('curr picked idx', currPickedIdx)

      if (cards[currPickedIdx]) {
        deck.push({
          position: [i,j], 
          property: cards[currPickedIdx],
          flipped: i === j,
        });
        // remove the picked card from the original array
        cards.splice(currPickedIdx, 1);
      }
    }

    tableau.push(deck);

  }

  console.log('fresh tableau', tableau)

  return tableau
}


export type TCard = {
  sign: string;
  number: string;
  color: string;  
}

export { generateCards, sortCardsToTableau };