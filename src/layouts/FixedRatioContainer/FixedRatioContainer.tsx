import React, {ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';

import styles from './FixedRatioContainer.module.css'
import classNames from 'classnames';
import {HTMLDivExtension} from '@app/layouts/types.ts';



export const FixedRatioContainer: React.FC<HTMLDivExtension<{
    readonly ratio?: number;
    readonly children: ReactNode;
}>> = ({
    className,
    ratio,
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

    return (
        <div
            className={classNames(className, styles.containerWrapper)}
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
