import React from 'react';
import classNames from 'classnames';
import {Cell} from '@app/pages/GameField/Components/Cell/Cell.tsx';

import styles from './Block.module.css';

export const Block: React.FC<{
    readonly blockArea: number[][];
}> = ({
    blockArea
}) => (
    <div className={classNames(styles.block)}>
        {blockArea.map((row, rowId) => (
            <div key={rowId} className={styles.row}>
                {row.map((cell, colId) => (
                    <Cell key={colId} className={styles.cellNextBlock} colorId={cell}/>
                ))}
            </div>
        ))}
    </div>
)
