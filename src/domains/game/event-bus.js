const listeners = new Map();

function on(eventName, handler) {
    const handlers = listeners.get(eventName) ?? [];
    handlers.push(handler);
    listeners.set(eventName, handlers);
}

function emit(eventName, detail) {
    const handlers = listeners.get(eventName);

    if (!handlers) {
        return;
    }

    for (const handler of [...handlers]) {
        handler(detail);
    }
}

const eventBus = {
    on,
    emit,
};

export default eventBus;
