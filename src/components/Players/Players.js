import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { allPlayersAction } from '../../actions';
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
        setParticipants((allPlayers || []).sort((a, b) => (b.points || 0) - (a.points || 0)));
    }, [allPlayers]);


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

        push({
            pathname: '/match',
            state: {
                selectedPlayers,
                playerNames: participants.filter(el => selectedPlayers.includes(el.id)).sort((a, b) => selectedPlayers.indexOf(a.id) - selectedPlayers.indexOf(b.id))
            }
            
        });
    };
    
    console.log(participants);
    const renderModel = (player = {}, pos = 1, styles) => {

        const { points, username, firstName, avatar } = player;
        return (
            <div className={s.board_item}>
                <div style={{
                    ...styles,
                    backgroundImage: `url(${avatar})`
                }} className={s.board_item_circle}>
                    {!avatar ? username[0] : ''}
                    <span className={s.board_item_circle_pos}>{pos}</span>
                </div>
                <div className={s.board_item_name}>{firstName}</div>
                <div className={s.board_item_points}>{points} points</div>
            </div>
        )
    };

    const renderLeaders = (members = []) => {

        if(members?.length !== 3){
            return;
        }

        return (
            <div className={s.board}>
                {renderModel(members[1], 2, {width: '5rem', height: '5rem'})}
                {renderModel(members[0])}
                {renderModel(members[2], 3, {width: '4rem', height: '4rem'})}
            </div>
        )
    }

    return (
        <main className={s.main}>
            <h1 className={s.main_heading}>LeaderBoard</h1>
            {renderLeaders(participants.slice(0, 3))}
            {participants.map(el => {
                let { matches, won, lost, points, firstName, id, scored, conceded } = el;
                // lost = 4; won = 7; matches = 11; scored = 14; conceded = 9; points = 14;
                return (
                    <div style={selectedPlayers.includes(id) ? {backgroundColor: '#c9f2e3'} : {}} onClick={() => selectPlayer(id)} className={s.main_card} key={id}>
                        <span className={s.main_card_head}>{firstName}</span>
                        <span className={s.main_card_win}>Win percentage: {((won / (matches || 1)) * 100).toFixed(2)}%</span>
                        <h3 className={s.main_card_heading}>Matches</h3>
                        <div className={s.main_card_row}>
                            <span className={s.main_card_row_text}>Won: {won}</span>
                            <span className={s.main_card_row_text}>Lost: {lost}</span>
                        </div>
                        <div className={s.main_card_seek}>
                            <span className={s.main_card_seek_won} style={{width: `${(won/(matches || 1))*100}%`}} />
                            <span className={s.main_card_seek_lost} style={{width: `${(lost/(matches || 1))*100}%`, left: `${(won/(matches || 1))*100}%`}} />
                        </div>
                        <h3 className={s.main_card_heading}>Points</h3>
                        <div className={s.main_card_row}>
                            <span className={s.main_card_row_text}>Scored: {scored}</span>
                            <span className={s.main_card_row_text}>Conceded: {conceded}</span>
                        </div>
                        <div className={s.main_card_seek}>
                            <span className={s.main_card_seek_won} style={{width: `${(scored/((scored+conceded) || 1))*100}%`}} />
                            <span className={s.main_card_seek_lost} style={{width: `${(conceded/((scored+conceded) || 1))*100}%`, left: `${(scored/((scored+conceded) || 1))*100}%`}} />
                        </div>
                        <div className={s.main_card_row}>
                            <span className={s.main_card_row_text}>Total match points: {points}</span>
                            <span className={s.main_card_row_text}>Average Points: {(points / (matches || 1)).toFixed(2)}</span>
                        </div>
                    </div>
                )
            })}
            {selectedPlayers.length === 2 ? <button className={s.button} onClick={startMatch}>
                {!isLoading ? 'Start' : 'Setting Up'}
            </button> : <></>}
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