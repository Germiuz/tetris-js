import React, {useMemo} from 'react';
import {Cell} from '@app/pages/GameField/Components/Cell/Cell.tsx';

import styles from './Grid.module.css';
import classNames from 'classnames';

export const Grid: React.FC<{
    readonly className?: string;
    readonly width: number;
    readonly height: number;
    readonly getCell: (row: number, col: number) => number
}> =({
    className,
    width,
    height,
    getCell
}) => {
    const ColsIter = useMemo(() => new Array(width).fill(0).map((_, idx) => idx), [width]);
    const RowsIter = useMemo(() => new Array(height).fill(0).map((_, idx) => idx), [height]);

    return (
        <div className={classNames(styles.grid, className)}>
            {RowsIter.map(row => (
                <div key={row} className={styles.row}>
                    {ColsIter.map(col => (
                        <Cell key={col} colorId={getCell(row, col)}/>
                    ))}
                </div>
            ))}
        </div>
    )
}
