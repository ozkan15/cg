import { useApolloClient } from '@apollo/client';
import { createContext, Fragment, useContext, useEffect, useState } from 'react';
import { DELETED_TOURNAMENTS, TOURNAMENTS_ADDITIONAL_INFO } from '../../src/common/constantst';
import { post, toDateString } from '../../src/common/helpers';
import GET_TOURNAMENTS from '../../src/common/query';
import { TContext } from '../../src/common/tournamentContext';
import { Entity, ModalParameters, ModalStateEnum, NotificationTypeEnum, Tournament } from '../../src/common/types';
import styles from '../../styles/card.module.scss';
import EditTournamentModal from './editTournamentModal';
import Modal from './modal';

/*
tournament card in the list
*/
const Card = (props: { tournament: Tournament }) => {
    const client = useApolloClient();
    const { tournamentList, setTournamentList, setEditTournamentModalState, setEditableTournamentId,
        lastReadItemIndex, setLastReadItemIndex } = useContext(TContext);

    useEffect(() => {
        setDeleteModalState({ ...deleteModalState, onConfirmation: deleteTournament });
    }, [lastReadItemIndex, tournamentList])

    const [deleteModalState, setDeleteModalState] = useState<ModalParameters>({
        visibility: false,
        title: "Warning",
        type: NotificationTypeEnum.WARNING,
        message: "Do you confirm?",
        onConfirmation: deleteTournament,
        onCancel: cancelDelete
    });

    function deleteTournament() {
        try {
            client.cache.updateQuery<Entity>({
                query: GET_TOURNAMENTS,
                variables: { count: -1, offset: -1 }
            }, (data) => {
                const newList = data?.listedTournaments?.slice() || [];
                const index = newList.findIndex(s => s.id == props.tournament.id);

                if (index !== undefined && index >= 0) {
                    newList.splice(index, 1);
                }

                return {
                    listedTournaments: newList
                };
            });

            const deleteIndex = tournamentList?.findIndex(s => s.id === props.tournament.id);
            if (deleteIndex !== -1) {
                const deletedTournaments: string[] = JSON.parse(localStorage.getItem(DELETED_TOURNAMENTS) || "[]");
                deletedTournaments.push(props.tournament.id as string);
                localStorage.setItem(DELETED_TOURNAMENTS, JSON.stringify(deletedTournaments));
            }

            setLastReadItemIndex(lastReadItemIndex + 1);
        } catch (err) {
        }

        setDeleteModalState({ ...deleteModalState, visibility: false });
    }

    function editTournamentModalStateHandler() {
        if (typeof setEditTournamentModalState === "function" && typeof setEditableTournamentId === "function") {
            setEditTournamentModalState(ModalStateEnum.SHOW);
            setEditableTournamentId(props.tournament.id || "");
        }
    }

    function deleteConsent() {
        setDeleteModalState({ ...deleteModalState, visibility: true });
    };

    function updateVote(type: string) {
        try {
            const newList = tournamentList?.slice() || [];
            const tournamentState = newList?.find(s => s.id == props.tournament.id) as Tournament;
            const tournamentsAdditionalInfo: Tournament[] = JSON.parse(localStorage.getItem(TOURNAMENTS_ADDITIONAL_INFO) || "[]");
            const tournamentInfoIndex = tournamentsAdditionalInfo.findIndex(s => s.id == props.tournament.id);
            let voted = false;

            if (tournamentInfoIndex === -1) {
                const newInfo = { ...tournamentState, vote: 0 };
                tournamentsAdditionalInfo.push(newInfo);
                if (type === "increment") {
                    newInfo.vote++;
                    newInfo.lastVoteTime = toDateString(new Date());
                    voted = true;
                }
            } else {
                if (type === "increment") {
                    tournamentsAdditionalInfo[tournamentInfoIndex].vote++;
                    voted = true;
                } else if (tournamentsAdditionalInfo[tournamentInfoIndex].vote > 0) {
                    tournamentsAdditionalInfo[tournamentInfoIndex].vote--;
                    voted = true;
                }

                tournamentsAdditionalInfo[tournamentInfoIndex].lastVoteTime = toDateString(new Date());
            }

            if (voted) localStorage.setItem(TOURNAMENTS_ADDITIONAL_INFO, JSON.stringify(tournamentsAdditionalInfo));
            if (typeof setTournamentList === "function") setTournamentList(newList);
        } catch (err) {

        }
    };

    function cancelDelete() {
        setDeleteModalState({ ...deleteModalState, visibility: false });
    }

    const tournamentsInfo: Tournament[] = JSON.parse(localStorage.getItem(TOURNAMENTS_ADDITIONAL_INFO) || "[]");
    const tournamentInfo = tournamentsInfo.find(s => s.id == props.tournament.id);
    const actualTournamentInfo = tournamentInfo || props.tournament; 

    return <Fragment>
        <Modal payload={deleteModalState} />
        <div className={`${styles.card} card-container`}>
            <div className={styles.cardHeader}>
                <div className={styles.voteBox}>
                    <div id={styles.num}>{actualTournamentInfo?.vote || 0}</div>
                    <div>VOTE</div>
                </div>
                <img className="card-img-top" src={actualTournamentInfo?.coverImage || actualTournamentInfo?.owner.avatar} alt="avatar" />
            </div>

            <div className="card-body color-white">
                <div className={styles.cardTitle}>{actualTournamentInfo?.name || ""}</div>
                <div>Owner: {actualTournamentInfo?.owner.username}</div>
                <div>Deadline: {actualTournamentInfo?.deadline ? new Date(actualTournamentInfo?.deadline).toLocaleString() : ""}</div>
                <div>Last Vote Time: {actualTournamentInfo?.lastVoteTime}</div>
            </div>
            <div className={styles.cardFooter}>
                <div>
                    <div className="btn-group mr-2" role="group" aria-label="First group">
                        <button type="button" onClick={() => updateVote("increment")} className="btn btn-primary">
                            <i className="fa fa-arrow-up"></i>
                        </button>
                        <button type="button" onClick={() => updateVote("decrement")} className="btn btn-primary">
                            <i className="fa fa-arrow-down"></i>
                        </button>
                    </div>
                </div>
                <div>
                    <div className="btn-group mr-2" role="group" aria-label="First group">
                        <button type="button" onClick={deleteConsent} className="btn btn-danger show-on-hover">DELETE</button>
                        <button type="button" onClick={editTournamentModalStateHandler} className="btn btn-secondary">UPDATE</button>
                    </div>
                </div>
            </div>
        </div >
    </Fragment>;
};

export default Card;