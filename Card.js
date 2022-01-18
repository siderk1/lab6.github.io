export default class Card {
    constructor(suit, rank, isRevealed = false, isEmpty = false) {
        this.isReavealed = isRevealed;
        this.suit = suit;
        this.rank = rank;
        this.isEmpty = isEmpty;
    }

    getImagePath() {
        if(this.isEmpty) {
            return '/img/empty.jpg';
        }
        if(this.isReavealed) {
            return '/img/cards/' + this.rank + '_of_' + this.suit + '.png';
        } else {
            return '/img/back-side.png';
        }
    }
}