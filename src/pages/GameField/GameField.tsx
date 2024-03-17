import React, {useRef} from 'react';
import {GameOverModal, PlayPauseModal, StartGameModal} from '@app/pages/GameField/Modals';
import {useGameProcessor} from '@app/pages/GameField/hooks/useGameProcessor.ts';
import {getBlockArea} from '@app/store/game/areas.ts';
import {FixedRatioContainer} from '@app/layouts/FixedRatioContainer/FixedRatioContainer.tsx';
import {Block} from '@app/pages/GameField/Components/Block/Block.tsx';
import {Grid} from '@app/pages/GameField/Components/Grid/Grid.tsx';

import styles from './GameField.module.css';
import {UserInputController} from '@app/pages/GameField/Components/UserInputController/UserInputController.tsx';

const ROWS = 20;
const COLS = 10;

export const GameField: React.FC = () => {
    const gameProcessor = useGameProcessor(ROWS, COLS);

    const fieldRef = useRef<HTMLDivElement>(null);

    const handleFocus = () => {
        gameProcessor.play();
    }

    const play = () => {
        fieldRef.current?.focus();
    }

    const left = () => gameProcessor.moveBlock('Left');
    const right = () => gameProcessor.moveBlock('Right');
    const down = () => gameProcessor.moveBlock('Down');
    const fall = () => gameProcessor.downBlock();
    const rotate = () => gameProcessor.rotateBlock();
    const pause = () => gameProcessor.pause();

    return (
        <div
            className={styles.gameWrapper}
        >
            <div>Score: {gameProcessor.score}</div>

            <div className={styles.nextBlockWrapper}>
                <Block
                    blockArea={getBlockArea(gameProcessor.nextBlockType || 'Hero')}
                />
            </div>

            {(gameProcessor.gameState === 'init') && (
                <StartGameModal className={styles.modal} onClose={play}/>
            )}

            {(gameProcessor.gameState === 'pause') && (
                <PlayPauseModal className={styles.modal} onClose={play}/>
            )}

            {(gameProcessor.gameState === 'over') && (
                <GameOverModal className={styles.modal} onClose={play} score={gameProcessor.score}/>
            )}

            <FixedRatioContainer ratio={0.5}>
                <UserInputController
                    className={styles.fieldWrapper}
                    ref={fieldRef}
                    onFocus={handleFocus}
                    onBlur={pause}

                    onLeft={left}
                    onRight={right}
                    onDown={down}
                    onDownLong={fall}
                    onUp={rotate}
                    onEsc={pause}
                >
                    <Grid
                        width={gameProcessor.cols}
                        height={gameProcessor.rows}
                        getCell={(row, col) => gameProcessor.getCell(row, col)}
                    />
                </UserInputController>
            </FixedRatioContainer>

        </div>
    );
}
