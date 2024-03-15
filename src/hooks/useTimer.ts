import {useEffect, useRef, useState} from 'react';

export function useTimer(active: boolean, interval: number) {
    const [step, setStep] = useState(0);
    const timerRef = useRef<number>();

    const nextStep = () => {
        setStep((step) => step + 1)
    }

    useEffect(() => {
        if (active) {
            timerRef.current = setInterval(() => {
                nextStep();
            }, interval);
        }
        else {
            clearInterval(timerRef.current);
            timerRef.current = undefined;
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = undefined;
            }
        };
    }, [active]);

    return step;
}
