import { API_STRING, LOCAL_API_STING } from "../strings";

const ENDPOINT = process.env.NODE_ENV === 'development' ? LOCAL_API_STING : API_STRING;

export const allPlayersAction = () => {

    const requestOptions = {
        method: 'GET',
        redirect: 'follow',
        credentials: 'include'
    };

    return async dispatch => {
        try {
            const response = await fetch(`${ENDPOINT}/common/all`, requestOptions);
            const payload = await response.json();
            dispatch({
                type: 'ALL_PLAYERS',
                payload
            });
        } catch (error) {
            dispatch({
                type: 'ALL_PLAYERS',
                payload: []
            });
        };
    };
    
};


export const createMatchAction = ({id1, id2, startTime, endTime}) => {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const body = JSON.stringify({
        "player1":id1,
        "player2":id2,
        "startedAt": startTime,
        "endsAt": endTime
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body,
        redirect: 'follow'
    };

    return async dispatch => {
        try {
            const response = await fetch(`${ENDPOINT}/matches/startMatch`, requestOptions);
            const payload = await response.json();
            dispatch({
                type: 'CREATE_SINGLE_MATCH',
                payload
            })
        } catch (err) {
            dispatch({
                type: 'CREATE_SINGLE_MATCH',
                payload: null
            });
        };
    };
};

export const updateUserAction = obj => {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const { id } = obj;

    const body = JSON.stringify(obj);

    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body,
        redirect: 'follow'
    };

    return async dispatch => {
        try {
            const response = await fetch(`${ENDPOINT}/users/update?id=${id}`, requestOptions);
            const payload = await response.json();
            dispatch({
                type: 'UPDATE_USER',
                payload
            })
        } catch (err) {
            dispatch({
                type: 'UPDATE_USER',
                payload: null
            })
        }
    }
};

export const updateMatchAction = (id, v1, v2) => {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const body = JSON.stringify({id, scoredByFirst: v1, scoredBySecond: v2});

    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body,
        redirect: 'follow'
    };

    return async dispatch => {
        try {
            const response = await fetch(`${ENDPOINT}/matches/saveMatch`, requestOptions);
            const payload = await response.json();
            dispatch({
                type: 'UPDATE_MATCH',
                payload
            }) 
        } catch (err) {
            dispatch({
                type: 'UPDATE_MATCH',
                payload: null
            });            
        };
    };
};