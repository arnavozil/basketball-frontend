import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import Sound from 'react-sound';
import { updateMatchAction, updateUserAction } from '../../actions';

import s from './Register.module.scss';

const Register = ({
    dispatch, updateM, updateU
}) => {

    const { replace } = useHistory();
    const { state } = useLocation();
    const { playing, initialMatch } = state || {};
    const [canSave, setCanSave] = useState(true);
    const setDefaultScores = () => {
        const obj = {};
        const [p1, p2] = playing;
        obj[p1['id']] = 0;
        obj[p2['id']] = 0;
        return obj;
    }
    
    const [scores, setScores] = useState(setDefaultScores());
    const [gameSaved, setGameSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        if(!initialMatch || !playing?.length){
            replace('/');
        }

        return () => {
            setGameSaved(false);
            setScores(setDefaultScores());
            dispatch({
                type: 'UPDATE_MATCH',
                payload: null
            });
            dispatch({
                type: 'UPDATE_USER',
                payload: null
            });
        }
    }, [initialMatch, playing]);

    useEffect(() => {

        setIsLoading(false);
        if(updateM){
            console.log("done");
            setGameSaved(true);
            // replace('/');
        }else{
            console.log('error');
        }
    }, [updateM]);



    const saveGame = () => {

        setIsLoading(true);
        const [v1, v2] = Object.values(scores); 
        if(!canSave || (!v1 && v1 !== 0) || (!v2 && v2 !== 0) || v1 === v2){
            return;
        };

        setCanSave(false);

        const { id } = initialMatch.match;
        dispatch(updateMatchAction(id, v1, v2));
    }

    const updateScores = (key, value) => setScores({...scores, ...{ [key]: value }});

    return (
        !gameSaved ? <div className={s.main}>
            <Sound 
                url={require('../../assets/sound.mp3')}
                playStatus = 'PLAYING'
            />
            <div>
                <h2>{playing[0]?.firstName}'s Score:</h2>
                <input 
                    onChange = {e => {
                        const { value: v } = e.target;
                        updateScores(playing[0]['id'], v);
                    }}
                    value={scores[playing[0]['id']]}
                />
                <h2>{playing[1]?.firstName}'s Score:</h2>
                <input 
                    value={scores[playing[1]['id']]}
                    onChange={e => {
                        const { value: v } = e.target;
                        updateScores(playing[1]['id'], v);
                    }}
                />
                <button onClick={saveGame}>{
                    !isLoading ? 'Save Game' : 'Saving'
                }</button>
            </div>
        </div> : <div>
            <h4>Game saved, go to leaderboard</h4>
            <Link to={{
                pathname: '/',
                state: {
                    initialMatch: null,
                    playing: null
                }
            }}>Leaderboard</Link>
        </div>
    );
};

const matchStateToProps = (state) => {

    const { updateUser, updateMatch } = state;
    return {
        updateU: updateUser,
        updateM: updateMatch
    };
}

export default connect(matchStateToProps)(Register);