// Global variables
let playerName = '';
let currentBalance = 0;
let chosenAmount = 0;
let gameInProgress = false;
let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
const maxAttempts = 5;

// Function to handle name setting
document.getElementById('set-name-button').addEventListener('click', function(event) {
    event.preventDefault();
    const inputName = document.getElementById('player-name').value.trim();
    if (inputName) {
        playerName = inputName;
        document.getElementById('input-name-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'none'; // Hide login form after setting name
    } else {
        alert('Please enter your name to start the game.');
    }
});

// Function to handle money addition form submission
document.getElementById('add-money-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const amountToAdd = parseInt(document.getElementById('add-money-input').value);
    if (!isNaN(amountToAdd) && amountToAdd > 0) {
        currentBalance += amountToAdd;
        updateBalanceDisplay();
    }
    document.getElementById('add-money-input').value = ''; // Clear input field after adding money
});

// Function to update balance display
function updateBalanceDisplay() {
    document.getElementById('current-balance').textContent = formatAmount(currentBalance);
}

// Function to format amount for display
function formatAmount(amount) {
    if (amount >= 1000000) {
        return (amount / 1000000) + 'M';
    } else {
        return amount / 1000 + 'k';
    }
}

// Function to handle amount selection
function handleAmountSelection(event) {
    if (!playerName) {
        alert('Please enter your name to start the game.');
        return;
    }
    
    if (gameInProgress || chosenAmount !== 0) {
        return; // Exit if game is already in progress or amount is already chosen
    }

    const selectedAmount = parseInt(event.target.dataset.amount);
    if (currentBalance >= selectedAmount) {
        chosenAmount = selectedAmount;
        currentBalance -= selectedAmount;
        document.getElementById('profitAmount').textContent = formatAmount(selectedAmount);
        updateBalanceDisplay();
        gameInProgress = true; // Set game in progress
        document.getElementById('guess').disabled = false;
        document.getElementById('guess-button').disabled = false;
    } else {
        alert("Not enough balance. Please add more money.");
    }
}

// Function to handle user's guess
document.getElementById('guess-button').addEventListener('click', function() {
    if (!playerName) {
        alert('Please enter your name to start the game.');
        return;
    }

    if (!gameInProgress || chosenAmount === 0) {
        alert('Please choose an amount to start the game.');
        return;
    }

    const guess = Number(document.getElementById('guess').value);
    attempts++;
    let message = '';

    if (guess === secretNumber) {
        const winnings = chosenAmount * 4; // User wins four times the amount played with
        currentBalance += winnings;
        message = `Congratulations, ${playerName}! You guessed the number in ${attempts} attempts and won ${formatAmount(winnings)}!`;
        saveWinner(playerName);
        updateBalanceDisplay();
        setTimeout(resetGame, 3000);  // Reset the game after 3 seconds
    } else if (attempts >= maxAttempts) {
        message = `Sorry, ${playerName}. You've used all ${maxAttempts} attempts. The number was ${secretNumber}.`;
        setTimeout(resetGame, 3000);  // Reset the game after 3 seconds
    } else if (guess < secretNumber) {
        message = 'Too low. Try again!';
    } else if (guess > secretNumber) {
        message = 'Too high. Try again!';
    }

    document.getElementById('message').textContent = message;
    document.getElementById('attempts').textContent = `Attempts: ${attempts}`;
});

// Function to reset game state
function resetGame() {
    chosenAmount = 0; // Reset chosen amount for the next game
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    document.getElementById('guess').value = '';
    document.getElementById('message').textContent = '';
    document.getElementById('attempts').textContent = '';
    document.getElementById('guess').disabled = true;
    document.getElementById('guess-button').disabled = true;
    gameInProgress = false; // Reset game in progress flag
}

// Function to save winner's name
function saveWinner(name) {
    const winnersList = document.getElementById('winners-list');
    const listItem = document.createElement('li');
    listItem.textContent = name;
    winnersList.appendChild(listItem);
    localStorage.setItem('winners', winnersList.innerHTML);
}

// Function to load winners from local storage
function loadWinners() {
    const winnersList = document.getElementById('winners-list');
    winnersList.innerHTML = localStorage.getItem('winners') || '';
}

// Function to clear winners list if 30 days have passed
function clearWinnersList() {
    const lastResetTimestamp = localStorage.getItem('lastResetTimestamp');
    const currentTime = new Date().getTime();
    const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

    if (!lastResetTimestamp || (currentTime - lastResetTimestamp > thirtyDaysInMillis)) {
        localStorage.removeItem('winners');
        localStorage.setItem('lastResetTimestamp', currentTime);
        winnersList.innerHTML = ''; // Clear winners list on UI
    }
}

// Add event listeners after DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Disable guess input and button initially
    document.getElementById('guess').disabled = true;
    document.getElementById('guess-button').disabled = true;

    // Add event listeners for amount selection buttons
    document.querySelectorAll('.amount-button').forEach(button => {
        button.addEventListener('click', handleAmountSelection);
    });

    // Initialize balance display
    updateBalanceDisplay();

    // Load winners on page load
    loadWinners();

    // Clear winners list if 30 days have passed
    clearWinnersList();
});
