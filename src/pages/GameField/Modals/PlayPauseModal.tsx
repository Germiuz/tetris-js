import React from 'react';

export const PlayPauseModal: React.FC<{
    readonly className: string;
    readonly onClose: () => void;
}> = ({
    className,
    onClose
}) => (
    <div className={className}>
        <h3>Pause</h3>
        <button onClick={onClose}>continue</button>
    </div>
)
