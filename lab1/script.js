const m = 4294967296; 
const a = 1664525; 
const c = 1013904223; 
let seed = Date.now();

function congruentialRandom() {
    seed = (a * seed + c) % m;
    return seed / m;
}

Math.random = congruentialRandom;

function simulateEvent(probability) {
    return Math.random() < probability;
}

function simulateSimpleEvents(probability, N) {
    let trueCount = 0;
    let falseCount = 0;

    for (let i = 0; i < N; i++) {
        if (simulateEvent(probability)) {
            trueCount++;
        } else {
            falseCount++;
        }
    }

    return {
        trueCount: trueCount,
        falseCount: falseCount,
        trueFrequency: trueCount / N,
        falseFrequency: falseCount / N
    };
}

function simulateComplexEvents(probabilities) {
    return probabilities.map(probability => simulateEvent(probability));
}

function runSimpleSimulation() {
    const probability = parseFloat(document.getElementById('probability').value);
    const N = parseInt(document.getElementById('trials').value);

    if (isNaN(probability) || isNaN(N) || probability < 0 || probability > 1 || N <= 0) {
        document.getElementById('simple-result').innerHTML = "Пожалуйста, введите корректные значения для простого события.";
        return;
    }

    const result = simulateSimpleEvents(probability, N);

    document.getElementById('simple-result').innerHTML = `
        <p>Заданная вероятность события: ${probability}</p>
        <p>Частота выпадения True: ${result.trueFrequency.toFixed(5)}</p>
        <p>Частота выпадения False: ${result.falseFrequency.toFixed(5)}</p>
        <p>Количество True: ${result.trueCount}</p>
        <p>Количество False: ${result.falseCount}</p>
    `;
}

// ====================================================================

function runComplexSimulation() {
    const probabilityInput = document.getElementById('complexProbabilities').value;
    const probabilities = probabilityInput.split(',').map(p => parseFloat(p.trim()));
  
    if (probabilities.some(p => isNaN(p) || p < 0 || p > 1)) {
        document.getElementById('complex-result').innerHTML = "Пожалуйста, введите корректные вероятности (значения от 0 до 1).";
        return;
    }

    const result = simulateComplexEvents(probabilities);

    document.getElementById('complex-result').innerHTML = `
        <p>Заданные вероятности: [${probabilities.join(', ')}]</p>
        <p>${result.map((res, index) => `Событие ${index + 1}: ${res.toString()[0].toUpperCase() + res.toString().slice(1)}`).join('<br>')}</p>
    `;
}

// ====================================================================


function simulateDependentEvent(probA, probBgivenA) {
    const notA = 1 - probA; 
    const probBgivenNotA = 1 - probBgivenA; 


    const probAB = probA * probBgivenA;
    const probAnotB = probA * probBgivenNotA;
    const probNotAB = notA * probBgivenNotA;
    const probNotAnotB = notA * probBgivenA;

    
    const rand = Math.random();
    if (rand < probAB) {
        return [0, probAB, probAnotB, probNotAB, probNotAnotB];
    } else if (rand < probAB + probAnotB) {
        return [1, probAB, probAnotB, probNotAB, probNotAnotB]; 
    } else if (rand < probAB + probAnotB + probNotAB) {
        return [2, probAB, probAnotB, probNotAB, probNotAnotB];  
    } else {
        return [3, probAB, probAnotB, probNotAB, probNotAnotB]; 
    }
}

function runDependentSimulation() {
    const probabilityA = parseFloat(document.getElementById('probabilityA').value);
    const conditionalProbabilityBA = parseFloat(document.getElementById('probabilityBA').value);

    if (isNaN(probabilityA) || isNaN(conditionalProbabilityBA) || probabilityA < 0 || probabilityA > 1 || conditionalProbabilityBA < 0 || conditionalProbabilityBA > 1) {
        document.getElementById('dependent-result').innerHTML = "Пожалуйста, введите корректные значения.";
        return;
    }

    const [ind, P_AB, P_A_notB, P_notA_B, P_notA_notB] = simulateDependentEvent(probabilityA, conditionalProbabilityBA);

    const eventNames = ['AB', ' AB̅', 'ĀB', 'ĀB̅'];
    console.log(ind, eventNames)
    document.getElementById('dependent-result').innerHTML = `
        <p>Заданные вероятности: P(A) = ${probabilityA}, P(B|A) = ${conditionalProbabilityBA}</p>
        <p>Результат события: ${eventNames[ind]}</p>
        <p>Вероятность AB: ${P_AB.toFixed(4)}</p>
        <p>Вероятность AB̅: ${P_A_notB.toFixed(4)}</p>
        <p>Вероятность ĀB: ${P_notA_B.toFixed(4)}</p> 
        <p>Вероятность ĀB̅: ${P_notA_notB.toFixed(4)}</p>
    `;
  
}

// ====================================================================

function simulateFullGroupEvent(probabilities) {
    const cumulativeProbabilities = [];
    let cumulativeSum = 0;

 
    for (let prob of probabilities) {
        cumulativeSum += prob;
        cumulativeProbabilities.push(cumulativeSum);
    }
    console.log(cumulativeProbabilities)
    const random = Math.random();

   
    for (let i = 0; i < cumulativeProbabilities.length; i++) {
        if (random < cumulativeProbabilities[i]) {
            return i; 
        }
    }
}

function runFullGroupSimulation() {
    const probabilitiesInput = document.getElementById('groupProbabilities').value;
    const probabilities = probabilitiesInput.split(',').map(Number);

    const sumOfProbabilities = probabilities.reduce((a, b) => a + b, 0);
    if (probabilities.some(isNaN) || sumOfProbabilities.toFixed(5) !== "1.00000") {
        document.getElementById('group-result').innerHTML = "Пожалуйста, введите корректные вероятности, сумма которых равна 1.";
        return;
    }

    const result = simulateFullGroupEvent(probabilities);

    document.getElementById('group-result').innerHTML = `
        <p>Заданные вероятности: ${probabilities.join(', ')}</p>
        <p>Результат события: Событие с индексом ${result}</p>
    `;
}



