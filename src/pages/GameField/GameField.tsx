import React, {useEffect, useMemo, useRef} from 'react';
import {GameOverModal, PlayPauseModal, StartGameModal} from '@app/pages/GameField/Modals';
import {useGameProcessor} from '@app/pages/GameField/hooks/useGameProcessor.ts';
import {getBlockArea} from '@app/store/game/areas.ts';
import {FixedRatioContainer} from '@app/layouts/FixedRatioContainer/FixedRatioContainer.tsx';
import {Block} from '@app/pages/GameField/Components/Block/Block.tsx';
import {Grid} from '@app/pages/GameField/Components/Grid/Grid.tsx';

import styles from './GameField.module.css';
import {
    UserInputAction,
    UserInputController
} from '@app/pages/GameField/Components/UserInputController/UserInputController.tsx';
import {useLocalStorage} from '@app/hooks/useStorage.ts';
import {GameFieldController} from '@app/store/game';
import classNames from 'classnames';

const ROWS = 20;
const COLS = 10;

type GameStatistic = {
    maxScore: number;
}

export const GameField: React.FC = () => {
    const gameField = useMemo(() => new GameFieldController(ROWS, COLS), []);
    const gameProcessor = useGameProcessor(gameField);

    const fieldRef = useRef<HTMLDivElement>(null);

    const [statistic, saveStatistic] = useLocalStorage<GameStatistic>('game-statistic', {
        maxScore: 0
    });

    useEffect(() => {
        if (gameField.state === 'Over') {
            if (gameField.score > statistic.maxScore) {
                saveStatistic({
                    ...statistic,
                    maxScore: gameField.score
                })
            }
        }
    }, [gameField.state])

    const handleFocus = () => {
        gameProcessor.play();
    }

    const play = () => {
        fieldRef.current?.focus();
        gameProcessor.play();
    }

    const pause = () => {
        gameProcessor.pause()
    }

    const newGame = () => {
        fieldRef.current?.focus();
        gameProcessor.newGame()
    }

    const onUserAction = (action: UserInputAction) => {
        if (action === 'Left') {
            gameField.moveBlock('Left');
        }

        if (action === 'Right') {
            gameField.moveBlock('Right');
        }

        if (action === 'Down') {
            gameField.moveBlock('Down');
        }

        if (action === 'Fall') {
            gameField.downBlock();
        }

        if (action === 'Rotate') {
            gameField.rotateBlock();
        }

        if (action === 'Esc') {
            pause()
        }
    }

    return (
        <div
            className={classNames(styles.gameWrapper, styles.fullSizeBlock)}
        >
            <FixedRatioContainer
                ratio={0.5}
                verticalAlign={'start'}
            >
                <div className={classNames(styles.fieldWrapper, styles.fullSizeBlock)}>
                    {(gameProcessor.gameState === 'init') && (
                        <StartGameModal
                            className={styles.modal}
                            onClose={play}
                        />
                    )}

                    {(gameProcessor.gameState === 'pause') && (
                        <PlayPauseModal
                            className={styles.modal}
                            onClose={play}
                            onNewGame={newGame}
                        />
                    )}

                    {(gameProcessor.gameState === 'over') && (
                        <GameOverModal
                            className={styles.modal}
                            onClose={play}
                            score={gameField.score}
                        />
                    )}
                    <UserInputController
                        className={styles.fullSizeBlock}
                        ref={fieldRef}
                        onFocus={handleFocus}
                        onBlur={pause}
                        onAction={onUserAction}
                    >
                        <Grid
                            width={gameField.cols}
                            height={gameField.rows}
                            getCell={(row, col) => gameField.getCell(row, col)}
                        />
                    </UserInputController>
                </div>
            </FixedRatioContainer>

            <div className={styles.infoContainer}>
                <div className={styles.roundInfoBlock}>Level: {gameProcessor.speed + 1}</div>
                <div className={styles.roundInfoBlock}>Score: {gameField.score}</div>

                <div className={styles.roundInfoBlock}>Lines: {gameField.totalLines}</div>

                <div className={styles.roundInfoBlock}>Max score: {statistic.maxScore}</div>

                <div className={styles.roundInfoBlock}>
                    <div>Next block:</div>
                    <div className={styles.nextBlockWrapper}>
                        <Block
                            blockArea={getBlockArea(gameField.nextBlockType || 'Hero')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
