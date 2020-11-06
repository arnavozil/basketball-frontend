import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { createMatchAction } from '../../actions';


import s from './Timer.module.scss';

const MAXIMUM = 20;
const MINIMUM = 1;
const DEFUALT = 1;

const Timer = ({
    createMatch,
    dispatch
}) => {

    const { replace, push } = useHistory();
    const { state } = useLocation();
    const [initialValue, setInitialValue] = useState(DEFUALT);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isFinished, setIsFinshed] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [matchData, setMatchData] = useState({});

    const { selectedPlayers, playerNames } = state || {};
    const changeValue = (val) => {

        val = +val;
        if(!val || val < MINIMUM || val > MAXIMUM){
            val = 0;
        };
        setInitialValue(val);
        // setInitialValue(.1);
    };

    useEffect(() => {

        if(!selectedPlayers?.length || !playerNames?.length){
            replace('/');
        }
        return () => {
            dispatch({
                type: 'CREATE_SINGLE_MATCH',
                payload: null
            })
        }
    }, [state]);

    useEffect(() => {

        if(isFinished){
            stopTimer();
            // send to a screen where the match can be saved
            push({
                pathname: '/register',
                state: {
                    playing: playerNames,
                    initialMatch: createMatch
                }
            })
        }
    }, [isFinished]);

    useEffect(() => {
        
        if(!startTime || isFinished || isPaused){
            return;
        };

        if(timeElapsed >= endTime - startTime){
            setIsFinshed(true);
        };

        const interval = setTimeout(() => {
            
            setTimeElapsed(timeElapsed + 1);
        }, 1000);

        return () => clearTimeout(interval);
    }, [startTime, endTime, isFinished, timeElapsed, isPaused]);

    useEffect(() => {
        setMatchData(createMatch);
        console.log(createMatch);
    }, [createMatch])

    useEffect(() => {
        setIsLoading(false);
    }, [isFinished]);

    const startTimer = () => {
        
        setIsLoading(true);
        const seconds = initialValue * 60;
        const currentSeconds = Math.floor(new Date().getTime() / 1000);

        const [id1, id2] = selectedPlayers;
        setEndTime(currentSeconds + seconds);
        // setEndTime(currentSeconds + 2);
        setStartTime(currentSeconds);
        dispatch(createMatchAction({
            id1, id2, 
            startTime: currentSeconds, 
            endTime: currentSeconds + seconds
        }));
    };

    const pauseTimer = () => {
        setIsPaused(!isPaused);
    };

    const stopTimer = () => {
        setInitialValue(DEFUALT);
        setStartTime(null);
        setEndTime(null);
        setTimeElapsed(0);
        setIsFinshed(false);
        setIsPaused(false);
    }

    const { match = {} } = createMatch || {};
    return(
        <div>
            <h1>
                {playerNames?.length === 2 ? `${playerNames[0]?.firstName} VS ${playerNames[1]?.firstName}` : <></>}
            </h1>
            {!endTime ? <p>Win Probability and other stats are available once you start the match</p> : <></>}
            <h3>
                Win Probability
            </h3>
            {Object.keys((match || {})).length ? <><p>
                Out of the {match.matches} matches played, {match[selectedPlayers[0]].name} has won {match[selectedPlayers[0]].won} and {match[selectedPlayers[1]].name} has won {match[selectedPlayers[1]].won}
            </p>
            <p>
                {match[selectedPlayers[0]].name} has scored {match[selectedPlayers[0]].scored} points against {match[selectedPlayers[1]].name} while, {match[selectedPlayers[1]].name} have scored {match[selectedPlayers[1]].scored} points against {match[selectedPlayers[0]].name}
            </p>
            <h3>Expected Scoreline:</h3>
            <p>{match[selectedPlayers[0]].name}: {Math.ceil(match[selectedPlayers[0]].scored / (match.matches || 1))}</p>
            <p>{match[selectedPlayers[1]].name}: {Math.ceil(match[selectedPlayers[1]].scored / (match.matches || 1))}</p>
            <h3>Winner Probability:</h3>
            <p>{match[selectedPlayers[0]].name}: {match[selectedPlayers[0]].winProbability}</p>
            <p>{match[selectedPlayers[1]].name}: {match[selectedPlayers[1]].winProbability}</p>
            </> : <p>Its your first game, win probability is available from second game.</p>}

            <input 
                placeholder='Time in minutes'
                value={initialValue}
                readOnly={!!startTime}
                onChange={e => changeValue(e.target.value)}
            />
            <button disabled={startTime && endTime} onClick={startTimer}>
                {!isLoading ? 'Start' : 'Game On'}
            </button>
            <p>
                If the actual match duration is n minutes, choose n+1 minutes here, the extra minute can then be used as extra (injury) time
            </p>
            {startTime ? <>
                <button onClick={pauseTimer}>{isPaused ? 'Resume' : 'Pause'}</button>
                <button onClick={stopTimer}>Stop</button>
                <button onClick={() => setIsFinshed(true)}>Finish</button>
            </> : <></>}
            <p>{Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s</p>
            <div className={s.timeBand}>
                <span style={{width: `${(timeElapsed / (endTime - startTime)) * 100 || 0}%`}} className={s.timeBand_timer} />
            </div>
            {isFinished && <>Time's up</>}
        </div>
    );
};

const matchStateToProps = (state = {}) => {

    const { createMatch } = state;
    return {
        createMatch
    };
}

export default connect(matchStateToProps)(Timer);