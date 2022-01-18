export const suits = ['clubs', 'diamonds', 'hearts' ,'spades'];
export const ranks = ['6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
export const cardImages = new Map([
    ['6 clubs', '6_of_clubs.png'],
    ['6 diamonds', '6_of_diamonds.png'],
    ['6 hearts', '6_of_hearts.png'],
    ['6 spades', '6_of_spades.png']
]);

export const PLAYER = 'PLAYER'
export const BOT = 'BOT'

export const INITIAL_NUMBER_OF_POINTS = {
    '6': 0,
    '7': 30,
    '8': 20,
    '9': 10,
    '10': 0,
    'jack': 10,
    'queen': 20,
    'king': 30,
    'ace': 0
}
