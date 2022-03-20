

import { NextPage } from "next";
import React, { createContext, Fragment, useContext, useEffect, useState } from "react";
import { TOURNAMENTS_ADDITIONAL_INFO } from "../../src/common/constantst";
import { post } from "../../src/common/helpers";
import { TContext } from "../../src/common/tournamentContext";
import { ModalStateEnum, Tournament } from "../../src/common/types";
import Loading from "./loading";
import TournamentForm from "./tournamentForm";

export const EditTournamentContext = createContext((tournament: FormData) => { });
/*
manages tournament editing
*/
const EditTournamentModal = () => {
    const { editTournamentModalState, editableTournamentId, setEditTournamentModalState, setTournamentList, tournamentList } = useContext(TContext);
    if (editTournamentModalState == ModalStateEnum.HIDE) return null;

    async function editTournamentCallback(tournament: FormData) {
        try {
            if (typeof setEditTournamentModalState === "function") setEditTournamentModalState(ModalStateEnum.LOADING);
            const response = await post<FormData>("updateTournament", tournament, false);
            const updatedTournament: Tournament = await response.json();

            const tournamentsAdditionalInfo: Tournament[] = JSON.parse(localStorage.getItem(TOURNAMENTS_ADDITIONAL_INFO) || "[]");
            const tournemantIndex = tournamentsAdditionalInfo.findIndex(s => s.id === updatedTournament.id);

            if (tournemantIndex === -1) {
                tournamentsAdditionalInfo.push(updatedTournament);
            } else {
                tournamentsAdditionalInfo[tournemantIndex] = updatedTournament;
            }

            localStorage.setItem(TOURNAMENTS_ADDITIONAL_INFO, JSON.stringify(tournamentsAdditionalInfo));

            const stateId = tournamentList?.findIndex(s => s.id === updatedTournament.id);
            if (tournamentList && stateId != undefined && stateId >= 0) {
                tournamentList[stateId] = updatedTournament;
                if (typeof setTournamentList === "function") setTournamentList(tournamentList);
            }
        } catch (err) {
            alert(err)
        }

        if (typeof setEditTournamentModalState === "function") setEditTournamentModalState(ModalStateEnum.HIDE);
    };

    function closeModal() {
        if (typeof setEditTournamentModalState === "function") setEditTournamentModalState(ModalStateEnum.HIDE);
    }

    return (
        <Fragment>
            {editTournamentModalState == ModalStateEnum.LOADING ? <Loading /> : null}
            <div id="tournament-edit-panel" className="page-section-container">
                <div className="row">
                    <div className="header left col-12 pb-4">
                        <div className="title-container">
                            <div className="title">Edit Tournament</div>
                            <hr />
                        </div>

                    </div>
                    <div className="body col-12">
                        <TournamentForm onSubmit={editTournamentCallback} initialDataId={editableTournamentId} isAvatarRequired={false} isCoverImageRequired={false}>
                            <div className="col-12">
                                <div className="row">
                                    <div className="form-group col-12">
                                        <div className="row">
                                            <div className="col-6">
                                                <button type="button" onClick={closeModal} className="form-control btn btn-danger btn-block">
                                                    <div className="text">CANCEL</div>
                                                </button>
                                            </div>
                                            <div className="col-6">
                                                <button type="submit" className="form-control btn btn-primary btn-block">
                                                    <div className="text">SAVE</div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TournamentForm>
                    </div>
                </div>
            </div >
            <div className="background-shadow"></div>
        </Fragment>
    );
};

export default EditTournamentModal;
