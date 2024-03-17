import React from 'react';
import classNames from 'classnames';

import styles from './Cell.module.css';

const CellColors = [styles.cellEmpty, styles.cellTypeJ, styles.cellTypeL, styles.cellTypeI, styles.cellTypeT, styles.cellTypeZ, styles.cellTypeS, styles.cellTypeO];

export const Cell: React.FC<{
    readonly colorId: number;
    readonly className?: string;
}> = ({
    colorId,
    className
}) => {
    return (
        <div className={classNames(styles.cell, CellColors[colorId], className)}/>
    )
}
