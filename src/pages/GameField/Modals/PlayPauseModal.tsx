import React from 'react';

export const PlayPauseModal: React.FC<{
    readonly className: string;
    readonly onClose: () => void;
    readonly onNewGame: () => void;
}> = ({
    className,
    onClose,
    onNewGame
}) => (
    <div className={className}>
        <h3>Pause</h3>
        <button onClick={onClose}>Continue</button>
        <button onClick={onNewGame}>New Game</button>
    </div>
)
