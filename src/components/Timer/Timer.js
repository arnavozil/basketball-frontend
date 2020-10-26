import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';


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

    const { playing } = state || {};
    const changeValue = (val) => {

        val = +val;
        if(!val || val < MINIMUM || val > MAXIMUM){
            val = 0;
        };
        setInitialValue(val);
        // setInitialValue(.1);
    };

    useEffect(() => {

        if(!createMatch || !playing?.length){
            replace('/');
        }
        return () => {
            dispatch({
                type: 'CREATE_SINGLE_MATCH',
                payload: null
            })
        }
    }, [createMatch, state]);

    useEffect(() => {

        if(isFinished){
            stopTimer();
            // send to a screen where the match can be saved
            push({
                pathname: '/register',
                state: {
                    initialMatch: createMatch,
                    playing: state.playing
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

    const startTimer = () => {
        
        const seconds = initialValue * 60;
        const currentSeconds = Math.floor(new Date().getTime() / 1000);

        setEndTime(currentSeconds + seconds);
        // setEndTime(currentSeconds + 2);
        setStartTime(currentSeconds);
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

    return(
        <div>
            <h1>
                {playing?.length === 2 ? `${playing[0]?.firstName} VS ${playing[1]?.firstName}` : <></>}
            </h1>
            <h3>
                Win Probability
            </h3>
            {createMatch?.matches ? <><p>
                Out of the {createMatch?.wonByFirst + createMatch?.wonBySecond} matches played, {playing.find(el => el.id === createMatch?.players[0])?.firstName} has won {createMatch?.wonByFirst} and {playing.find(el => el.id === createMatch?.players[1])?.firstName} has won {createMatch?.wonBySecond}
            </p>
            <p>
                {playing.find(el => el.id === createMatch?.players[0])?.firstName} has scored {createMatch?.scoredByFirst} points against {playing.find(el => el.id === createMatch?.players[1])?.firstName} while, {playing.find(el => el.id === createMatch?.players[1])?.firstName} have scored {createMatch?.scoredBySecond} points against {playing.find(el => el.id === createMatch?.players[0])?.firstName}
            </p>
            <h3>Expected Scoreline:</h3>
            <p>{playing.find(el => el.id === createMatch?.players[0])?.firstName}: {createMatch?.scoredByFirst / createMatch?.matches}</p>
            <p>{playing.find(el => el.id === createMatch?.players[1])?.firstName}: {createMatch?.scoredBySecond / createMatch?.matches}</p>
            <h3>Winner Odds:</h3>
            <p>{playing.find(el => el.id === createMatch?.players[0])?.firstName}: {(createMatch?.wonByFirst || 1)} / {((createMatch?.matches - createMatch?.wonByFirst) || 1)}</p>
            <p>{playing.find(el => el.id === createMatch?.players[1])?.firstName}: {(createMatch?.wonBySecond || 1)} / {((createMatch?.matches - createMatch?.wonBySecond))}</p>
            </> : <p>Its your first game, win probability is available from second game.</p>}

            <input 
                placeholder='Time in minutes'
                value={initialValue}
                readOnly={!!startTime}
                onChange={e => changeValue(e.target.value)}
            />
            <button onClick={startTimer}>
                Start
            </button>
            <p>
                If the actual match duration is n minutes, choose n+1 minutes here, the extra minute can then be used as extra (injury) time
            </p>
            {startTime ? <>
                <button onClick={pauseTimer}>{isPaused ? 'Resume' : 'Pause'}</button>
                <button onClick={stopTimer}>Stop</button>
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