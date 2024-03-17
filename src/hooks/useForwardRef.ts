import {Ref, useEffect, useRef} from 'react';

export function useForwardRef<T>(forwardedRef: Ref<T>) {
    const targetRef = useRef<T>(null);

    useEffect(() => {
        if (!forwardedRef) return;

        if (typeof forwardedRef === 'function') {
            forwardedRef(targetRef.current);
        } else {
            (forwardedRef.current as T | null) = targetRef.current;
        }
    }, [forwardedRef]);

    return targetRef;
}
