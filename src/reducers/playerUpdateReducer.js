export const playerUpdateReducer = (state = null, { type, payload }) => {
    switch (type) {
        case "UPDATE_USER":
            return payload;
    
        default:
            return state;
    }
};

export const matchUpdateReducer = (state = null, { type, payload }) => {
    switch (type) {
        case "UPDATE_MATCH":
            return payload;
    
        default:
            return state;
    }
};