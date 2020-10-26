const createMatchReducer = (state = null, { type, payload }) => {

    switch (type) {
        case "CREATE_SINGLE_MATCH":
            return payload;
        default:
            return state;
    };

};

export default createMatchReducer;