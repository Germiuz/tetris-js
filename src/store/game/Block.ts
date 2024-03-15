import {BlockType, getBlockArea} from '@app/store/game/areas.ts';

export type BlockPoint = {
    x: number,
    y: number,
    color: number
}

export class Block {
    private _area: number[][];
    private readonly _type: BlockType

    get type(): BlockType {
        return this._type;
    }

    constructor(type: BlockType) {
        this._type = type;
        this._area = getBlockArea(type);
    }

    private rotateLeft() {
        this._area = this._area.map((row, rowIndex) =>
            row.map((_, colIndex) =>
                this._area[colIndex][this._area.length - 1 - rowIndex]
            )
        );
    }

    private rotateRight() {
        this._area = this._area.map((row, rowIndex) =>
            row.map((_, colIndex) =>
                this._area[this._area.length - 1 - colIndex][rowIndex]
            )
        );
    }

    rotate(direction: 'left' | 'right') {
        switch (direction) {
            case 'left':
                this.rotateLeft();
                break;
            case 'right':
                this.rotateRight();
                break;
        }
    }

    getCell(x: number, y: number) {
        const area = this._area;
        if (y >= 0 && y < area.length) {
            const line = area[y];
            if (x >= 0 && x < line.length) {
                return line[x];
            }
        }

        return 0;
    }

    getPoints(): BlockPoint[] {
        const points: BlockPoint[] = [];
        const area = this._area;

        for (let row = 0; row < area.length; row++) {
            const line = area[row];

            for (let col = 0; col < line.length; col++) {
                if (line[col] != 0) {

                    points.push({ x: col, y: row, color: line[col] });
                }
            }
        }

        return points;
    }
}
