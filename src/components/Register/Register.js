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

        if(updateU === null || updateM === null){
            return;
        }
        if(updateM?.success && updateU?.success){
            console.log("done");
            setGameSaved(true);
            // replace('/');
        }else{
            console.log('error');
        }
    }, [updateU, updateM]);

    const updateMatchData = () => {

        const aligned = initialMatch?.players[0] === playing[0]['id'];
        const copy = JSON.parse(JSON.stringify(initialMatch));
        copy.matches++;
        const [score1, score2] = Object.values(scores);
        if(aligned){
            copy.scoredByFirst += +score1;
            copy.scoredBySecond += +score2;
            if(score1 > score2){
                copy.wonByFirst++;
            }else{
                copy.wonBySecond++;
            }
        }else{
            copy.scoredByFirst += +score2;
            copy.scoredBySecond += +score1;
            if(score1 > score2){
                copy.wonBySecond++;
            }else{
                copy.wonByFirst++;
            }
        }
        
        return copy;
    };

    const updateUserData = () => {
        const copy = playing.slice();

        copy.forEach(el => {
            el.matches++;
        })
        const score1 = scores[playing[0]['id']];
        const score2 = scores[playing[1]['id']];

        copy[0].scored += +score1;
        copy[0].conceded += +score2;
        copy[1].scored += +score2;
        copy[1].conceded += +score1;

        if(score1 > score2){
            copy[0].won++;
            copy[0].points += 3;

            copy[1].lost++;
        }else{
            copy[1].won++;
            copy[1].points += 3;

            copy[0].lost++;
        };

        return copy;
    }

    const saveGame = () => {

        const [v1, v2] = Object.values(scores); 
        if(!canSave || (!v1 && v1 !== 0) || (!v2 && v2 !== 0) || v1 === v2){
            return;
        };

        setCanSave(false);

        const [u1, u2] = updateUserData();
        const updatedMatch = updateMatchData();

        dispatch(updateUserAction(u1));
        dispatch(updateUserAction(u2));
        dispatch(updateMatchAction(updatedMatch));
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
                <button onClick={saveGame}>Save Match</button>
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