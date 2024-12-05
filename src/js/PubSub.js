const PubSub = (function() {
    let subscribers = {};

    const subscribe = function(eventId, fn) {
        if (!(eventId in subscribers)) {
            subscribers[eventId] = [];
        }

        subscribers[eventId].push(fn);
    };

    const unsubscribe = function(eventId, fn) {
        if (eventId in subscribers) {
            const idx = subscribers[eventId].indexOf(fn);
            if (idx !== -1) {
                subscribers[eventId].splice(idx, 1);
            }
        }
    }

    const publish = function(eventId, data) {
        if (eventId in subscribers) {
            subscribers[eventId].forEach(fn => {
                fn(data);
            });
        }
    }

    return { subscribe, unsubscribe, publish };
})();

export default PubSub;