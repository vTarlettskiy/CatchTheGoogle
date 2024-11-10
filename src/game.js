import {GameStatuses} from "./GAME_STATUSES.js";
import {SamuraiNumberUtility} from "./samurai-number-utility.js";
import {Position} from "./Position.js";

export class Game {
    #settings = {
        gridSize: {
            columnsCount: 4,
            rowsCount: 4
        },
        googleJumpInterval: 1000,
        googleWinPoints: 5
    }
    #status = GameStatuses.PENDING

    #googlePosition = null
    #player1Position = null
    #player2Position = null

    #googlePoints = 0
    #player1Points = 0
    #player2Points = 0
    /**
     * @type SamuraiNumberUtility // JSDoc
     */
    #numberUtility;

    constructor() {
        this.#numberUtility = new SamuraiNumberUtility()

    }

    set googleJumpInterval(value) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error('Google jump interval must be a positive integer')
        }
        this.#settings.googleJumpInterval = value
    }

    get status() {
        return this.#status
    }

    get player1Position() {
        return this.#player1Position
    }

    get player2Position() {
        return this.#player2Position
    }

    get googlePosition() {
        return this.#googlePosition
    }

    get gridSize() {
        return this.#settings.gridSize
    }

    start() {
        this.#status = GameStatuses.IN_PROGRESS
        this.#player1StartPosition()
        this.#player2StartPosition()
        this.#jumpGoogle()
        this.#googleEscaped()

    }

    #googleEscaped() {
        const intervalId = setInterval(() => {

            if (this.#status === GameStatuses.IN_PROGRESS) {
                do {
                    this.#jumpGoogle();
                    this.#googlePoints++;

                    if (this.#googlePoints >= this.#settings.googleWinPoints) {
                        this.#status = GameStatuses.LOSE
                        break
                    }
                } while (this.#googlePoints < this.#settings.googleWinPoints)
            }

        }, this.#settings.googleJumpInterval)

        if(this.#status === GameStatuses.LOSE) {
            clearInterval(intervalId)
        }
    }

    #jumpGoogle() {
        const newPosition = new Position(
            this.#numberUtility.getRandomInteger(0, this.#settings.gridSize.columnsCount),
            this.#numberUtility.getRandomInteger(0, this.#settings.gridSize.rowsCount)
        )
        if (newPosition.equals(this.googlePosition) ||
            newPosition.equals(this.player1Position) ||
            newPosition.equals(this.player2Position)
        ) {
            this.#jumpGoogle()
            return;
        }
        this.#googlePosition = newPosition
    }

    #player1StartPosition() {
        this.#player1Position = new Position(
            this.#numberUtility.getRandomInteger(0, this.#settings.gridSize.columnsCount),
            this.#numberUtility.getRandomInteger(0, this.#settings.gridSize.rowsCount)
        )
    }

    #player2StartPosition() {
        let position
        do {
            position = new Position(
                this.#numberUtility.getRandomInteger(0, this.#settings.gridSize.columnsCount),
                this.#numberUtility.getRandomInteger(0, this.#settings.gridSize.rowsCount)
            )
        } while (position.equals(this.player1Position))
        this.#player2Position = position
    }

    #isSamePosition(pos1, pos2) {
        return pos1.x === pos2.x && pos1.y === pos2.y;
    }
}

