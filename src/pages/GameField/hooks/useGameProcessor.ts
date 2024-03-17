import {useEffect, useMemo, useState} from 'react';
import {GameFieldController} from '@app/store/game';
import {useTimer} from '@app/hooks/useTimer.ts';

const FPS = 50;

export function useGameProcessor(rows: number, cols: number) {
    const gameField = useMemo(() => new GameFieldController(rows, cols), []);

    const [speed, setSpeed] = useState(0);
    const [inProcess, setInProcess]= useState(true);
    const step = useTimer(inProcess, 1000 / FPS);

    useEffect(() => {
        const newSpeed = Math.trunc(gameField.score / 1000);
        if (speed < newSpeed) {
            setSpeed(newSpeed);
        }

        if (gameField.state === 'Over') {
            setInProcess(false)
        }

        if (step % ((10 - speed) * 4) === 0) {
            gameField.moveBlock('Down');
        }
    }, [step]);

    const gameState: 'init' | 'play' | 'pause' | 'over' = useMemo(() => {
        if (gameField.state === 'Init') {
            return 'init';
        }
        if (gameField.state === 'Over') {
            return 'over'
        }

        if (inProcess) {
            return 'play';
        } else {
            return 'pause';
        }
    }, [inProcess, gameField.state])

    function moveBlock(direction: 'Left' | 'Right' | 'Down') {
        if (inProcess) {
            gameField.moveBlock(direction);
        }
    }

    function rotateBlock() {
        if (inProcess) {
            gameField.rotateBlock();
        }
    }

    function downBlock() {
        if (inProcess) {
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
        setInProcess(true);
    }


    function pause() {
        setInProcess(false);
    }

    return {
        moveBlock,
        rotateBlock,
        downBlock,
        getCell,
        rows: gameField.rows,
        cols: gameField.cols,
        score: gameField.score,
        nextBlockType: gameField.nextBlockType,
        gameState,
        pause,
        play
    };
}
