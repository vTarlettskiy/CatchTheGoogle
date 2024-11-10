import {Game} from "./game.js";
import {GameStatuses} from "./GAME_STATUSES.js";

describe('game', () => {
    it('should have Pending status after creating', () => {
        const game = new Game()
        expect(game.status).toBe(GameStatuses.PENDING)
    })

    it('should have InProgress status after start', () => {
        const game = new Game()
        game.start()
        expect(game.status).toBe(GameStatuses.IN_PROGRESS)
    })
    it('google should be in the Grid after start', () => {
        const game = new Game()
        game.start()
        expect(game.googlePosition.x).toBeLessThan(game.gridSize.columnsCount)
        expect(game.googlePosition.x).toBeGreaterThanOrEqual(0)
        expect(game.googlePosition.y).toBeLessThan(game.gridSize.rowsCount)
        expect(game.googlePosition.y).toBeGreaterThanOrEqual(0)
    })
    it('google should be in the Grid but in new position after jump', async () => {
        const game = new Game()
        game.googleJumpInterval = 1;
        game.start() // jump -> webAPI/browser 10

        for (let i = 0; i < 100; i++) {
            const prevGooglePosition = game.googlePosition;
            await delay(1) // await -> webAPI/browser 10 // after 10 ms: macrotasks: [jump, await]
            const currentGooglePosition = game.googlePosition;
            expect(prevGooglePosition).not.toEqual(currentGooglePosition)
        }
    })
    it('player1 position not should be same like player2', () => {
        for(let i = 0; i < 100; i++) {
            const game = new Game()
            game.start()
            expect(game.player1Position).not.toEqual(game.player2Position)
        }
    })
    it('player1 and player2 position not should be same like google', () => {
        for(let i = 0; i < 100; i++) {
            const game = new Game()
            game.start()
            expect(game.player1Position).not.toEqual(game.googlePosition)
            expect(game.player2Position).not.toEqual(game.googlePosition)
        }
    })
    it('google must win', async () => {
        for(let i = 0; i < 1; i++) {
            const game = new Game()
            game.googleJumpInterval=50;
            game.start()
            await delay(2000)
            expect(game.status).toBe(GameStatuses.LOSE)
        }
    })
})

const delay = (ms) => new Promise(res => setTimeout(res, ms))