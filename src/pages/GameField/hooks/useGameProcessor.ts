import {useEffect, useMemo, useState} from 'react';
import {Game} from '@app/store/game';
import {useTimer} from '@app/hooks/useTimer.ts';

const FPS = 50;

export function useGameProcessor(game: Game) {
    const [inProcess, setInProcess]= useState(true);
    const step = useTimer(inProcess, 1000 / FPS);

    const gameState: 'init' | 'play' | 'pause' | 'over' = useMemo(() => {
        if (game.state === 'Init') {
            return 'init';
        }
        if (game.state === 'Over') {
            return 'over'
        }

        if (inProcess) {
            return 'play';
        } else {
            return 'pause';
        }
    }, [inProcess, game.state])

    useEffect(() => {
        if (game.state === 'Over') {
            setInProcess(false)
        }

        if (step % ((11 - game.level) * 4) === 0) {
            game.moveBlock('Down');
        }
    }, [step]);

    function newGame() {
        console.log('New Game')
        game.startNewGame();
        setInProcess(true);
    }

    function play() {
        if (game.state === 'Init' || game.state === 'Over') {
            newGame();
        } else {
            setInProcess(true);
        }
    }


    function pause() {
        setInProcess(false);
    }

    return {
        game,
        gameState,
        pause,
        play,
        newGame
    };
}
