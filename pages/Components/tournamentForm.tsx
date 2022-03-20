import { useContext, useEffect, useState } from "react";
import { TOURNAMENTS_ADDITIONAL_INFO } from "../../src/common/constantst";
import { toDateString } from "../../src/common/helpers";
import { TContext } from "../../src/common/tournamentContext";
import { Tournament } from "../../src/common/types";
/*
generic tournament form modal for handling both create and editing 
*/
const TournamentForm = (props: {
    children: React.ReactNode,
    onSubmit: (data: FormData) => void,
    initialDataId?: string,
    isCoverImageRequired?: boolean,
    isAvatarRequired?: boolean
}) => {
    const { tournamentList } = useContext(TContext);

    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [alias, setAlias] = useState("");
    const [ownerUsername, setOwnerUsername] = useState("");
    const [ownerId, setOwnerId] = useState("");
    const [deadline, setDeadline] = useState("");
    const [prize, setPrize] = useState("");
    const [coverImage, setCoverImage] = useState<File>();
    const [avatar, setAvatar] = useState<File>();
    const [oldAvatar, setOldAvatar] = useState("");
    const [oldCoverImage, setOldCoverImage] = useState("");
    const [vote, setVote] = useState(0);
    const [waitlistParticipantsCount, setWaitlistParticipantsCount] = useState(0);
    const [lastVoteTime, setLastVoteTime] = useState("");

    useEffect(() => {
        const editableTournament = tournamentList?.find(s => s.id == props.initialDataId);
        const tournamentsInfo: Tournament[] = JSON.parse(localStorage.getItem(TOURNAMENTS_ADDITIONAL_INFO) || "[]");
        const tournamentInfo = tournamentsInfo.find(s => s.id == props.initialDataId);
        const actualTournamentInfo = tournamentInfo || editableTournament;

        setLastVoteTime(actualTournamentInfo?.lastVoteTime || "");
        setWaitlistParticipantsCount(actualTournamentInfo?.waitlistParticipantsCount || 0);
        setId(actualTournamentInfo?.id || "");
        setVote(actualTournamentInfo?.vote || 0);
        setName(editableTournament?.name || "");
        setAlias(actualTournamentInfo?.alias || "");
        setOwnerUsername(actualTournamentInfo?.owner.username || "");
        setOwnerId(actualTournamentInfo?.owner.id || "");
        setDeadline(actualTournamentInfo?.deadline || "");
        setPrize(actualTournamentInfo?.prize?.toString() || "");
        setOldAvatar(actualTournamentInfo?.owner.avatar || "");
        setOldCoverImage(actualTournamentInfo?.coverImage || "");
    }, [props.initialDataId]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("lastVoteTime", lastVoteTime);
        formData.append("waitlistParticipantsCount", waitlistParticipantsCount.toString());
        formData.append("id", id);
        formData.append("vote", vote.toString());
        formData.append("name", name);
        formData.append("ownerUsername", ownerUsername);
        formData.append("ownerId", ownerId)
        formData.append("alias", alias);
        formData.append("deadline", deadline);
        formData.append("prize", prize.toString());
        formData.append("oldAvatar", oldAvatar);
        formData.append("oldCoverImage", oldCoverImage);

        if (coverImage) formData.append("coverImage", coverImage);
        if (avatar) formData.append("avatar", avatar);
        if (typeof props.onSubmit === "function") props.onSubmit(formData);
    };

    return <form className="form" id="createForm" encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="row">
            <div className="form-group col-md-6">
                <div>
                    <input placeholder="Cover Image" onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCoverImage((event.target.files || [])[0])} type="file" className="form-control" required={props.isCoverImageRequired} />
                </div>
                {/* <div>{oldCoverImage}</div> */}
            </div>
            <div className="form-group col-md-6">
                <div>
                    <input placeholder="Name" onInput={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)} type="text" className="form-control" value={name} required />
                </div>
            </div>
            <div className="form-group col-md-6">
                <div>
                    <input placeholder="Alias" onInput={(event: React.ChangeEvent<HTMLInputElement>) => setAlias(event.target.value)} type="text" className="form-control" value={alias} required />
                </div>
            </div>
            <div className="form-group col-md-6">
                <div>
                    <input placeholder="Owner Id" onInput={(event: React.ChangeEvent<HTMLInputElement>) => setOwnerId(event.target.value)} type="text" id="email" className="form-control" value={ownerId} disabled />
                </div>
            </div>
            <div className="form-group col-md-6">
                <div>
                    <input placeholder="Owner Username" onInput={(event: React.ChangeEvent<HTMLInputElement>) => setOwnerUsername(event.target.value)} type="text" className="form-control" value={ownerUsername} required />
                </div>
            </div>
            <div className="form-group col-md-6">
                <div>
                    <input placeholder="Owner Avatar" onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAvatar((event.target.files || [])[0])} type="file" className="form-control" required={props.isAvatarRequired} />
                </div>
                {/* <div>{oldAvatar}</div> */}
            </div>
            <div className="form-group col-md-6">
                <div>
                    <input placeholder="Deadline" type="datetime-local" onInput={(event: React.ChangeEvent<HTMLInputElement>) => setDeadline(event.target.value)} className="form-control" value={deadline} required />
                </div>
            </div>
            <div className="form-group col-md-6">
                <div>
                    <input placeholder="Prize" onInput={(event: React.ChangeEvent<HTMLInputElement>) => setPrize(event.target.value)} type="number" id="email" className="form-control" value={prize} />
                </div>
            </div>
        </div>
        <div className="row">
            {props.children}
        </div>

    </form>;
};

export default TournamentForm;