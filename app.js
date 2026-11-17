let digitCount = 4;
let attemptsLeft = 10;
let gameOver = false;

const settings = document.getElementById("settings");
const gameArea = document.getElementById("gameArea");
const startButton = document.getElementById("startButton");
const guessButton = document.getElementById("guessButton");
const restartButton = document.getElementById("restartButton");
const guessInput = document.getElementById("guessInput");
const message = document.getElementById("message");
const history = document.getElementById("history");
const attemptsDisplay = document.getElementById("attemptsLeft");

// C kodunu çalıştıran WebAssembly hazır mı?
let wasmReady = false;

var Module = {
    onRuntimeInitialized: function () {
        wasmReady = true;
        startButton.disabled = false;
        startButton.textContent = "Start Game";
        console.log("WebAssembly loaded successfully!");
    }
};

startButton.disabled = true;
startButton.textContent = "Loading...";

// Yeni oyun başlat
function startGame() {
    if (!wasmReady) return;

    digitCount = Number(document.getElementById("digitCount").value);

    const success = Module.ccall(
        "game_start",
        "number",
        ["number"],
        [digitCount]
    );

    if (success !== 1) {
        alert("Game could not start.");
        return;
    }

    attemptsLeft = 10;
    gameOver = false;

    history.innerHTML = "";
    attemptsDisplay.textContent = attemptsLeft;
    message.textContent = "Good luck!";
    guessInput.value = "";
    guessInput.maxLength = digitCount;

    settings.hidden = true;
    gameArea.hidden = false;

    guessInput.focus();
}

// Tahmini kontrol et
function submitGuess() {
    if (gameOver || !wasmReady) return;

    const guessText = guessInput.value.trim();

    if (!/^[0-9]+$/.test(guessText) ||
        guessText.length !== digitCount ||
        guessText[0] === "0") {
        message.textContent = `Enter a valid ${digitCount}-digit number.`;
        return;
    }

    const guess = Number(guessText);

    // Tahmini C fonksiyonuna gönder
    const plus = Module.ccall(
        "game_submit_guess",
        "number",
        ["number"],
        [guess]
    );

    if (plus === -1) {
        message.textContent = "Invalid number!";
        return;
    }

    // Eksi sayısını C kodundan al
    const minus = Module.ccall(
        "game_get_minus",
        "number",
        [],
        []
    );

    attemptsLeft--;
    attemptsDisplay.textContent = attemptsLeft;

    const item = document.createElement("div");
    item.className = "history-item";

    const numberSpan = document.createElement("span");
    numberSpan.textContent = guessText;

    const resultSpan = document.createElement("span");
    resultSpan.className = "result";
    resultSpan.textContent = "+".repeat(plus) + "-".repeat(minus);

    item.appendChild(numberSpan);
    item.appendChild(resultSpan);
    history.appendChild(item);

    guessInput.value = "";

    if (plus === digitCount) {
        message.textContent = "Congratulations! You won!";
        gameOver = true;
    } else if (attemptsLeft === 0) {
        const answer = Module.ccall(
            "game_get_answer",
            "number",
            [],
            []
        );

        message.textContent = `Game over! The number was ${answer}.`;
        gameOver = true;
    } else {
        message.textContent = "Try again!";
    }

    if (gameOver) {
        guessInput.disabled = true;
        guessButton.disabled = true;
    }
}

// Butonlar
startButton.addEventListener("click", function () {
    guessInput.disabled = false;
    guessButton.disabled = false;
    startGame();
});

guessButton.addEventListener("click", submitGuess);

guessInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        submitGuess();
    }
});

restartButton.addEventListener("click", function () {
    guessInput.disabled = false;
    guessButton.disabled = false;
    startGame();
});