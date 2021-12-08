export const SIZE = 5;
export const SLOTS = SIZE * SIZE;

export const NEIGHS_BY_POSITION = [
    98, 229, 458, 916, 776, 3139, 7335, 14670, 29340, 24856, 100448, 234720,
    469440, 938880, 795392, 3214336, 7511040, 15022080, 30044160, 25452544,
    2195456, 5472256, 10944512, 21889024, 9175040,
];

// From north clockwise
export const DIRECTIONS = [
    -5, -4, 1, 6, 5, 4, -1, -6,
];

export const DELTA_TO_DIRECTIONS = {
    [-5]: 0,
    [-4]: 1,
    [1]: 2,
    [6]: 3,
    [5]: 4,
    [4]: 5,
    [-1]: 6,
    [-6]: 7,
};

export const WINNING_POSITIONS = new Set([
    99, 198, 396, 792, 3168, 6336, 12672, 25344, 101376, 202752, 405504, 811008,
    3244032, 6488064, 12976128, 25952256, 15, 30, 480, 960, 15360, 30720, 491520,
    983040, 15728640, 31457280, 33825, 67650, 135300, 270600, 541200, 1082400,
    2164800, 4329600, 8659200, 17318400, 266305, 532610, 8521760, 17043520, 34952,
    69904, 1118464, 2236928,
]);

export enum Player {
    A,
    B,
}

export function x(pos: number) {
    return pos % SIZE;
}

export function y(pos: number) {
    return Math.floor(pos / SIZE);
}