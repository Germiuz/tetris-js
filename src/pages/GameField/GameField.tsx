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
import {Game} from '@app/store/game';
import classNames from 'classnames';

const ROWS = 20;
const COLS = 10;

type GameStatistic = {
    maxScore: number;
}

export const GameField: React.FC = () => {
    const game = useMemo(() => new Game(ROWS, COLS), []);
    const gameProcessor = useGameProcessor(game);

    const fieldRef = useRef<HTMLDivElement>(null);

    const [statistic, saveStatistic] = useLocalStorage<GameStatistic>('game-statistic', {
        maxScore: 0
    });

    useEffect(() => {
        if (game.state === 'Over') {
            if (game.score > statistic.maxScore) {
                saveStatistic({
                    ...statistic,
                    maxScore: game.score
                })
            }
        }
    }, [game.state])

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
            game.moveBlock('Left');
        }

        if (action === 'Right') {
            game.moveBlock('Right');
        }

        if (action === 'Down') {
            game.moveBlock('Down');
        }

        if (action === 'Fall') {
            game.downBlock();
        }

        if (action === 'Rotate') {
            game.rotateBlock();
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
                            score={game.score}
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
                            width={game.cols}
                            height={game.rows}
                            getCell={(row, col) => game.getCell(row, col)}
                        />
                    </UserInputController>
                </div>
            </FixedRatioContainer>

            <div className={styles.infoContainer}>
                <div className={styles.roundInfoBlock}>Level: {game.level}</div>
                <div className={styles.roundInfoBlock}>Score: {game.score}</div>

                <div className={styles.roundInfoBlock}>Lines: {game.totalLines}</div>

                <div className={styles.roundInfoBlock}>Max score: {statistic.maxScore}</div>

                <div className={styles.roundInfoBlock}>
                    <div>Next block:</div>
                    <div className={styles.nextBlockWrapper}>
                        <Block
                            blockArea={getBlockArea(game.nextBlockType || 'Hero')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
