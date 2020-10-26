const allPlayerReducer = (state = [], { type, payload }) => {

    switch (type) {
        case "ALL_PLAYERS":
            return payload;
    
        default:
            return state;
    };
};

export default allPlayerReducer;