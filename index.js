const cells = document.querySelectorAll(".cell");
let gameStarted = false;

// Board object
const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
    
    const addMark = (index, mark) => {
        board[index] = mark;
    };

    // Rendering the board
    const render = () => {
        for (let i = 0; i < cells.length; i++) {
            if (gameBoard.board[i] !== "") {
                cells[i].textContent = gameBoard.board[i];
            }
        }

        // Checking for winner
        const turns = board.filter(mark => {
            return mark != "";
        }).length;

        if (turns >= 5 && turns !== 9){
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
        } else if (turns === 9) return null;
    };

    return {board, addMark, render};
})();

const Player = (name, mark) => {
    return {name, mark};
}

const player1 = Player("Jóska", "X");
const player2 = Player("Pityu", "O");

let currentPlayer = player1;


// Cell clicking functionality
cells.forEach(cell => {
    cell.addEventListener("click", () => {
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

        console.log(gameBoard.render());
    });
});
