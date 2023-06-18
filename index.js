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
let player1, player2;

// Board object
const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const reset = () => {
        gameBoard.board = ["", "", "", "", "", "", "", "", ""];
    };
    
    const addMark = (index, mark) => {
        gameBoard.board[index] = mark;
    };

    // Rendering the board
    const render = () => {
        for (let i = 0; i < cells.length; i++) {
            if (gameBoard.board[i] !== "") {
                cells[i].textContent = gameBoard.board[i];
            } else {
                cells[i].textContent = "";
            }
        }

        // Checking for winner
        const turns = gameBoard.board.filter(mark => {
            return mark != "";
        }).length;

        if (turns >= 5){
            const winningCombinations = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                [0, 4, 8], [2, 4, 6] // Diagonals
            ];

            for(const combination of winningCombinations){
                const [a, b, c] = combination;
                
                if (gameBoard.board[a] && gameBoard.board[a] === gameBoard.board[b] && gameBoard.board[a] === gameBoard.board[c]) {
                    if (currentPlayer === player1) {
                        return player2;
                    } else {
                        return player1;
                    }
                }
            }

            if (turns === 9) return null;
        }
    };

    return {board, addMark, render, reset};
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
                } else {
                    gameBoard.addMark(index, player2.mark);
                    currentPlayer = player1;
                }
            }

            // Announcing the winner
            const winner = gameBoard.render();
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
    if (!typeSelected) {
        const textInput = document.createElement("input");
    
        textInput.setAttribute("type", "text");
        textInput.setAttribute("id", "player2-name");

        enemySection.removeChild(botType);
        enemySection.appendChild(textInput);
        humanType.classList.remove("clickable");

        typeSelected = "human";
    }
});

// Selecting bot enemy type
botType.addEventListener("click", () => {
    if (!typeSelected){
        botType.style.border = "1px solid #E8C547";
        botType.classList.remove("clickable");
        typeSelected = "bot";
    }
});

// Starting the game
startButton.addEventListener("click", () => {
    if (!gameStarted){
        const input1 = document.querySelector("#player1-name");
        player1 = Player(input1.value, "X");
        
        if (typeSelected === "human") {
            const input2 = document.querySelector("#player2-name");
            player2 = Player(input2.value, "O");
        } else {
            player2 = Player("AI", "O");
        }
    
        currentPlayer = player1;
        gameStarted = true;
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
    humanType.classList.add("clickable");
    enemySection.appendChild(botType);

    gameBoard.render();
});
