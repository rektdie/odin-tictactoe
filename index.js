const cells = document.querySelectorAll(".cell");

const gameBoard = (() => {
    let board = ["0", "0", "0", "0", "0", "0", "0", "0", "0"];
    
    const addMark = (index, mark) => {
        board[index] = mark;
    };

    return {board, addMark};
})();

const Player = (name, mark) => {
    return {name, mark};
}

function renderBoard() {
    for (let i = 0; i < cells.length; i++) {
        if (gameBoard.board[i] !== "0") {
            cells[i].textContent = gameBoard.board[i];
        } 
    }
}

const player1 = Player("Jóska", "X");
const player2 = Player("Pityu", "O");

let currentPlayer = player1;

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const cellList = [...cells];
        const index = cellList.indexOf(cell);

        if (gameBoard.board[index] === "0"){
            if (currentPlayer === player1){
                gameBoard.addMark(index, player1.mark);
                currentPlayer = player2;
            } else {
                gameBoard.addMark(index, player2.mark);
                currentPlayer = player1;
            }
        }

        renderBoard();
    });
});
