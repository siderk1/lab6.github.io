import Card from "./Card.js";
import {PLAYER, BOT} from "./const.js";

export default class Deck {
    constructor() {
        let allCards = this.generateAllCards();

        let tableCards = allCards.splice(0, 28);
        this.cardsOnTable = []
        this.cardsOnTable.push(tableCards.splice(0, 7))
        this.cardsOnTable.push(tableCards.splice(0, 7))
        this.cardsOnTable.push(tableCards.splice(0, 7))
        this.cardsOnTable.push(tableCards.splice(0, 7))

        this.userCards = allCards.splice(0, 4);
        this.botCards = allCards.splice(0, 4);

        this.userCards = this.userCards.map(card => new Card(card.suit, card.rank, true));

        this.sixExists = 0;
        this.aceExists = 0;
    }
    generateAllCards() {
        let cards = [];

        for (const rank of ['6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace']) {
            for (const suit of ['clubs', 'spades', 'diamonds', 'hearts']) {
                cards.push(new Card(suit, rank));
            }
        }

        return cards.sort((a, b) => 0.5 - Math.random());
    }
    replaceCard(moveMadeBy, replacingCard, rowIndex) {
        let chosenRow = this.cardsOnTable[rowIndex];

        let cardToReplace = chosenRow[this.mapRankToIndex(replacingCard.rank)];
        replacingCard.isReavealed = true;

        chosenRow[this.mapRankToIndex(replacingCard.rank)] = replacingCard;

        if(moveMadeBy === PLAYER){
            this.userCards = this.userCards.filter(card => !(card.rank === replacingCard.rank && card.suit === replacingCard.suit));

            if(cardToReplace.isEmpty) {
                return;
            }

            cardToReplace.isReavealed = true;
            this.userCards.push(cardToReplace);
        } else {
            this.botCards = this.botCards.filter(card => !(card.rank === replacingCard.rank && card.suit === replacingCard.suit));

            if(cardToReplace.isEmpty) {
                return;
            }

            cardToReplace.isReavealed = false;
            this.botCards.push(cardToReplace);
        }
    }
    suitSsReavealed(suit) {
        for (let i = 0; i < 4; i++) {
            if(this.getRowSuit(i) === suit) {
                return true;
            }
        }

        return false;
    }
    getRowSuit(rowIndex) {
        let chosenRow = this.cardsOnTable[rowIndex];

        for (const card of chosenRow) {
            if(card.isReavealed && !card.isEmpty){
                return card.suit;
            }
        }

        return null;
    }
    mapRankToIndex(rank) {
        if(rank === '6'){
            return 0
        }

        let ranks = ['7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];

        if(ranks.indexOf(rank) === -1) {
            console.log(`Something wrong, we are trying to get index for rank: ${rank}`)
        }

        return ranks.indexOf(rank) + this.sixExists;
    }
    appendSix(moveMadeBy, rowIndex, chosenCard) {
        this.sixExists = 1;
        chosenCard.isReavealed = true;

        if(!(this.cardsOnTable[rowIndex][0].isEmpty && !this.cardsOnTable[rowIndex][0].isReavealed)) {
            this.cardsOnTable[rowIndex].splice(0, 0, chosenCard)
        } else {
            this.cardsOnTable[rowIndex][0] = chosenCard
        }

        if(moveMadeBy === PLAYER) {
            this.userCards = this.userCards.filter(card => !(card.rank === chosenCard.rank && card.suit === chosenCard.suit));
        } else if (moveMadeBy === BOT) {
            this.botCards = this.botCards.filter(card => !(card.rank === chosenCard.rank && card.suit === chosenCard.suit));
        }

        for (let i = 0; i < 4; i++) {
            let chosenRow = this.cardsOnTable[i];
            if((chosenRow[0].rank !== '6' || (chosenRow[0].rank === '6' && !chosenRow[0].isReavealed)) && !chosenRow[0].isEmpty) {
                this.cardsOnTable[i].splice(0, 0, new Card('', '', false, true))
            }
        }
    }
    appendAce(moveMadeBy, rowIndex, chosenCard) {
        this.aceExists = 1;
        chosenCard.isReavealed = true;

        if(!(this.cardsOnTable[rowIndex][this.cardsOnTable[rowIndex].length - 1].isEmpty && !this.cardsOnTable[rowIndex][this.cardsOnTable[rowIndex].length - 1].isReavealed)) {
            this.cardsOnTable[rowIndex].push(chosenCard)
        } else {
            this.cardsOnTable[rowIndex][this.cardsOnTable[rowIndex].length - 1] = chosenCard
        }

        if(moveMadeBy === PLAYER) {
            this.userCards = this.userCards.filter(card => !(card.rank === chosenCard.rank && card.suit === chosenCard.suit));
        } else if (moveMadeBy === BOT) {
            this.botCards = this.botCards.filter(card => !(card.rank === chosenCard.rank && card.suit === chosenCard.suit));
        }

        for (let i = 0; i < 4; i++) {
            let chosenRow = this.cardsOnTable[i];
            if((chosenRow[chosenRow.length - 1].rank !== 'ace' || (chosenRow[chosenRow.length - 1].rank === 'ace' && !chosenRow[chosenRow.length - 1].isReavealed)) && !chosenRow[chosenRow.length - 1].isEmpty) {
                this.cardsOnTable[i].push(new Card('', '', false, true));
            }
        }
    }

    getChosenCardFromTable(moveMadeBy, rowIndex, cardIndex) {
        let chosenRow = this.cardsOnTable[rowIndex];
        let chosenCard = chosenRow[cardIndex];

        if(chosenCard.isReavealed || chosenCard.isEmpty) {
            alert('Cant get this card!');
            return;
        }

        this.cardsOnTable[rowIndex][cardIndex] = new Card('', '', true, true);

        if(moveMadeBy === PLAYER){
            chosenCard.isReavealed = true;
            this.userCards.push(chosenCard);
        } else {
            chosenCard.isReavealed = false;
            this.botCards.push(chosenCard);
        }
    }
}