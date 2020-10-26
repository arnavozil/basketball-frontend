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
            const response = await fetch(`${ENDPOINT}/users`, requestOptions);
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


export const createMatchAction = (id1, id2) => {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const body = JSON.stringify({id1, id2});

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body,
        redirect: 'follow'
    };

    return async dispatch => {
        try {
            const response = await fetch(`${ENDPOINT}/matches/create`, requestOptions);
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

export const updateMatchAction = match => {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const [id1, id2] = match.players;
    const body = JSON.stringify({id1, id2, match});

    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body,
        redirect: 'follow'
    };

    return async dispatch => {
        try {
            const response = await fetch(`${ENDPOINT}/matches/update`, requestOptions);
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