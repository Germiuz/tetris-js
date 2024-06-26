import {Block, BlockPoint} from '@app/store/game/Block.ts';
import {BlockType} from '@app/store/game/areas.ts';

type GameState = 'Init' | 'Started' | 'Over';

function getEmptyMatrix(rows: number, cols: number): number[][] {
    return new Array(rows).fill(0).map(() => new Array(cols).fill(0));
}

const AllowedBlocks = ['OrangeRicky', 'BlueRicky', 'Hero', 'Teewee', 'ClevelandZ', 'RhodeIslandZ', 'Smashboy'];

export class BlockTypeGenerator {
    private _nextBlockType: BlockType

    get nextBlockType(): BlockType {
        return this._nextBlockType;
    }

    constructor() {
        this._nextBlockType = this.genNextBlockType();
    }


    private genNextBlockType() {
        let newBlockType: BlockType = AllowedBlocks[Math.trunc(Math.random() * AllowedBlocks.length)] as BlockType;

        //regenerate, id same as before. But accept the new result.
        if (this._nextBlockType === newBlockType) {
            newBlockType = AllowedBlocks[Math.trunc(Math.random() * AllowedBlocks.length)] as BlockType;
        }

        return newBlockType;
    }

    getNextBlockType() {
        this._nextBlockType = this.genNextBlockType();
        return this._nextBlockType;
    }
}

export class Game {
    private _cells: number[][] = [];

    private readonly _rows: number;
    private readonly _cols: number;

    private readonly _withShadowBlock: boolean = true;

    private _score: number = 0;
    private _totalLines: number = 0;
    private _level: number = 1;

    private _state: GameState = 'Init';

    private blockTypeGenerator: BlockTypeGenerator;

    private currentBlock?: {
        block: Block;
        pos: {
            x: number;
            y: number;
        };
    }

    constructor(rows: number, cols: number) {
        this._rows = rows;
        this._cols = cols;

        this.blockTypeGenerator = new BlockTypeGenerator();
        this._state = 'Init';
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

    get totalLines(): number {
        return this._totalLines;
    }

    get level(): number {
        return this._level;
    }

    get nextBlockType(): BlockType | undefined {
        return this.blockTypeGenerator.nextBlockType;
    }

    private moveBlockBy(xOffset: number, yOffset: number) {
        if (this.currentBlock && this.checkBlockCanMove(xOffset, yOffset)) {
            this.currentBlock.pos.x += xOffset;
            this.currentBlock.pos.y += yOffset;
        }
    }

    private getScoreForLines(completedLines: number) {
        switch (completedLines) {
            case 1: return  40;
            case 2: return  300;
            case 3: return  500;
            case 4: return 1200;
            default: return 0;
        }
    }

    private calcScore(completedLines: number) {
        this._totalLines += completedLines;

        const newScores = this.getScoreForLines(completedLines) * (this._level);
        this._score += newScores;
        if (this._totalLines >= this._level * 10) {
            this._level++;
        }
    }

    private removeCompletedLines() {
        const uncompletedLines: number[][] = this._cells.filter((row) =>
            row.some((cell) => cell === 0)
        );

        const completedCnt = this.rows - uncompletedLines.length;
        this.calcScore(completedCnt);

        if (completedCnt > 0) {
            const addLines: number[][] = getEmptyMatrix(completedCnt, this.cols);
            this._cells = [...addLines, ...uncompletedLines];
        }
    }

    private checkBlockCanMove(xOffset: number, yOffset: number): boolean {
        if (!this.currentBlock) {
            return false;
        }

        const blockPoints = this.getBlockPoints();

        const collisions = blockPoints
            .map(({x, y}) => ({
                x: x + xOffset,
                y: y + yOffset
            }))
            .filter(({y}) => y >= 0)
            .filter(({x, y}) => x >= this._cols || x < 0 || y >= this._rows || this._cells[y][x] != 0);

        return collisions.length === 0;
    }

    private getBlockPoints(): BlockPoint[] {
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

    private getBlockCell(row: number, col: number) {
        if (this.currentBlock) {
            return this.currentBlock.block.getCell(col - this.currentBlock.pos.x, row - this.currentBlock.pos.y)
        }
        return 0;
    }

    private getShadowBlockCell(row: number, col: number) {
        if (this.currentBlock) {
            let yShift = 0;
            while (this.checkBlockCanMove(0, yShift + 1)) {
                yShift++;
            }

            return this.currentBlock.block.getCell(col - this.currentBlock.pos.x, row - this.currentBlock.pos.y - yShift) > 0
        }
        return 0;
    }

    private setCell(row: number, col: number, val: number) {
        if (row >= 0 && row < this._rows && col >= 0 && col < this._cols) {
            this._cells[row][col] = val;
        }
    }

    startNewGame() {
        this._cells = getEmptyMatrix(this._rows, this._cols);

        this._score = 0;
        this._totalLines = 0;
        this._level = 1;
        this._state = 'Started';
        this.newBlock();
    }

    newBlock() {
        const newBlock = new Block(this.blockTypeGenerator.nextBlockType)

        this.currentBlock = {
            block: newBlock,
            pos: {
                x: Math.floor(this._cols / 2) - 1,
                y: 1 - newBlock.areaSize
            },
        }

        this.blockTypeGenerator.getNextBlockType()
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

        if (!this.checkBlockCanMove(0, 0)) {
            this._state = 'Over';
            this.currentBlock = undefined;
        }
    }

    rotateBlock(direction: 'left' | 'right' = 'left') {
        if (!this.currentBlock) {
            return
        }

        this.currentBlock.block.rotate(direction);
        if (!this.checkBlockCanMove(0, 0)) {
            if (this.checkBlockCanMove(1, 0)) {
                this.moveBlockBy(1, 0)
                return;
            }

            if (this.checkBlockCanMove(-1, 0)) {
                this.moveBlockBy(-1, 0)
                return;
            }

            if (this.checkBlockCanMove(2, 0)) {
                this.moveBlockBy(2, 0)
                return;
            }

            if (this.checkBlockCanMove(-2, 0)) {
                this.moveBlockBy(-2, 0)
                return;
            }

            this.currentBlock.block.rotate(direction === 'left' ? 'right' : 'left');
        }
    }

    moveBlock(direction: 'Left' | 'Right' | 'Down') {
        if (this.currentBlock) {
            switch (direction) {
                case 'Left':
                    if (this.checkBlockCanMove(-1, 0)) {
                        this.moveBlockBy(-1, 0);
                    }
                    break;
                case 'Right':
                    if (this.checkBlockCanMove(1, 0)) {
                        this.moveBlockBy(1, 0);
                    }
                    break;
                case 'Down':
                    if (this.checkBlockCanMove(0, 1)) {
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
        while (this.checkBlockCanMove(0, 1)) {
            this.moveBlockBy(0, 1);
        }
        //One last chance to move
        //this.nextBlock();
    }

    getCell(row: number, col: number) {
        const blockCell = this.getBlockCell(row, col);
        if (blockCell) {
            return blockCell;
        }

        const gridCell = this._cells?.[row]?.[col];
        if (gridCell) {
            return gridCell;
        }

        if (this._withShadowBlock) {
            const shadowBlockCell = this.getShadowBlockCell(row, col);
            if (shadowBlockCell) {
                return -1;
            }
        }

        return 0;
    }
}
