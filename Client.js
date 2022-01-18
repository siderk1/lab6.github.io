import Deck from "./Deck.js";
import {BOT, PLAYER, INITIAL_NUMBER_OF_POINTS} from "./const.js";

export default class GameClient {
    constructor() {
        this.root = document.getElementById('root');
        this.botCardsArea = document.getElementById('bot_cards');
        this.playerCardsArea = document.getElementById('player_cards');

        this.deck = new Deck();

        this.isFirstMove = true;

        this.currentPlayerMove = PLAYER;

        this.botMemory = this.deck.generateAllCards();
        for (const card of this.deck.botCards) {
            this.AIRemoveCardFromBotMemory(card)
        }
    }

    gameLoop() {
        this.renderBoard();
        this.renderBotCards();
        this.renderPlayerCards();

        if(this.deck.userCards.length === 0) {
            alert('You have won!!!');
        }

        if(this.deck.botCards.length === 0) {
            alert('Bot has won!!!');
        }

        if(this.currentPlayerMove === BOT) {
            this.AIMakesMove();
            this.currentPlayerMove = PLAYER;

            console.log('Bot cards now:')
            console.log(this.deck.botCards)

            this.gameLoop();
        }
    }

    renderBoard() {
        this.root.innerHTML = '';

        const deckContainer = document.createElement("div");
        deckContainer.classList.add('deck');
        this.root.appendChild(deckContainer);

        for (let i = 0; i < this.deck.cardsOnTable.length; i++) {
            let deckRow = document.createElement("div");
            deckRow.classList.add('deck__row');
            deckContainer.appendChild(deckRow);

            let row = this.deck.cardsOnTable[i];
            for (let j = 0; j < row.length; j++) {
                let card = row[j];

                let deckCard = document.createElement("div");
                deckCard.classList.add('deck__card');

                let cardImage = document.createElement("img");
                cardImage.classList.add("deck__img");
                cardImage.src = card.getImagePath();
                deckCard.appendChild(cardImage);

                deckCard.onclick = () => {
                    this.deck.getChosenCardFromTable(PLAYER, i, j);
                    this.isFirstMove = false;
                    this.currentPlayerMove = BOT;
                    this.gameLoop();
                }

                deckRow.appendChild(deckCard);
            }
        }
    }
    renderBotCards() {
        this.botCardsArea.innerHTML = '';

        for (const card of this.deck.botCards) {
            let deckCard = document.createElement("div");
            deckCard.classList.add('bot__card');

            let cardImage = document.createElement("img");
            cardImage.classList.add("card");
            cardImage.src = '/img/back-side.png'
            deckCard.appendChild(cardImage);

            this.botCardsArea.appendChild(deckCard);
        }
    }
    renderPlayerCards() {
        this.playerCardsArea.innerHTML = '';

        for (const card of this.deck.userCards) {
            let deckCard = document.createElement("div");
            deckCard.classList.add('bot__card');

            let cardImage = document.createElement("img");
            cardImage.classList.add("card");
            cardImage.src = card.getImagePath();
            deckCard.appendChild(cardImage);

            deckCard.onclick = () => {
                let rowIndex = Number(prompt('Enter row index: '));

                if(rowIndex < 0 || rowIndex > 3) {
                    alert('Invalid row index, enter index between 0 and 3');
                    return;
                }

                console.log(`Making move with: ${card.rank} ${card.suit}`)

                if(this.canMakeThisMove(card.suit, card.rank, rowIndex)){
                    console.log(`Move of ${card.rank} ${card.suit} is possible`)
                    this.isFirstMove = false;

                    if(card.rank === '6') {
                        this.deck.appendSix(PLAYER, rowIndex, card)
                    } else if (card.rank === 'ace') {
                        this.deck.appendAce(PLAYER, rowIndex, card)
                    } else {
                        this.deck.replaceCard(PLAYER, card, rowIndex);
                    }

                    this.currentPlayerMove = BOT;
                    this.AIRemoveCardFromBotMemory(card);

                    console.log(`Bot memory now:`)
                    console.log(this.botMemory)

                    this.gameLoop();
                } else {
                    alert(`You can't make this move!`)
                }
            }

            this.playerCardsArea.appendChild(deckCard);
        }
    }
    canMakeThisMove(suit, rank, rowIndex) {
        if(this.currentPlayerMove === PLAYER) {
            console.log(`Checking the possibility of move ${rank} | ${suit}`)
        }

        if(rowIndex < 0 || rowIndex > 3) {
            console.log('invalid row index')
            return false;
        }

        if(!((this.deck.getRowSuit(rowIndex) === null && !this.deck.suitSsReavealed(suit)) || this.deck.getRowSuit(rowIndex) === suit)) {
            console.log('invalid row')
            return false;
        }

        if(this.isFirstMove){
            console.log('here')
            return (rank !== 'ace' && rank !== '6');
        }

        let currentRow = this.deck.cardsOnTable[rowIndex];

        if(rank !== 'ace' && rank !== '6') {
            if(this.deck.getRowSuit(rowIndex) !== suit && this.deck.getRowSuit(rowIndex) !== null){
                return false;
            }

            let destinationIndex = this.deck.mapRankToIndex(rank);
            if(this.currentPlayerMove === PLAYER) {
                console.log(`Checking possibility of making move of ${rank} | ${suit}, destination index: ${destinationIndex}`)
            }

            if(currentRow[destinationIndex].isReavealed && currentRow[destinationIndex].isEmpty) {
                return true;
            }
            if(destinationIndex > 0 && this.deck.cardsOnTable[rowIndex][destinationIndex - 1].isReavealed) {
                return true;
            }
            if(destinationIndex > 0 && rowIndex > 0 && this.deck.cardsOnTable[rowIndex - 1][destinationIndex - 1].isReavealed) {
                return true;
            }
            if(destinationIndex > 0 && rowIndex < 3 && this.deck.cardsOnTable[rowIndex + 1][destinationIndex - 1].isReavealed) {
                return true;
            }
            if(rowIndex > 0 && this.deck.cardsOnTable[rowIndex - 1][destinationIndex].isReavealed) {
                return true;
            }
            if(rowIndex < 3 && this.deck.cardsOnTable[rowIndex + 1][destinationIndex].isReavealed) {
                return true;
            }
            if(destinationIndex < currentRow.length - 1 && this.deck.cardsOnTable[rowIndex][destinationIndex + 1].isReavealed) {
                return true;
            }
            if(destinationIndex < currentRow.length - 1 && rowIndex > 0 && this.deck.cardsOnTable[rowIndex - 1][destinationIndex + 1].isReavealed) {
                return true;
            }
            if(destinationIndex < currentRow.length - 1 && rowIndex < 3 && this.deck.cardsOnTable[rowIndex + 1][destinationIndex + 1].isReavealed) {
                return true;
            }

            if(this.currentPlayerMove === PLAYER) {
                console.log(`Move of ${rank} | ${suit}, destination index: ${destinationIndex} IS NOT POSSIBLE`);
            }

            return false;
        } else {
            console.log('here')

            if(rank === '6') {
                if(this.currentPlayerMove === PLAYER) {
                    console.log(`Trying to move 6`)
                }

                if(currentRow[this.deck.mapRankToIndex('7')].isReavealed) {
                    return true;
                }
                if(rowIndex > 0 && this.deck.cardsOnTable[rowIndex - 1][this.deck.mapRankToIndex('7')].isReavealed) {
                    return true;
                }
                if(rowIndex < this.deck.cardsOnTable.length - 1 && this.deck.cardsOnTable[rowIndex + 1][this.deck.mapRankToIndex('7')].isReavealed) {
                    return true;
                }
                if(currentRow[0].isReavealed) {
                    return true;
                }
                if(rowIndex > 0 && this.deck.cardsOnTable[rowIndex - 1][0].isReavealed) {
                    return true;
                }
                if(rowIndex < this.deck.cardsOnTable.length - 1 && this.deck.cardsOnTable[rowIndex + 1][0].isReavealed) {
                    return true;
                }
            }

            if(rank === 'ace') {
                console.log('here')
                if(this.currentPlayerMove === PLAYER) {
                    console.log('Trying to move ace')
                }

                if(currentRow[currentRow.length - 1].isReavealed || currentRow[currentRow.length - 1].isEmpty) {
                    return true;
                }
                if(rowIndex > 0 && this.deck.cardsOnTable[rowIndex - 1][this.deck.cardsOnTable[rowIndex - 1].length - 1].isReavealed) {
                    return true;
                }
                if(rowIndex < this.deck.cardsOnTable.length - 1 && this.deck.cardsOnTable[rowIndex + 1][this.deck.cardsOnTable[rowIndex + 1].length - 1].isReavealed) {
                    return true;
                }

                if(this.deck.aceExists === 1) {
                    if(currentRow[currentRow.length - 2].isReavealed) {
                        return true;
                    }
                    if(rowIndex > 0 && this.deck.cardsOnTable[rowIndex - 1][this.deck.cardsOnTable[rowIndex - 1].length - 2].isReavealed) {
                        return true;
                    }
                    if(rowIndex < this.deck.cardsOnTable.length - 1 && this.deck.cardsOnTable[rowIndex + 1][this.deck.cardsOnTable[rowIndex + 1].length - 2].isReavealed) {
                        return true;
                    }
                }
            }

            return false;
        }
    }

    ///////////////// FUNCTIONS FOR BOT
    AIMakesMove() {
        let allPossibleMoves = this.AIGetAllPossibleMoves();

        console.log(`All possible moves:`);
        console.log(allPossibleMoves);

        if(allPossibleMoves.length === 0) {
            console.log('AI decide which card to take');
            let cardPos = this.AIDecideWhichCardToTake();
            this.AIRemoveCardFromBotMemory(this.deck.cardsOnTable[cardPos[0]][cardPos[1]])

            this.deck.getChosenCardFromTable(BOT, cardPos[0], cardPos[1]);
        } else {
            let moveValues = allPossibleMoves.map(move => this.AIValueTheMove(move));
            let bestMove = allPossibleMoves[moveValues.indexOf(Math.max(...moveValues))]

            console.log(`Found best move:`);
            console.log(bestMove);

            if(bestMove.card.rank === '6') {
                this.deck.appendSix(BOT, bestMove.rowIndex, bestMove.card);
            } else if (bestMove.card.rank === 'ace') {
                this.deck.appendAce(BOT, bestMove.rowIndex, bestMove.card);
            } else {
                this.deck.replaceCard(BOT, bestMove.card, bestMove.rowIndex);
            }
        }
    }
    AIGetAllPossibleMoves() {
        let possibleMoves = [];
        for (const card of this.deck.botCards) {
            for (let i = 0; i < 4; i++) {
                if(this.canMakeThisMove(card.suit, card.rank, i)) {
                    possibleMoves.push({card: card, rowIndex: i});
                }
            }
        }

        return possibleMoves;
    }
    AIValueTheMove(move) {
        let movePoints = INITIAL_NUMBER_OF_POINTS[move.card.rank];

        if(this.AICanPlaceCardOnEmptySpot(move.card, move.rowIndex)) {
            movePoints += 100;
        }

        if(move.card.rank === '6' || move.card.rank === 'ace') {
            movePoints += 100;
        }

        movePoints += this.AICountMoveNeighborsPoints(move);

        return movePoints;
    }
    AICanPlaceCardOnEmptySpot(card, rowIndex) {
        if(card.rank === 'ace' || card.rank === '6') {
            return true;
        }

        let destinationSpot = this.deck.cardsOnTable[rowIndex][this.deck.mapRankToIndex(card.rank)];
        return destinationSpot.isEmpty && destinationSpot.isReavealed;
    }
    AICountMoveNeighborsPoints(move) {
        // move = {rowIndex: ряд в который мы хотим положить, card: карта которую мы хотим положить}
        let botPoints = 0, playerPoints = 0;
        let rowIndex = move.rowIndex;
        let cardIndex = this.deck.mapRankToIndex(move.card.rank);

        for (const card of this.deck.botCards) {
            botPoints += this.AICountPointsOfNeighbors(card, rowIndex, cardIndex);
        }
        // bot memory - evaluates how our move is efficient for the opponent
        for (const card of this.botMemory) {
            let probabilityOfCardInUser = this.deck.userCards.length / this.botMemory.length;
            playerPoints += probabilityOfCardInUser * this.AICountPointsOfNeighbors(card, rowIndex, cardIndex);
        }

        if(this.deck.userCards.length === 1) {  // uncalm state
            playerPoints *= 10;  // trying not to maximize our points, but minimize player's points
        }

        return botPoints - playerPoints;
    }
    AIDecideWhichCardToTake() {
        console.log('Bot deciding which card to take');

        let possibleCardsToTake = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < this.deck.cardsOnTable[i].length; j++) {
                let card = this.deck.cardsOnTable[i][j];
                if(!card.isReavealed && !card.isEmpty) {
                    possibleCardsToTake.push([i, j]);
                }
            }
        }

        let moveValues = possibleCardsToTake.map(cardPos => this.AIValueCardToTake(cardPos));
        let bestMove = possibleCardsToTake[moveValues.indexOf(Math.max(...moveValues))];

        console.log(`Decide to take card from pos: ${bestMove}`)
        return bestMove
    }
    AIValueCardToTake(cardPos) {
        let lengthOfRow = this.deck.cardsOnTable[0].length;

        // evaluates how far from center the card is, the closer to the edge, the better
        let botPoints = 10 * Math.abs(cardPos[0] - Math.floor(lengthOfRow / 2));
        let playerPoints = 10 * Math.abs(cardPos[0] - Math.floor(lengthOfRow / 2));
        let rowIndex = cardPos[0], cardIndex = cardPos[1];

        for (const card of this.deck.botCards) {
            if((this.deck.getRowSuit(rowIndex) === null && !this.deck.suitSsReavealed(card.suit)) || this.deck.getRowSuit(rowIndex) === card.suit) {
                // if we have card to place at the taken spot
                if (this.deck.mapRankToIndex(card.rank) === cardIndex) {
                    botPoints += 80;
                }
            }

            botPoints += this.AICountPointsOfNeighbors(card, rowIndex, cardIndex);
        }

        let probabilityfOfCardInUser = this.deck.userCards.length / this.botMemory.length;
        for (const card of this.botMemory) {
            if((this.deck.getRowSuit(rowIndex) === null && !this.deck.suitSsReavealed(card.suit)) || this.deck.getRowSuit(rowIndex) === card.suit) {
                if (this.deck.mapRankToIndex(card.rank) === cardIndex) {
                    playerPoints += probabilityfOfCardInUser * 80;
                }
            }

            playerPoints += probabilityfOfCardInUser * this.AICountPointsOfNeighbors(card, rowIndex, cardIndex);
        }

        if(this.deck.userCards.length === 1) {
            playerPoints *= 10;
        }

        return botPoints - playerPoints;
    }
    AICountPointsOfNeighbors(neighborCard, cardRowIndex, cardIndex) {
        let points = 0;

        // first if checks whether it is possible to move this card to this row
        if((this.deck.getRowSuit(cardRowIndex) === null && !this.deck.suitSsReavealed(neighborCard.suit)) || this.deck.getRowSuit(cardRowIndex) === neighborCard.suit) {
            if (this.deck.mapRankToIndex(neighborCard.rank) === cardIndex + 1 || this.deck.mapRankToIndex(neighborCard.rank) === cardRowIndex - 1) {
                if(neighborCard.rank === '6' || neighborCard.rank === 'ace') {
                    points += 50;
                } else {
                    points += 15;
                }
            }
        }
        // moves that reveal 6 and aces are the most expensive
        if(cardRowIndex > 0) {
            if((this.deck.getRowSuit(cardRowIndex - 1) === null && !this.deck.suitSsReavealed(neighborCard.suit)) || this.deck.getRowSuit(cardRowIndex - 1) === neighborCard.suit) {
                if(this.deck.mapRankToIndex(neighborCard.rank) === cardIndex || this.deck.mapRankToIndex(neighborCard.rank) === cardIndex + 1 || this.deck.mapRankToIndex(neighborCard.rank) === cardIndex - 1) {
                    if(neighborCard.rank === '6' || neighborCard.rank === 'ace') {
                        points += 50;
                    } else {
                        points += 15;
                    }
                }
            }
        }

        if(cardRowIndex < 3) {
            if((this.deck.getRowSuit(cardRowIndex + 1) === null && !this.deck.suitSsReavealed(neighborCard.suit)) || this.deck.getRowSuit(cardRowIndex + 1) === neighborCard.suit) {
                if(this.deck.mapRankToIndex(neighborCard.rank) === cardIndex || this.deck.mapRankToIndex(neighborCard.rank) === cardIndex + 1 || this.deck.mapRankToIndex(neighborCard.rank) === cardIndex - 1) {
                    if(neighborCard.rank === '6' || neighborCard.rank === 'ace') {
                        points += 50;
                    } else {
                        points += 15;
                    }
                }
            }
        }

        return points;
    }

    AIRemoveCardFromBotMemory(card) {
        if(this.botMemory.find(c => c.suit === card.suit && c.rank === card.rank)) {
            this.botMemory = this.botMemory.filter(c => !(c.suit === card.suit && c.rank === card.rank))
        }
    }
}