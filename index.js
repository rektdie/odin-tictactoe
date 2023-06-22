const cells = document.querySelectorAll(".cell");
const startButton = document.querySelector("#start");
const dialog = document.querySelector("dialog");
const enemySection = document.querySelector(".enemy");
const humanType = document.querySelector(".human")
const botType = document.querySelector(".bot")

const restartButton = document.createElement("button");
restartButton.setAttribute("id", "restart");
restartButton.textContent = "Restart";

let gameStarted = false;
let typeSelected = null;
let player1, player2, currentPlayer;

// Board object
const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const reset = () => {
        gameBoard.board = ["", "", "", "", "", "", "", "", ""];
    };
    
    const addMark = (index, mark) => {
        gameBoard.board[index] = mark;
    };

    let emptyIndexes = [];

    // Checking for winner
    function CheckWinner(board){
        const turns = board.filter(mark => {
            return mark !== "";
        }).length;

        gameBoard.emptyIndexes = [];
        let clonedBoard = [...board];
        for (element of clonedBoard){
            if (element === ""){
                const index = clonedBoard.indexOf(element);
                gameBoard.emptyIndexes.push(index);
                clonedBoard[index] = "checked";
            }
        }

        if (turns >= 5){
            const winningCombinations = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                [0, 4, 8], [2, 4, 6] // Diagonals
            ];

            for(const combination of winningCombinations){
                const [a, b, c] = combination;
                
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    if (currentPlayer === player1) {
                        return player2;
                    } else {
                        return player1;
                    }
                }
            }

            if (turns === 9) return null;
        }
    }

    // Rendering the board
    const render = () => {
        for (let i = 0; i < cells.length; i++) {
            if (gameBoard.board[i] !== "") {
                const current = cells[i];
                current.textContent = gameBoard.board[i];

                if (current.textContent === "X"){
                    current.style.color = "#F5D547";
                } else if (current.textContent === "O"){
                    current.style.color = "#DB3069";
                }
            } else {
                cells[i].textContent = "";
            }
        }
    };

    return {board, addMark, render, reset, emptyIndexes, CheckWinner};
})();

const Player = (name, mark) => {
    return {name, mark};
}

// Cell clicking functionality
cells.forEach(cell => {
    cell.addEventListener("click", () => {
        if (gameStarted) {
            const cellList = [...cells];
            const index = cellList.indexOf(cell);

            if (gameBoard.board[index] === ""){
                if (currentPlayer === player1){
                    gameBoard.addMark(index, player1.mark);
                    currentPlayer = player2;
                    
                    const winning = gameBoard.CheckWinner(gameBoard.board)
                    if (winning === undefined) {
                        if (typeSelected === "bot") {
                            gameBoard.CheckWinner(gameBoard.board);
                            const randomIndex = gameBoard.emptyIndexes[Math.floor(Math.random() * gameBoard.emptyIndexes.length)];
                            gameBoard.addMark(randomIndex, player2.mark);
                            currentPlayer = player1;
                        }
                    }
                } else {
                    gameBoard.addMark(index, player2.mark);
                    currentPlayer = player1;
                }
            }

            gameBoard.render();
            // Announcing the winner
            const winner = gameBoard.CheckWinner(gameBoard.board);
            const result = document.createElement("h1");

            dialog.innerHTML = "";

            if (winner !== undefined) {
                gameStarted = false;

                if (winner !== null) {
                    result.textContent = `${winner.name} won the game!`;
                } else {
                    result.textContent = "It's a draw!";
                }

                dialog.appendChild(result);
                dialog.append(restartButton);
                dialog.setAttribute("open", "");
            }
        }
    });
});

// Selecting human enemy type
humanType.addEventListener("click", () => {
    const textInput = document.createElement("input");

    textInput.setAttribute("type", "text");
    textInput.setAttribute("id", "player2-name");

    enemySection.removeChild(botType);
    enemySection.appendChild(textInput);
    botType.classList.remove("selected");
    humanType.classList.add("selected");
    humanType.classList.remove("clickable");

    typeSelected = "human";
});

// Selecting bot enemy type
botType.addEventListener("click", () => {
    humanType.classList.remove("selected");
    botType.classList.add("selected");
    botType.classList.remove("clickable");
    typeSelected = "bot";
});

// Starting the game
startButton.addEventListener("click", () => {
    if (!gameStarted){
        const input1 = document.querySelector("#player1-name");
        player1 = Player(input1.value, "X");
        
        if (typeSelected === "human") {
            const input2 = document.querySelector("#player2-name");
            player2 = Player(input2.value, "O");
        } else if (typeSelected === "bot"){
            player2 = Player("AI", "O");
        } else {
            return;
        }

        if (player1.name !== "" && player2.name !== ""){
            currentPlayer = player1;
            gameStarted = true;
            startButton.textContent = "Started";
            startButton.style.color = "#49A078";
        }
    }
});

// Clear everything
restartButton.addEventListener("click", () => {
    dialog.removeAttribute("open");
    gameBoard.reset();
    document.querySelector("#player1-name").value = "";

    if (typeSelected === "human") document.querySelector("#player2-name").remove();

    player1, player2 = null;
    typeSelected = null;
    currentPlayer = undefined;
    humanType.classList.add("clickable");
    botType.classList.add("clickable");
    humanType.classList.remove("selected");
    botType.classList.remove("selected");
    enemySection.appendChild(botType);
    startButton.textContent = "Start";
    startButton.style.color = "#E8C547";

    gameBoard.render();
});
