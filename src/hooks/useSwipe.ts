import {TouchEvent, TouchEventHandler, useState} from 'react';

interface Point {
    readonly x: number;
    readonly y: number;
}

interface DragState {
    readonly finished: boolean;
    readonly startPoint: Point;
    readonly delta: Point;
}

const point = (touchPoint: {pageX: number; pageY: number;}) => ({x: touchPoint.pageX, y: touchPoint.pageY});
const zeroPoint = () => ({x: 0, y: 0});
const pointDelta = (pointFrom: Point, pointTo: Point) => ({x: pointTo.x - pointFrom.x, y: pointTo.y - pointFrom.y});

export function useSwipe<T>() {
    const [touchState, setTouchState] = useState<DragState>({
        finished: false,
        startPoint: zeroPoint(),
        delta: zeroPoint()
    });

    const onTouchStart: TouchEventHandler<T> = (event: TouchEvent<T>) => {
        setTouchState({finished: false, delta: zeroPoint(), startPoint: point(event.touches[0])});
    }

    const onTouchMove: TouchEventHandler<T> = (event: TouchEvent<T>) => {
        if (!touchState.finished) {
            setTouchState((prevState) => ({
                ...prevState,
                delta: pointDelta(prevState.startPoint, point(event.touches[0]))
            }));
        }
    };

    const onTouchEnd: TouchEventHandler<T> = (event: TouchEvent<T>) => {
        setTouchState(prevState => ({...prevState, finished: true}));
    }

    return {
        touchEvents: {
            onTouchStart,
            onTouchMove,
            onTouchEnd
        },
        finished: touchState.finished,
        delta: touchState.delta
    };
}
