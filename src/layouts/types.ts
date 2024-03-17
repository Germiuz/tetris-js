import {HTMLAttributes} from 'react';

export type HTMLExtension<E, T = object> = HTMLAttributes<E> & T;
export type HTMLDivExtension<T = object> = HTMLExtension<HTMLDivElement, T>;
export type HTMLSpanExtension<T = object> = HTMLExtension<HTMLSpanElement, T>;
