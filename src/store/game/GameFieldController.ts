import {Block, BlockPoint} from '@app/store/game/Block.ts';
import {BlockType} from '@app/store/game/areas.ts';

type GameState = 'Init' | 'Started' | 'Over';

function getEmptyMatrix(rows: number, cols: number): number[][] {
    return new Array(rows).fill(0).map(() => new Array(cols).fill(0));
}

const AllowedBlocks = ['OrangeRicky', 'BlueRicky', 'Hero', 'Teewee', 'ClevelandZ', 'RhodeIslandZ', 'Smashboy'];

export class GameFieldController {
    private cells: number[][] = [];

    private readonly _rows: number;
    private readonly _cols: number;

    private _score: number = 0;

    private _state: GameState = 'Init';

    private currentBlock?: {
        block: Block;
        pos: {
            x: number,
            y: number
        }
    }

    constructor(rows: number, cols: number) {
        this._rows = rows;
        this._cols = cols;

        this.initField();
    }

    get rows(): number {
        return this._rows;
    }
    get cols(): number {
        return this._cols;
    }

    get state(): GameState {
        return this._state;
    }

    get score(): number {
        return this._score;
    }

    private initField() {
        this.cells = getEmptyMatrix(this._rows, this._cols);
        this._state = 'Init';
    }

    private genBlockType() {
        let newBlockType: BlockType = AllowedBlocks[Math.trunc(Math.random() * AllowedBlocks.length)] as BlockType;

        //regenerate, id same as before. But accept the new result.
        if (this.currentBlock && this.currentBlock.block.type === newBlockType) {
            newBlockType = AllowedBlocks[Math.trunc(Math.random() * AllowedBlocks.length)] as BlockType;
        }

        return newBlockType;
    }

    private moveBlockBy(xOffset: number, yOffset: number) {
        if (this.currentBlock && this.checkBlockPosition(xOffset, yOffset)) {
            this.currentBlock.pos.x += xOffset;
            this.currentBlock.pos.y += yOffset;
        }
    }

    private incScore(completedLines: number) {
        switch (completedLines) {
            case 1:
                this._score += 100;
                break;
            case 2:
                this._score += 300;
                break;
            case 3:
                this._score += 500;
                break;
            case 4:
                this._score += 1000;
                break;
        }

    }

    private removeCompletedLines() {
        const uncompletedLines: number[][] = this.cells.filter((row) =>
            row.some((cell) => cell === 0)
        );

        const completedCnt = this.rows - uncompletedLines.length;

        this.incScore(completedCnt);

        if (completedCnt > 0) {
            const addLines: number[][] = getEmptyMatrix(completedCnt, this.cols);
            this.cells = [...addLines, ...uncompletedLines];
        }
    }

    startNewGame() {
        this.initField();
        this._state = 'Started';
        this.newBlock();
    }

    newBlock() {
        const nextBlockType = this.genBlockType();

        this.currentBlock = {
            block: new Block(nextBlockType),
            pos: {
                x: Math.floor(this._cols / 2) - 1,
                y: 0
            }
        }
    }

    nextBlock() {
        if (this.currentBlock) {
            const points = this.getBlockPoints();
            points.forEach(({x, y, color}) => {
                this.setCell(y, x, color);
            });
        }

        this.removeCompletedLines();

        this.newBlock();

        if (!this.checkBlockPosition(0, 0)) {
            this._state = 'Over';
            this.currentBlock = undefined;
        }
    }

    rotateBlock(direction: 'left' | 'right' = 'left') {
        if (!this.currentBlock) {
            return
        }

        this.currentBlock.block.rotate(direction);
        if (!this.checkBlockPosition(0, 0)) {
            if (this.checkBlockPosition(1, 0)) {
                console.log('Adjusted by +1')
                this.moveBlockBy(1, 0)
                return;
            }

            if (this.checkBlockPosition(-1, 0)) {
                console.log('Adjusted by -1')
                this.moveBlockBy(-1, 0)
                return;
            }

            if (this.checkBlockPosition(2, 0)) {
                console.log('Adjusted by +2')
                this.moveBlockBy(2, 0)
                return;
            }

            if (this.checkBlockPosition(-2, 0)) {
                console.log('Adjusted by -2')
                this.moveBlockBy(-2, 0)
                return;
            }

            console.log('Rotated back')

            this.currentBlock.block.rotate(direction === 'left' ? 'right' : 'left');
        }
    }

    moveBlock(direction: 'Left' | 'Right' | 'Down') {
        if (this.currentBlock) {
            switch (direction) {
                case 'Left':
                    if (this.checkBlockPosition(-1, 0)) {
                        this.moveBlockBy(-1, 0);
                    }
                    break;
                case 'Right':
                    if (this.checkBlockPosition(1, 0)) {
                        this.moveBlockBy(1, 0);
                    }
                    break;
                case 'Down':
                    if (this.checkBlockPosition(0, 1)) {
                        this.moveBlockBy(0, 1);
                    }
                    else {
                        this.nextBlock()
                    }
                    break;
            }
        }
    }

    downBlock() {
        while (this.checkBlockPosition(0, 1)) {
            this.moveBlockBy(0, 1);
        }
        //On last chance to move
        //this.nextBlock();
    }

    checkBlockPosition(xOffset: number, yOffset: number): boolean {
        if (!this.currentBlock) {
            return false;
        }

        const blockPoints = this.getBlockPoints();

        const collisions = blockPoints
            .map(({x, y}) => ({
                x: x + xOffset,
                y: y + yOffset
            }))
            .filter(({x, y}) => x >= this._cols || x < 0 || y >= this._rows || this.cells[y][x] != 0);

        return collisions.length === 0;
    }

    getBlockPoints(): BlockPoint[] {
        if (!this.currentBlock) {
            return [];
        }

        const pos = this.currentBlock.pos;

        return this.currentBlock.block.getPoints().map(({x, y, color}) => ({
            x: pos.x + x,
            y: pos.y + y,
            color,
        }))
    }

    getBlockCell(row: number, col: number) {
        if (this.currentBlock) {
            return this.currentBlock.block.getCell(col - this.currentBlock.pos.x, row - this.currentBlock.pos.y)
        }
        return 0;
    }

    getCell(row: number, col: number) {
        return this.getBlockCell(row, col) || this.cells[row][col];
    }

    setCell(row: number, col: number, val: number) {
        this.cells[row][col] = val;
    }
}
