type MS = number;

export function debounce(callbackFn: Function, wait: MS) {
    let timeout: ReturnType<typeof setTimeout>;
    return function(...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => callbackFn.apply(this, args), wait);
    };
}