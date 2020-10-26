import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { allPlayersAction, createMatchAction } from '../../actions';
import { useHistory } from 'react-router-dom';

import s from './Players.module.scss';

const Players = ({
    dispatch, 
    allPlayers,
    createMatch
}) => {

    const { push } = useHistory();
    const [participants, setParticipants] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        dispatch(allPlayersAction());

        return () => {
            setSelectedPlayers([]);
            setIsLoading(false);
            setParticipants([]);
        }
    }, []);

    useEffect(() => {
        setParticipants(allPlayers);
    }, [allPlayers]);

    useEffect(() => {
        if(createMatch){
            push({
                pathname: '/match',
                state: {
                    playing: allPlayers.filter(el => selectedPlayers.includes(el.id))
                }
            });
        }
    }, [createMatch])

    const selectPlayer = (id) => {

        if(selectedPlayers.includes(id)){
            setSelectedPlayers(selectedPlayers.filter(el => el !== id));
        }else{
            if(selectedPlayers.length === 2){
                return;
            }
            setSelectedPlayers(selectedPlayers.concat([id]));
        }
    }

    const startMatch = () => {
        if(isLoading){
            return;
        };
        const [id1, id2] = selectedPlayers;
        setIsLoading(true);
        console.log('inside');

        dispatch(createMatchAction(id1, id2));
    }

    return (
        <main className={s.main}>
            <h1>LeaderBoard</h1>
            {(participants || []).sort((a, b) => (b.points || 0) - (a.points || 0)).map(el => {
                let { matches, won, lost, points, username, firstName, id, scored, conceded } = el;
                // lost = 4; won = 7; matches = 11; scored = 14; conceded = 9; points = 14;
                return (
                    <div style={selectedPlayers.includes(id) ? {backgroundColor: 'springgreen'} : {}} onClick={() => selectPlayer(id)} className={s.main_card} key={id}>
                        <span className={s.main_card_text}>{username}</span>
                        <span className={s.main_card_text}>Win %: {((won / (matches || 1)) * 100).toFixed(2)}</span>
                        <span className={s.main_card_text}>Matches Won/Lost: {won}/{lost}</span>
                        <div className={s.main_card_seek}>
                            <span className={s.main_card_seek_won} style={{width: `${(won/(matches || 1))*100}%`}} />
                            <span className={s.main_card_seek_lost} style={{width: `${(lost/(matches || 1))*100}%`, left: `${(won/(matches || 1))*100}%`}} />
                        </div>
                        <span className={s.main_card_text}>Points scored/conceded: {scored}/{conceded}</span>
                        <div className={s.main_card_seek}>
                            <span className={s.main_card_seek_won} style={{width: `${(scored/((scored+conceded) || 1))*100}%`}} />
                            <span className={s.main_card_seek_lost} style={{width: `${(conceded/((scored+conceded) || 1))*100}%`, left: `${(scored/((scored+conceded) || 1))*100}%`}} />
                        </div>
                        <span className={s.main_card_text}>Total match points: {points}</span>
                        <span className={s.main_card_text}>Average Points: {points / (matches || 1)}</span>
                    </div>
                )
            })}
            {selectedPlayers.length === 2 ? <button onClick={startMatch}>Start</button> : <></>}
        </main>
    );
};

const matchStateToProps = (state = {}) => {

    const { allPlayers, createMatch } = state;
    return {
        allPlayers,
        createMatch
    };
}

export default connect(matchStateToProps)(Players);