const cards = [
    { name: 'bulldog', symbol: '🐶' },
    { name: 'book', symbol: '📚' },
    { name: 'graduation', symbol: '🎓' },
    { name: 'hockey', symbol: '🏒' },
    { name: 'science', symbol: '🔬' },
    { name: 'trophy', symbol: '🏆' }
];


let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let pairs = 0;
let gameTimer;
let startTime;


function createBoard() {
    const gameBoard = document.getElementById('gameBoard');
    const cardPairs = [...cards, ...cards];
    shuffleArray(cardPairs);


    cardPairs.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = card.name;
        cardElement.innerHTML = `
            <div class="card-face card-front">UMD</div>
            <div class="card-face card-back">${card.symbol}</div>
        `;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}


function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;


    this.classList.add('flipped');


    if (!hasFlippedCard) {
        // First click
        hasFlippedCard = true;
        firstCard = this;
        if (!startTime) startTimer();
        return;
    }


    // Second click
    secondCard = this;
    checkForMatch();
}


function checkForMatch() {
    moves++;
    document.getElementById('moves').textContent = moves;


    const isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}


function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    pairs++;
    document.getElementById('pairs').textContent = pairs;


    if (pairs === cards.length) {
        setTimeout(showWinMessage, 500);
    }


    resetBoard();
}


function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}


function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


function startTimer() {
    startTime = Date.now();
    gameTimer = setInterval(updateTimer, 1000);
}


function updateTimer() {
    const currentTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    document.getElementById('time').textContent =
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}


function showWinMessage() {
    clearInterval(gameTimer);
    const winMessage = document.getElementById('winMessage');
    document.getElementById('finalTime').textContent = document.getElementById('time').textContent;
    document.getElementById('finalMoves').textContent = moves;
    winMessage.classList.add('show');
}


function resetGame() {
    const gameBoard = document.getElementById('gameBoard');
    const winMessage = document.getElementById('winMessage');
    gameBoard.innerHTML = '';
    winMessage.classList.remove('show');
    moves = 0;
    pairs = 0;
    startTime = null;
    clearInterval(gameTimer);
    document.getElementById('moves').textContent = '0';
    document.getElementById('pairs').textContent = '0';
    document.getElementById('time').textContent = '0:00';
    createBoard();
}
