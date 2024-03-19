import React from 'react';

export const GameOverModal: React.FC<{
    readonly className: string;
    readonly score: number;
    readonly onClose: () => void;
}> = ({
    className,
    score,
    onClose
}) => {
    return (
        <div className={className}>
            <h3>Game Over</h3>
            <div>your final score: {score}</div>
            <button onClick={onClose}>Close</button>
        </div>
    )
}
