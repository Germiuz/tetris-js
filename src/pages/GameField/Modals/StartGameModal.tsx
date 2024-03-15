import React from 'react';

export const StartGameModal: React.FC<{
    readonly className: string;
    readonly onClose: () => void;
}> = ({
          className,
          onClose
      }) => (
    <div className={className}>
        <h3>New Game</h3>
        <button onClick={onClose}>Start</button>
    </div>
)
