export default class Card {
    constructor(suit, rank, isRevealed = false, isEmpty = false) {
        this.isReavealed = isRevealed;
        this.suit = suit;
        this.rank = rank;
        this.isEmpty = isEmpty;
    }

    getImagePath() {
        if(this.isEmpty) {
            return '/lab6.github.io/img/empty.jpg';
        }
        if(this.isReavealed) {
            return '/lab6.github.io/img/cards/' + this.rank + '_of_' + this.suit + '.png';
        } else {
            return '/lab6.github.io/img/back-side.png';
        }
    }
}
