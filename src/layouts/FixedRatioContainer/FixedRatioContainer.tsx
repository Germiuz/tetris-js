import React, {ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';

import styles from './FixedRatioContainer.module.css'
import classNames from 'classnames';
import {HTMLDivExtension} from '@app/layouts/types.ts';

type Align = 'center' | 'start' | 'end';
const VerticalAlignStylesMap: Record<Align, string> = {
    start: styles.vAlignStart,
    end: styles.vAlignEnd,
    center: styles.vAlignCenter,
}

const HorizontalAlignStylesMap: Record<Align, string> = {
    start: styles.hAlignStart,
    end: styles.hAlignEnd,
    center: styles.hAlignCenter,
}

export const FixedRatioContainer: React.FC<HTMLDivExtension<{
    readonly ratio?: number;
    readonly verticalAlign?: Align;
    readonly horizontalAlign?: Align;
    readonly children: ReactNode;
}>> = ({
    className,
    ratio,
    verticalAlign,
    horizontalAlign,
    children,
    ...htmlProps
}) => {
    const containerWrapper = useRef<HTMLDivElement>(null);

    const [forceEvent, setForceEvent] = useState(0);

    const {width, height} = useMemo(() => {
        const containerWrapperWidth = containerWrapper.current?.clientWidth || 0;
        const containerWrapperHeight = containerWrapper.current?.clientHeight || 0;

        const aspectRatio = ratio || 1;

        const width = Math.min(containerWrapperWidth, containerWrapperHeight * aspectRatio);
        const height = Math.min(containerWrapperHeight, containerWrapperWidth / aspectRatio);

        return {width, height}
    }, [forceEvent]);

    const onResize = () => {
        setForceEvent((forceEvent) => forceEvent + 1);
    };

    useEffect(() => {
        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('orientationchange', onResize);
        };
    }, []);

    useLayoutEffect(() => {
        setForceEvent(forceEvent + 1);
    }, [containerWrapper.current?.clientWidth, containerWrapper.current?.clientHeight, ratio]);

    const composedClassName = classNames(
        className,
        styles.containerWrapper,
        horizontalAlign && HorizontalAlignStylesMap[horizontalAlign],
        verticalAlign && VerticalAlignStylesMap[verticalAlign]
    )

    return (
        <div
            className={composedClassName}
            ref={containerWrapper}
            {...htmlProps}
        >
            <div
                style={{width, height}}
                className={styles.container}
            >
                {children}
            </div>
        </div>
    );
};
