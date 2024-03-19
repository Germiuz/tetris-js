import {useCallback, useEffect, useState} from 'react';
import {SimpleEventObserver} from '@app/utils/eventObserver';


type StorageChangeEvent = {sender: Storage; key: string; value: unknown;};
const storageEventObserver = new SimpleEventObserver<StorageChangeEvent>();

type UseStorageHook = (storage: Storage) => <T>(key: string, defaultValue: T) => [T, (v: T) => void, () => void];
const getUseStorageHook: UseStorageHook = (storage) => (key, defaultValue) => {
    const data = storage.getItem(key);

    const [value, setValue] = useState(data ? JSON.parse(data) : defaultValue);

    const updateValue = useCallback(
        (newValue: unknown) => {
            storage.setItem(key, JSON.stringify(newValue));
            storageEventObserver.dispatch({sender: storage, key, value: newValue});
        },
        [key]
    );

    const deleteValue = useCallback(
        () => {
            storage.removeItem(key);
            storageEventObserver.dispatch({sender: storage, key, value: null});
        },
        [key]
    );

    if (defaultValue && !data) {
        updateValue(defaultValue);
    }

    const handelStorageChange = (event: StorageChangeEvent) => {
        if (storage === event.sender && key === event.key) {
            setValue(event.value);
        }
    };

    useEffect(() => {
        storageEventObserver.subscribe(handelStorageChange);

        return () => {
            storageEventObserver.unsubscribe(handelStorageChange);
        };

    }, [storage, key]);


    return [value, updateValue, deleteValue];
};

const useLocalStorage = getUseStorageHook(window.localStorage);
const useSessionStorage = getUseStorageHook(window.sessionStorage);

export {useLocalStorage, useSessionStorage};
