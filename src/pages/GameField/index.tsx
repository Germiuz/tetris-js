import React, {useEffect, useMemo, useState} from 'react';
import {GameFieldState} from '../../store/game';

import styles from './index.module.css';
import classNames from 'classnames';

const ROWS = 20;
const COLS = 10;

const CellColors = [styles.cellType0, styles.cellType1, styles.cellType2, styles.cellType3, styles.cellType4, styles.cellType5, styles.cellType6, styles.cellType7];

const Cell: React.FC<{
    readonly colorId: number;
}> = ({colorId}) => {
    return (
        <div className={classNames(styles.cell, CellColors[colorId])}/>
    )
}

export const GameField: React.FC = () => {
    const [, setStep] = useState(0);
    const gameField = useMemo(() => new GameFieldState(ROWS, COLS), []);

    const RowsIter = useMemo(() => new Array(gameField.rows).fill(0).map((_, idx) => idx), [gameField.rows]);
    const ColsIter = useMemo(() => new Array(gameField.cols).fill(0).map((_, idx) => idx), [gameField.cols]);

    const rerender = () => {
        // setTimeout(() => setStep(step => step + 1), 100);
        setStep(step => step + 1)
    }

    useEffect(() => {
        gameField.newBlock();
        rerender();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            gameField.moveBlock('Down');
            rerender();
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const keyDownHandler = (e: React.KeyboardEvent) => {
        // console.log('keyDown', e.key);
        if (e.key == 'ArrowUp') {
            gameField.rotateBlock();
            rerender();
            e.preventDefault();
        }

        if (e.key == 'ArrowLeft') {
            gameField.moveBlock('Left');
            rerender();
            e.preventDefault();
        }

        if (e.key == 'ArrowRight') {
            gameField.moveBlock('Right');
            rerender();
            e.preventDefault();
        }

        if (e.key == 'ArrowDown') {
            gameField.moveBlock('Down');
            rerender();
            e.preventDefault();
        }
    }

    return (
        <div onKeyDown={keyDownHandler} tabIndex={0}>
            <div style={{width: '400px', height: '800px'}} className={styles.table}>
                {RowsIter.map(row => (
                    <div key={row} className={styles.row}>
                        {ColsIter.map(col => (
                            <Cell key={col} colorId={gameField.getCell(row, col)}/>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
