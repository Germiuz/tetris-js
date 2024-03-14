//L-block
const OrangeRicky = [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1]
];

//J-block
const BlueRicky = [
    [0, 2, 0],
    [0, 2, 0],
    [2, 2, 0]
];

//I-block
const Hero = [
    [0, 3, 0, 0],
    [0, 3, 0, 0],
    [0, 3, 0, 0],
    [0, 3, 0, 0]
];

//T-block
const Teewee = [
    [0, 4, 0],
    [0, 4, 4],
    [0, 4, 0]
];

//Z-block
const ClevelandZ = [
    [5, 5, 0],
    [0, 5, 5],
    [0, 0, 0]
];

//S-block
const RhodeIslandZ = [
    [0, 6, 6],
    [6, 6, 0],
    [0, 0, 0]
];

//O-block
const Smashboy = [
    [7, 7],
    [7, 7]
];

export type BlockType =
    | 'OrangeRicky'
    | 'BlueRicky'
    | 'Hero'
    | 'Teewee'
    | 'ClevelandZ'
    | 'RhodeIslandZ'
    | 'Smashboy';

export function getBlockArea(type: BlockType) {
    switch (type) {
        case 'OrangeRicky':
            return OrangeRicky
        case 'BlueRicky':
            return BlueRicky
        case 'Hero':
            return Hero
        case 'Teewee':
            return Teewee
        case 'ClevelandZ':
            return ClevelandZ
        case 'RhodeIslandZ':
            return RhodeIslandZ
        case 'Smashboy':
            return Smashboy
    }
}

// export function rotateBlockLeft(block: Block) {
//     const rotatedArea = block.area.map((row, rowIndex) =>
//         row.map((_, colIndex) => block.area[colIndex][block.area.length - 1 - rowIndex])
//     );
//     return { type: block.type, area: rotatedArea };
// }
//
// export function rotateBlockRight(block: Block) {
//     const rotatedArea = block.area.map((row, rowIndex) =>
//         row.map((_, colIndex) => block.area[block.area.length - 1 - rowIndex][colIndex])
//     );
//     return { type: block.type, area: rotatedArea };
// }
