import React from 'react';
import classNames from 'classnames';

import styles from './Cell.module.css';

const CellColors = [styles.cellTypeJ, styles.cellTypeL, styles.cellTypeI, styles.cellTypeT, styles.cellTypeZ, styles.cellTypeS, styles.cellTypeO];

const Symbols = ['🌷', '🌸', '🌹', '🌺', '🌻', '🌼', '💐', '💮', '🏵️']
// const Symbols = ['', '❀', '✿', '❁', '⚘', '❃', '🏵', '⚜', '✾']

const getSymbol = (colorId: number) => {
    return '';
    if (colorId > 0) {
        return Symbols[colorId - 1]
    }
    return '';
}

const getCellClass = (colorId: number) => {
    if (colorId > 0) {
        return [styles.cellBlock, CellColors[colorId - 1]]
    }

    if (colorId === 0) {
        return styles.cellEmpty;
    }

    if (colorId < 0) {
        return [styles.cellBlock, styles.cellShadow];
    }
}

export const Cell: React.FC<{
    readonly colorId: number;
    readonly className?: string;
}> = ({
    colorId,
    className
}) => {
    return (
        <div className={classNames(styles.cell, getCellClass(colorId), className)}>
            <span className={styles.symbol}>{getSymbol(colorId)}</span>
        </div>
    )
}
