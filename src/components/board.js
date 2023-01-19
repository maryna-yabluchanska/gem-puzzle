import {PuzzlePiece} from './puzzlePiece.js';

export class Board {
    constructor({boardSize, tileSize, onGameWin}) {
        this.boardSize = boardSize;
        this.tileSize = tileSize;
        this.onGameWin = onGameWin;
        this.audioEnabled = true;
        this.tileMargin = 0;
        this.tiles = [];
        this.tileOrder = [];
        this.boardContainer = document.createElement('div');
        this.boardContainer.className = 'board-container';
        this.audio = new Audio('http://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3');

        this.setTileMargin();
        this.initBoard();
    }

    initBoard() {
        const numTiles = Math.pow(this.boardSize, 2);
        this.tiles = [];
        this.tileOrder = Array(numTiles).fill(0).map((el, idx) => idx);

        do {
            this.shuffleArray(this.tileOrder);
        } while (!this.isSolvable() || this.hasWon());

        let curRow = 1;
        let curCol = 1;
        for (let i = 0; i < numTiles; i++) {
            if (this.tileOrder[i] !== 0) {
                const tile = new PuzzlePiece({
                    number: this.tileOrder[i],
                    size: this.tileSize,
                    margin: this.tileMargin,
                    row: curRow,
                    col: curCol,
                    onClickHandler: (number) => this.onTileClick(number)
                });
                this.tiles.push(tile);
                this.boardContainer.appendChild(tile.element);
            }

            if (curCol < this.boardSize) {
                curCol++;
            } else {
                curCol = 1;
                curRow++;
            }
        }

        this.setBoardSizes();
    }

    shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    onTileClick(number) {
        const tileIdx = this.tileOrder.findIndex(el => el === number);
        const blankSpaceIdx = this.tileOrder.findIndex(el => el === 0);
        const dir = this.getTileMoveDirection(tileIdx, blankSpaceIdx);
        if (dir) {
            this.changeStepCount()
            const tile = this.tiles.find(tile => tile.number === number);
            tile.slide(dir);
            this.tileOrder[tileIdx] = 0;
            this.tileOrder[blankSpaceIdx] = number;

            if (this.audioEnabled) {
                this.audio.play();
            }

            if (this.hasWon()) {
                this.onGameWin();
            }
        }
    }

    disableAudio() {
        this.audioEnabled = false;
    }

    enabledAudio() {
        this.audioEnabled = true;
    }

    changeStepCount() {
        const stepsChange = new Event('stepMade');
        document.dispatchEvent(stepsChange)
    }

    isSolvable() {
        const blankSpaceIdx = this.tileOrder.findIndex(el => el === 0);
        const blankSpaceRow = Math.floor(blankSpaceIdx / this.boardSize);

        let inversions = 0;
        for (let i = 0; i < this.tileOrder.length; i++) {
            for (let j = i + 1; j < this.tileOrder.length; j++) {
                if (this.tileOrder[i] > this.tileOrder[j] && this.tileOrder[j] !== 0) {
                    inversions++;
                }
            }
        }

        if (this.boardSize % 2 === 0) {
            if (blankSpaceRow % 2 !== 0) {
                return inversions % 2 === 0;
            } else {
                return inversions % 2 !== 0;
            }
        } else {
            return inversions % 2 === 0;
        }
    }

    getTileMoveDirection(tileIdx, blankSpaceIdx) {
        const tileRow = Math.floor(tileIdx / this.boardSize);
        const blankSpaceRow = Math.floor(blankSpaceIdx / this.boardSize);

        if (tileRow === blankSpaceRow) {
            if (tileIdx === blankSpaceIdx - 1) {
                return 'right';
            } else if (tileIdx === blankSpaceIdx + 1) {
                return 'left';
            }
        } else if (Math.abs(tileRow - blankSpaceRow) === 1) {
            if (tileIdx === blankSpaceIdx - this.boardSize) {
                return 'down';
            } else if (tileIdx === blankSpaceIdx + this.boardSize) {
                return 'up';
            }
        }
        return '';
    }

    hasWon() {
        return this.tileOrder.every((number, i) => {
            return number === i + 1 || i === this.tiles.length
        });
    }

    setBoardSize(size) {
        this.boardSize = size;
        this.shuffleBoard()
    }

    shuffleBoard() {
        this.boardContainer.innerHTML = '';
        this.initBoard();
    }

    setBoardSizes() {
        this.boardContainer.style.height = `${this.boardSize * (this.tileSize + this.tileMargin)}px`;
        this.boardContainer.style.width = `${this.boardSize * (this.tileSize + this.tileMargin)}px`;
    }

    setTileMargin() {
        this.tileMargin = this.tileSize * 0.1;
    }

    get element() {
        return this.boardContainer;
    }
}
