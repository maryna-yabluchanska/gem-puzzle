import {Puzzle} from './components/puzzle.js';

(() => {
    function init() {
        renderPuzzle()
        addGame();

    }

    function renderPuzzle() {
        const element = document.body;
        let html = `
           <div id="puzzle-game">
            <div class="puzzles-container"></div>
        </div>
        `
        ;
        element.insertAdjacentHTML("beforeend", html);

    }

    function addGame() {
        const game = new Puzzle();
        const puzzleContainer = document.querySelector('.puzzles-container');
        puzzleContainer.appendChild(game.element);
    }

    init();
})();
