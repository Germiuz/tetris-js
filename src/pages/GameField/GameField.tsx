import React, {useEffect, useMemo, useRef, useState} from 'react';
import {GameFieldController} from '@app/store/game';

import styles from './GameField.module.css';
import classNames from 'classnames';
import {GameOverModal, PlayPauseModal, StartGameModal} from '@app/pages/GameField/Modals';
import {useTimer} from '@app/hooks/useTimer.ts';

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
    const gameField = useMemo(() => new GameFieldController(rows, cols), []);

    const [speed, setSpeed] = useState(0);
    const [gameState, setGameState] = useState<'init' | 'play' | 'pause' | 'over'>('init');
    // const [paused, setPaused] = useState(true);
    const step = useTimer(gameState === 'play', 1000 / FPS);

    useEffect(() => {
        const newSpeed = Math.trunc(gameField.score / 1000);
        if (speed < newSpeed) {
            setSpeed(newSpeed);
        }

        if (step % ((10 - speed) * 4) === 0) {
            gameField.moveBlock('Down');
        }

        if (gameField.state === 'Over') {
            setGameState('over')
        }
    }, [step]);

    function moveBlock(direction: 'Left' | 'Right' | 'Down') {
        if (gameState === 'play') {
            console.log('moveBlock');
            gameField.moveBlock(direction);
        }
    }

    function rotateBlock() {
        if (gameState === 'play') {
            gameField.rotateBlock();
        }
    }

    function downBlock() {
        if (gameState === 'play') {
            gameField.downBlock();
        }
    }

    function getCell(row: number, col: number) {
        return gameField.getCell(row, col)
    }

    function play() {
        if (gameField.state === 'Init' || gameField.state === 'Over') {
            gameField.startNewGame();
        }
        setGameState('play');
    }


    function pause() {
        setGameState('pause')
    }

    return {
        moveBlock,
        rotateBlock,
        downBlock,
        getCell,
        rows: gameField.rows,
        cols: gameField.cols,
        score: gameField.score,
        gameState,
        pause,
        play
    };
}

export const GameField: React.FC = () => {
    const gameProcessor = useGameProcessor(ROWS, COLS);

    const RowsIter = useMemo(() => new Array(gameProcessor.rows).fill(0).map((_, idx) => idx), [gameProcessor.rows]);
    const ColsIter = useMemo(() => new Array(gameProcessor.cols).fill(0).map((_, idx) => idx), [gameProcessor.cols]);

    const fieldRef = useRef<HTMLDivElement>(null);

    const keyDownHandler = (e: React.KeyboardEvent) => {
        // console.log('keyDown', `|${e.key}|`);
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
            e.preventDefault();
        }

        if (e.key == ' ') {
            gameProcessor.downBlock();
            e.preventDefault();
        }
    }

    const handleFocus = () => {
        console.log('focused')
        gameProcessor.play();
    }

    const handleFocusLost = () => {
        console.log('focusLost')
        gameProcessor.pause();
    }

    const play = () => {
        fieldRef.current?.focus();
        // gameProcessor.play();
    }

    return (
        <div
            className={styles.fieldWrapper}
        >
            <div>Score: {gameProcessor.score}</div>

            {(gameProcessor.gameState === 'init') && (
                <StartGameModal className={styles.modal} onClose={play}/>
            )}

            {(gameProcessor.gameState === 'pause') && (
                <PlayPauseModal className={styles.modal} onClose={play}/>
            )}

            {(gameProcessor.gameState === 'over') && (
                <GameOverModal className={styles.modal} onClose={play} score={gameProcessor.score}/>
            )}

            <div
                style={{width: '400px', height: '800px'}}
                className={styles.field}
                tabIndex={0}
                ref={fieldRef}
                onKeyDown={keyDownHandler}
                onFocus={handleFocus}
                onBlur={handleFocusLost}
            >
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
