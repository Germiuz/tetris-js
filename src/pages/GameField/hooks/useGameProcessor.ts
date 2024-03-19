import {useEffect, useMemo, useState} from 'react';
import {GameFieldController} from '@app/store/game';
import {useTimer} from '@app/hooks/useTimer.ts';

const FPS = 50;

export function useGameProcessor(gameField: GameFieldController) {
    const [inProcess, setInProcess]= useState(true);
    const step = useTimer(inProcess, 1000 / FPS);

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

    useEffect(() => {
        if (gameField.state === 'Over') {
            setInProcess(false)
        }

        if (step % ((11 - gameField.level) * 4) === 0) {
            gameField.moveBlock('Down');
        }
    }, [step]);

    function newGame() {
        console.log('New Game')
        gameField.startNewGame();
        setInProcess(true);
    }

    function play() {
        if (gameField.state === 'Init' || gameField.state === 'Over') {
            newGame();
        } else {
            setInProcess(true);
        }
    }


    function pause() {
        setInProcess(false);
    }

    return {
        gameField,
        gameState,
        pause,
        play,
        newGame
    };
}
