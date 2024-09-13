const m = 4294967296; 
const a = 1664525; 
const c = 1013904223; 
let seed = Date.now();

function congruentialRandom() {
    seed = (a * seed + c) % m;
    return seed / m;
}

Math.random = congruentialRandom;

const games = {};

function addDonation(gameName, amount) {
    if (games.hasOwnProperty(gameName)) {
        games[gameName] += amount;
    } else {
        games[gameName] = amount;
    }
}

function getGameProbabilities() {
    const totalAmount = Object.values(games).reduce((sum, amount) => sum + amount, 0);
    
    if (totalAmount === 0) {
        console.log("Нет пожертвований для расчета вероятностей.");
        return;
    }
    
    const probabilities = {};
    for (const [game, amount] of Object.entries(games)) {
        probabilities[game] = (amount / totalAmount).toFixed(2);
    }
    
    return probabilities;
}

function selectGame() {
    const probabilities = getGameProbabilities();
    if (!probabilities) return;

    const gamesList = Object.keys(probabilities);
    const cumulativeProbabilities = [];
    let cumulativeSum = 0;

    for (const game of gamesList) {
        cumulativeSum += parseFloat(probabilities[game]);
        cumulativeProbabilities.push(cumulativeSum);
    }
    const random = Math.random();
    for (let i = 0; i < cumulativeProbabilities.length; i++) {
        if (random < cumulativeProbabilities[i]) {
            return gamesList[i];
        }
    }
}

addDonation('Witcher 3', 250);
addDonation('Cyberpunk 2077', 300);
addDonation('Elden Ring', 450);
addDonation('Witcher 3', 250);

console.log('Вероятности для игр:');
console.log(getGameProbabilities());

console.log('Выбранная игра:');
console.log(selectGame());
