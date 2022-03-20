import { gql, useApolloClient } from "@apollo/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { TOURNAMENTS_ADDITIONAL_INFO } from "../src/common/constantst";
import { post } from "../src/common/helpers";
import GET_TOURNAMENTS from "../src/common/query";
import { Entity, Tournament } from "../src/common/types";
import BottomNav from "./Components/buttomNav";
import Header from "./Components/header";
import Loading from "./Components/loading";
import TournamentForm from "./Components/tournamentForm";
/*
tournament create page
*/
const Create: NextPage = () => {
    const client = useApolloClient();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const addNewTournament = async (tournament: FormData) => {
        setLoading(true);
        const response = await post<FormData>("addTournament", tournament, false);
        const newTournament = await response.json() as Tournament;

        client.cache.updateQuery<Entity>({
            query: GET_TOURNAMENTS,
            variables: { offset: -1, count: -1 }
        }, (data) => {
            return ({
                listedTournaments: [newTournament, ...data?.listedTournaments || []]
            })
        });

        const tournamentsAdditionalInfo: Tournament[] = JSON.parse(localStorage.getItem(TOURNAMENTS_ADDITIONAL_INFO) || "[]");
        tournamentsAdditionalInfo.push(newTournament);
        localStorage.setItem(TOURNAMENTS_ADDITIONAL_INFO, JSON.stringify(tournamentsAdditionalInfo));

        router.push("/");
        setLoading(false);
    };

    return (
        <Fragment>
            {loading ? <Loading /> : null}
            <Header />
            <BottomNav />
            <div className="page-section-container">
                <div className="row">
                    <div className="header left col-12 pb-4">
                        <div className="title-container">
                            <div className="title" style={{ color: "white" }}>Add New Tournament</div>
                        </div>
                    </div>
                    <div className="body col-12">
                        <TournamentForm onSubmit={addNewTournament} isAvatarRequired={true} isCoverImageRequired={true}>
                            <div className="col-md-3">
                                <button type="submit" className="form-control btn btn-primary btn-block">
                                    <div className="text">SAVE</div>
                                </button>
                            </div>

                        </TournamentForm>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Create;
