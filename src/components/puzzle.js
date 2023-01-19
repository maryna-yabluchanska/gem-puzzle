import {Board} from './board.js';
import {SettingsHolders} from './settingsHolder.js';

export class Puzzle {
    constructor() {
        this.puzzleContainer = document.createElement('div');
        this.puzzleContainer.className = 'puzzle-container';

        const defaultBoardSize = 4;
        const defaultPuzzlePieceSize = 100;
        const smallPuzzlePieceSize = 50;

        this.timeInSeconds = 0;
        this.timeInMin = new Date(0).toISOString().slice(14, 19);
        this.steps = 0;
        this.currentFrameSize = defaultBoardSize;

        const x = window.matchMedia("(max-width: 700px)");

        if (x.matches) {
            this.board = new Board({
                tileSize: smallPuzzlePieceSize,
                boardSize: defaultBoardSize,
                onGameWin: () => this.onGameWin()
            });
        } else {
            this.board = new Board({
                tileSize: defaultPuzzlePieceSize,
                boardSize: defaultBoardSize,
                onGameWin: () => this.onGameWin()
            });
        }


        this.createStepsLabel();
        this.createTimeLabel();

        this.puzzleContainer.appendChild(this.board.element);


        this.createFrameSizeLabel();
        this.addInputFieldSize('Other sizes:', (value) => this.onBoardSizeChange(value));
        let shuffleButton = this.createShuffleButton(() => this.shuffleBoard());
        this.puzzleContainer.appendChild(shuffleButton)

        document.addEventListener("stepMade", () => {
            ++this.steps;
            this.renderStepsLabel()
        })

        this.timeCounter()
        this.createToggleSound();
    }


    addInputFieldSize(label, onInputChange) {
        const inputSize = new SettingsHolders(label, (value) => onInputChange(value));
        this.puzzleContainer.appendChild(inputSize.holder);
    }

    timeCounter() {
        setInterval(() => {
            ++this.timeInSeconds
            this.renderTimeLabel()
        }, 1000);
    }

    createStepsLabel() {
        const labelEl = document.createElement('label');
        labelEl.id = 'steps-label';
        labelEl.textContent = `Moves: ${this.steps}`;
        this.puzzleContainer.appendChild(labelEl);
    }

    createTimeLabel() {
        const labelEl = document.createElement('label');
        labelEl.id = 'time-label';
        labelEl.textContent = `     Time: ${this.timeInMin}`
        this.puzzleContainer.appendChild(labelEl);
    }

    createToggleSound() {
        let wrapper = document.createElement("div")
        wrapper.className = "sound-container";
        const soundLabel = document.createElement('label');
        soundLabel.textContent = "Sound off";
        soundLabel.setAttribute("for", "sound");
        const toggle = document.createElement('input');
        toggle.id = "sound"
        toggle.type = 'checkbox';
        toggle.addEventListener('click', (event) => {
            this.board.enabledAudio();
            if (toggle.checked) {
                this.board.disableAudio();
            }
        });


        this.puzzleContainer.appendChild(wrapper);
        wrapper.appendChild(soundLabel);
        wrapper.appendChild(toggle);

    }

    createFrameSizeLabel() {
        const labelEl = document.createElement('label');
        labelEl.id = 'frameSize-label';
        labelEl.textContent = `Frame size: ${this.currentFrameSize}x${this.currentFrameSize}`;
        this.puzzleContainer.appendChild(labelEl);
    }

    addWinMessage(winText) {
        this.winMessageEl = document.createElement('div');
        this.winMessageEl.id = 'winner-message';
        this.winMessageEl.innerHTML = `<p>${winText} You solved the puzzle in ${this.timeInMin} and ${this.steps} moves!!!</p>`;
        this.puzzleContainer.appendChild(this.winMessageEl);
    }

    removeWinMessage() {
        let winnerMessage = document.getElementById('winner-message');
        if (winnerMessage) {
            this.puzzleContainer.removeChild(winnerMessage)
        }
    }

    renderStepsLabel() {
        document.getElementById('steps-label').textContent = `Moves: ${this.steps}`
    }

    renderTimeLabel() {
        this.timeInMin = new Date(this.timeInSeconds * 1000).toISOString().slice(14, 19);
        document.getElementById('time-label').textContent = `     Time: ${this.timeInMin}`
    }

    renderFrameSizeLabel(size) {
        document.getElementById('frameSize-label').textContent = `Frame size: ${size}x${size}`
    }

    onBoardSizeChange(value) {
        this.clearTime()
        this.clearSteps()
        this.renderFrameSizeLabel(value)
        this.board.setBoardSize(value);
    }

    shuffleBoard() {
        this.clearTime()
        this.clearSteps()
        this.board.shuffleBoard();
        this.startOver()
    }

    clearTime() {
        this.timeInSeconds = 0
        this.renderTimeLabel()
    }

    createShuffleButton(shuffleFunc) {
        const button = document.createElement('input');
        button.type = 'button';
        button.value = "Shuffle and start";
        button.addEventListener('click', shuffleFunc);
        return button;
    }

    clearSteps() {
        this.steps = 0
        this.renderStepsLabel()
    }

    onGameWin() {
        this.addWinMessage('Hooray!');
        this.puzzleContainer.classList.add('won');
    }

    startOver() {
        this.removeWinMessage()
        this.puzzleContainer.classList.remove('won');
    }

    get element() {
        return this.puzzleContainer;
    }

}
