const btn = document.querySelector("#start-btn");

btn.addEventListener("click", function () {
	updatePlayerColors();
	myGame.startGame();
});

class Game {
	constructor(a, b) {
		this.height = a;
		this.width = b;
		this.showWinAlert = true;
		this.gameOver = false;
		this.gameResult = null;
		this.playerColors = null;
	}

	makeBoard() {
		for (let y = 0; y < this.height; y++) {
			this.board.push(Array.from({ length: this.width }));
		}
	}
	makeHtmlBoard() {
		const board = document.getElementById("board");

		const top = document.createElement("tr");
		top.setAttribute("id", "column-top");
		top.addEventListener(
			"click",
			this.handleClick.bind(this)
		);

		for (let x = 0; x < this.width; x++) {
			const headCell = document.createElement("td");
			headCell.setAttribute("id", x);
			top.append(headCell);
		}

		board.append(top);

		for (let y = 0; y < this.height; y++) {
			const row = document.createElement("tr");

			for (let x = 0; x < this.width; x++) {
				const cell = document.createElement("td");
				cell.setAttribute("id", `${y}-${x}`);
				row.append(cell);
			}

			board.append(row);
		}
	}

	findSpotForCol(x) {
		for (let y = this.height - 1; y >= 0; y--) {
			if (!this.board[y][x]) {
				return y;
			}
		}
		return null;
	}

	placeInTable(y, x) {
		const piece = document.createElement("div");
		piece.classList.add("piece");
		piece.classList.add(`p${this.currPlayer}`);

		if (this.playerColors) {
			piece.style.backgroundColor =
				this.currPlayer === 1
					? this.playerColors.player1
					: this.playerColors.player2;
		}
		piece.style.top = -50 * (y + 2);

		const spot = document.getElementById(`${y}-${x}`);
		spot.append(piece);
	}

	endGame(msg) {
		this.gameOver = true;

		if (this.showWinAlert) {
			alert(msg);
			this.showWinAlert = false;
		}
	}

	checkForWin() {
		function _win(cells) {
			return cells.every(
				([y, x]) =>
					y >= 0 &&
					y < this.height &&
					x >= 0 &&
					x < this.width &&
					this.board[y][x] === this.currPlayer
			);
		}

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const horiz = [
					[y, x],
					[y, x + 1],
					[y, x + 2],
					[y, x + 3],
				];
				const vert = [
					[y, x],
					[y + 1, x],
					[y + 2, x],
					[y + 3, x],
				];
				const diagDR = [
					[y, x],
					[y + 1, x + 1],
					[y + 2, x + 2],
					[y + 3, x + 3],
				];
				const diagDL = [
					[y, x],
					[y + 1, x - 1],
					[y + 2, x - 2],
					[y + 3, x - 3],
				];

				if (
					_win.call(this, horiz) ||
					_win.call(this, vert) ||
					_win.call(this, diagDR) ||
					_win.call(this, diagDL)
				) {
					return true;
				}
			}
		}
		return false;
	}

	startGame() {
		this.gameOver = false;
		this.gameResult = null;
		this.showWinAlert = true;

		const boardElement = document.getElementById("board");
		boardElement.innerHTML = "";

		this.board = [];
		this.makeBoard();
		this.makeHtmlBoard();
		this.currPlayer = 1;
	}

	updatePlayerColors(playerColors) {
		this.playerColors = playerColors;
	}

	handleClick(evt) {
		if (this.gameOver && !this.gameResult) {
			return;
		}

		const x = +evt.target.id;

		const y = this.findSpotForCol(x);
		if (y === null) {
			return;
		}

		this.board[y][x] = this.currPlayer;
		this.placeInTable(y, x);

		if (this.checkForWin()) {
			return this.endGame(`Player ${this.currPlayer} won!`);
		}

		if (
			this.board.every((row) => row.every((cell) => cell))
		) {
			return this.endGame("Tie!");
		}

		this.currPlayer = this.currPlayer === 1 ? 2 : 1;
	}
}

const myGame = new Game(6, 7);

class Player {
	constructor(color1, color2) {
		this.player1 = color1;
		this.player2 = color2;
	}
}

function updatePlayerColors() {
	const player1Color =
		document.getElementById("player1Color");
	const player2Color =
		document.getElementById("player2Color");

	const playerColors = new Player(
		player1Color.value,
		player2Color.value
	);
	myGame.updatePlayerColors(playerColors);
}
