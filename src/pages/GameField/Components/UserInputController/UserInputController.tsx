import React, {useEffect} from 'react';
import {HTMLDivExtension} from '@app/layouts/types.ts';
import {useSwipe} from '@app/hooks/useSwipe.ts';
import {useForwardRef} from '@app/hooks/useForwardRef.ts';

const SWIPE_THRESHOLD = 20;

export const UserInputController = React.forwardRef<HTMLDivElement, HTMLDivExtension<{
    readonly onLeft?: () => void;
    readonly onRight?: () => void;
    readonly onUp?: () => void;
    readonly onDown?: () => void;
    readonly onDownLong?: () => void;
    readonly onEsc?: () => void;
    readonly children: React.ReactNode
}>>(({
    onLeft,
    onRight,
    onUp,
    onDown,
    onDownLong,
    onEsc,
    className,
    children,
    ...htmlProps
}, ref) => {
        const fieldRef = useForwardRef<HTMLDivElement>(ref);

        const touchHandler = useSwipe<HTMLDivElement>();

        const callEvent = (event?: () => void) => {
            if (event) {
                event();
            }
        }

        useEffect(() => {
            if (touchHandler.finished) {
                if (Math.abs(touchHandler.delta.x) > Math.abs(touchHandler.delta.y)) {
                    if (touchHandler.delta.x > SWIPE_THRESHOLD) {
                        callEvent(onRight)
                    }
                    if (touchHandler.delta.x < -SWIPE_THRESHOLD) {
                        callEvent(onLeft)
                    }
                } else {
                    if (touchHandler.delta.y > SWIPE_THRESHOLD) {
                        if (touchHandler.delta.y > SWIPE_THRESHOLD * 10) {
                            callEvent(onDownLong)
                        } else {
                            callEvent(onDown)
                        }
                    }
                    else {
                        callEvent(onUp)
                    }
                }
            }
        }, [touchHandler.finished]);

        const keyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
            console.log(e);
            console.log(e);
            if (e.key == 'ArrowUp') {
                callEvent(onUp);
                e.preventDefault();
            }

            if (e.key == 'ArrowLeft') {
                callEvent(onLeft)
                e.preventDefault();
            }

            if (e.key == 'ArrowRight') {
                callEvent(onRight)
                e.preventDefault();
            }

            if (e.key == 'ArrowDown') {
                callEvent(onDown)
                e.preventDefault();
            }

            if (e.key == ' ') {
                callEvent(onDownLong)
                e.preventDefault();
            }

            if (e.key == 'Escape') {
                callEvent(onEsc)
                e.preventDefault();
            }

            if (htmlProps.onKeyDown) {
                htmlProps.onKeyDown(e);
            }
        }


        return (
            <div
                ref={fieldRef}
                className={className}
                tabIndex={0}
                onKeyDown={keyDownHandler}
                {...touchHandler.touchEvents}
                {...htmlProps}
            >
                {children}
            </div>
        )
    }
)
