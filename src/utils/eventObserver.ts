export type SimpleEventHandler<T> = (event: T) => void;
export class SimpleEventObserver<T> {
    handlers = new Map();

    subscribe(handler: SimpleEventHandler<T>) {
        this.handlers.set(handler, handler);
    }

    unsubscribe(handler: SimpleEventHandler<T>) {
        this.handlers.delete(handler);
    }

    dispatch(data?: T) {
        this.handlers.forEach((handler) => {
            handler(data);
        });
    }
}
