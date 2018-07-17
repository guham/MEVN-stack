export const onFulfilled = response => response;

export const onRejected = e => (e.response ? Promise.reject(e.response) : Promise.reject(e));
