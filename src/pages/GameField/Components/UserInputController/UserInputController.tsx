import React, {useEffect} from 'react';
import {HTMLDivExtension} from '@app/layouts/types.ts';
import {useSwipe} from '@app/hooks/useSwipe.ts';
import {useForwardRef} from '@app/hooks/useForwardRef.ts';

import styles from './UserInputController.module.css'
import classNames from 'classnames';

const SWIPE_THRESHOLD = 20;

export type UserInputAction = 'Left' | 'Right' | 'Rotate' | 'Down' | 'Fall' | 'Esc';

export const UserInputController = React.forwardRef<HTMLDivElement, HTMLDivExtension<{
    readonly onAction: (action: UserInputAction) => void;
    readonly children: React.ReactNode
}>>(({
    onAction,
    className,
    children,
    ...htmlProps
}, ref) => {
        const fieldRef = useForwardRef<HTMLDivElement>(ref);

        const touchHandler = useSwipe<HTMLDivElement>();

        useEffect(() => {
            if (touchHandler.finished) {
                if (Math.abs(touchHandler.delta.x) > Math.abs(touchHandler.delta.y)) {
                    if (touchHandler.delta.x > SWIPE_THRESHOLD) {
                        onAction('Right')
                        return;
                    }

                    if (touchHandler.delta.x < -SWIPE_THRESHOLD) {
                        onAction('Left')
                        return;
                    }
                } else {
                    if (touchHandler.delta.y > SWIPE_THRESHOLD) {
                        if (touchHandler.delta.y > SWIPE_THRESHOLD * 5) {
                            onAction('Fall')
                            return;
                        }

                        onAction('Down')
                        return;
                    }

                    if (touchHandler.delta.y < -SWIPE_THRESHOLD) {
                        onAction('Esc')
                        return;
                    }

                    onAction('Rotate')
                }
            }
        }, [touchHandler.finished]);

        const keyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key == 'ArrowUp') {
                onAction('Rotate')
                e.preventDefault();
            }

            if (e.key == 'ArrowLeft') {
                onAction('Left')
                e.preventDefault();
            }

            if (e.key == 'ArrowRight') {
                onAction('Right')
                e.preventDefault();
            }

            if (e.key == 'ArrowDown') {
                onAction('Down')
                e.preventDefault();
            }

            if (e.key == ' ') {
                onAction('Fall')
                e.preventDefault();
            }

            if (e.key == 'Escape') {
                onAction('Esc')
                e.preventDefault();
            }

            if (htmlProps.onKeyDown) {
                htmlProps.onKeyDown(e);
            }
        }


        return (
            <div
                ref={fieldRef}
                className={classNames(className, styles.noBorder)}
                tabIndex={0}
                onKeyDown={keyDownHandler}
                // onClick={() => onAction('Rotate')}
                // onDoubleClick={() => onAction('Esc')}
                {...touchHandler.touchEvents}
                {...htmlProps}
            >
                {children}
            </div>
        )
    }
)
