import React, {useMemo} from 'react';
import {Cell} from '@app/pages/GameField/Components/Cell/Cell.tsx';

import styles from './Grid.module.css';

export const Grid: React.FC<{
    readonly width: number;
    readonly height: number;
    readonly getCell: (row: number, col: number) => number
}> =({
    width,
    height,
    getCell
}) => {
    const ColsIter = useMemo(() => new Array(width).fill(0).map((_, idx) => idx), [width]);
    const RowsIter = useMemo(() => new Array(height).fill(0).map((_, idx) => idx), [height]);

    return (<div className={styles.grid}>
        {RowsIter.map(row => (
            <div key={row} className={styles.row}>
                {ColsIter.map(col => (
                    <Cell key={col} colorId={getCell(row, col)}/>
                ))}
            </div>
        ))}
    </div>)
}
