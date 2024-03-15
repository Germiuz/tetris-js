import React, {useEffect, useMemo, useState} from 'react';
import {GameFieldState} from '@app/store/game';

import styles from './GameField.module.css';
import classNames from 'classnames';

const ROWS = 20;
const COLS = 10;
const FPS = 50;

const CellColors = [styles.cellEmpty, styles.cellJ, styles.cellL, styles.cellI, styles.cellT, styles.cellZ, styles.cellS, styles.cellO];

const Cell: React.FC<{
    readonly colorId: number;
}> = ({colorId}) => {
    return (
        <div className={classNames(styles.cell, CellColors[colorId])}/>
    )
}


function useGameProcessor(rows: number, cols: number) {
    const [step, setStep] = useState(0);
    const gameField = useMemo(() => new GameFieldState(rows, cols), []);

    const [speed, setSpeed] = useState(0);
    const [gameState, setGameState] = useState<'init' | 'play' | 'pause' | 'over'>('play');

    const rerender = () => {
        setStep(step => step + 1)
    }

    useEffect(() => {
        gameField.newBlock();
        rerender();
    }, []);

    useEffect(() => {
        if (step % ((10 - speed) * 4) === 0) {
            gameField.moveBlock('Down');
        }
    }, [step]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            rerender();
        }, 1000 / FPS);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    function moveBlock(direction: 'Left' | 'Right' | 'Down') {
        if (gameState === 'play') {
            gameField.moveBlock(direction);
        }
    }

    function rotateBlock() {
        if (gameState === 'play') {
            gameField.rotateBlock();
        }
    }

    function getCell(row: number, col: number) {
        return gameField.getCell(row, col)
    }

    return {
        moveBlock,
        rotateBlock,
        getCell,
        rows: gameField.rows,
        cols: gameField.cols
    };
}

export const GameField: React.FC = () => {
    const gameProcessor = useGameProcessor(ROWS, COLS);

    const RowsIter = useMemo(() => new Array(gameProcessor.rows).fill(0).map((_, idx) => idx), [gameProcessor.rows]);
    const ColsIter = useMemo(() => new Array(gameProcessor.cols).fill(0).map((_, idx) => idx), [gameProcessor.cols]);

    const keyDownHandler = (e: React.KeyboardEvent) => {
        // console.log('keyDown', e.key);
        if (e.key == 'ArrowUp') {
            gameProcessor.rotateBlock();
            e.preventDefault();
        }

        if (e.key == 'ArrowLeft') {
            gameProcessor.moveBlock('Left');
            e.preventDefault();
        }

        if (e.key == 'ArrowRight') {
            gameProcessor.moveBlock('Right');
            e.preventDefault();
        }

        if (e.key == 'ArrowDown') {
            gameProcessor.moveBlock('Down');
            // rerender();
            e.preventDefault();
        }
    }

    return (
        <div onKeyDown={keyDownHandler} tabIndex={0}>
            <div style={{width: '400px', height: '800px'}} className={styles.table}>
                {RowsIter.map(row => (
                    <div key={row} className={styles.row}>
                        {ColsIter.map(col => (
                            <Cell key={col} colorId={gameProcessor.getCell(row, col)}/>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
