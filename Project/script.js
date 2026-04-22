// Cache the HTML elements we will update during the game.
const currentTurn = document.getElementById("current-turn");
const gameMessage = document.getElementById("game-message");
const choiceButtons = document.querySelectorAll(".btn-choice");
const confirmButton = document.getElementById("confirm-btn");
const countdownArea = document.getElementById("countdown-area");
const timer = document.getElementById("timer");
const resultsArea = document.getElementById("results-area");
const winnerText = document.getElementById("winner-text");
const choicesReveal = document.getElementById("choices-reveal");
const nextRoundButton = document.getElementById("next-round-btn");
const playerOneScore = document.getElementById("p1-score");
const playerTwoScore = document.getElementById("p2-score");
const historyList = document.getElementById("history-list");

// Store the game data in one place so it is easy to update later.
const gameState = {
    currentPlayer: 1,
    selectedChoice: "",
    playerOneChoice: "",
    playerTwoChoice: "",
    playerOneScore: 0,
    playerTwoScore: 0,
    roundNumber: 1,
    history: []
};

function handleChoiceSelection(event) {
    const clickedButton = event.target;
    const chosenValue = clickedButton.dataset.choice;

    choiceButtons.forEach((button) => {
        button.classList.remove("selected");
    });

    clickedButton.classList.add("selected");
    gameState.selectedChoice = chosenValue;
    confirmButton.disabled = false;
}

function resetCurrentSelection() {
    gameState.selectedChoice = "";
    confirmButton.disabled = true;

    choiceButtons.forEach((button) => {
        button.classList.remove("selected");
    });.0

    
}

function handleConfirmChoice() {
    if (gameState.selectedChoice === "") {
        return;
    }

    if (gameState.currentPlayer === 1) {
        gameState.playerOneChoice = gameState.selectedChoice;
        gameState.currentPlayer = 2;
        currentTurn.textContent = "Player 2's Turn";
        gameMessage.textContent = "Pass the device to Player 2, then choose and confirm.";
        resetCurrentSelection();
        return;
    }

    gameState.playerTwoChoice = gameState.selectedChoice;
    gameMessage.textContent = "Both choices are locked in.";
    resetCurrentSelection();
    startCountdown();
}

function startCountdown() {
    let countdownValue = 3;

    currentTurn.textContent = "Get Ready";
    gameMessage.textContent = "Revealing the result in...";
    countdownArea.style.display = "block";
    timer.textContent = countdownValue;
    confirmButton.disabled = true;

    choiceButtons.forEach((button) => {
        button.disabled = true;
    });

    const countdownInterval = setInterval(() => {
        countdownValue -= 1;
        timer.textContent = countdownValue;

        if (countdownValue === 0) {
            clearInterval(countdownInterval);
            countdownArea.style.display = "none";
            showRoundResult();
        }
    }, 1000);
}

function getWinner() {
    if (gameState.playerOneChoice === gameState.playerTwoChoice) {
        return "draw";
    }

    const playerOneWins =
        (gameState.playerOneChoice === "rock" && gameState.playerTwoChoice === "scissors") ||
        (gameState.playerOneChoice === "paper" && gameState.playerTwoChoice === "rock") ||
        (gameState.playerOneChoice === "scissors" && gameState.playerTwoChoice === "paper");

    if (playerOneWins) {
        return "player1";
    }

    return "player2";
}

function showRoundResult() {
    const winner = getWinner();

    updateScores(winner);
    addRoundToHistory(winner);
    currentTurn.textContent = "Round Result";
    resultsArea.style.display = "block";
    choicesReveal.textContent = `Player 1 chose ${gameState.playerOneChoice}. Player 2 chose ${gameState.playerTwoChoice}.`;

    if (winner === "draw") {
        winnerText.textContent = "It's a draw!";
        gameMessage.textContent = "Both players picked the same choice.";
        return;
    }

    else if (winner === "player1") {
        winnerText.textContent = "Player 1 wins this round!";
        gameMessage.textContent = "The round is over. Check the result below.";
        return;
    }

    else {
        winnerText.textContent = "Player 2 wins this round!";
        gameMessage.textContent = "The round is over. Check the result below.";
    }
}

function updateScores(winner) {
    if (winner === "player1") {
        gameState.playerOneScore += 1;
        playerOneScore.textContent = gameState.playerOneScore;
        return;
    }

    if (winner === "player2") {
        gameState.playerTwoScore += 1;
        playerTwoScore.textContent = gameState.playerTwoScore;
    }
}

function addRoundToHistory(winner) {
    let roundSummary = `Round ${gameState.roundNumber}: `;

    if (winner === "draw") {
        roundSummary += `Draw - both players chose ${gameState.playerOneChoice}`;
    } else if (winner === "player1") {
        roundSummary += `Player 1 won with ${gameState.playerOneChoice} against ${gameState.playerTwoChoice}`;
    } else {
        roundSummary += `Player 2 won with ${gameState.playerTwoChoice} against ${gameState.playerOneChoice}`;
    }

    gameState.history.push(roundSummary);

    const historyItem = document.createElement("li");
    historyItem.textContent = roundSummary;
    historyList.prepend(historyItem);
}

function resetRound() {
    gameState.currentPlayer = 1;
    gameState.playerOneChoice = "";
    gameState.playerTwoChoice = "";
    gameState.roundNumber += 1;

    resetCurrentSelection();
    resultsArea.style.display = "none";
    countdownArea.style.display = "none";
    currentTurn.textContent = "Player 1's Turn";
    gameMessage.textContent = "Select your move and press confirm!";
    winnerText.textContent = "";
    choicesReveal.textContent = "";
    timer.textContent = "3";

    choiceButtons.forEach((button) => {
        button.disabled = false;
    });
}

choiceButtons.forEach((button) => {
    button.addEventListener("click", handleChoiceSelection);
});

confirmButton.addEventListener("click", handleConfirmChoice);
nextRoundButton.addEventListener("click", resetRound);
