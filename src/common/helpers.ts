import { TOURNAMENTS_ADDITIONAL_INFO } from "./constantst";
import { Tournament } from "./types";

export function post<T>(endpoint: string, data: T, processData: boolean = true) {
    if (!processData) {
        return fetch("/api/" + endpoint, {
            method: "POST",
            body: data as any
        });
    }

    return fetch("/api/" + endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

export function sortList(list: Tournament[], sortType: string) {
    const additionalTournamentsInfo: Tournament[] = JSON.parse(localStorage.getItem(TOURNAMENTS_ADDITIONAL_INFO) || "[]");

    const returnVal = sortType == "1" ? 1 : -1;

    return list.sort((x, y) => {
        const xVote = additionalTournamentsInfo.find(s => s.id === x.id)?.vote || 0;
        const yVote = additionalTournamentsInfo.find(s => s.id === y.id)?.vote || 0;
        const xLastVoteTime = new Date(additionalTournamentsInfo.find(s => s.id === x.id)?.lastVoteTime || "");
        const yLastVoteTime = new Date(additionalTournamentsInfo.find(s => s.id === y.id)?.lastVoteTime || "");

        if (xVote < yVote)
            return returnVal;
        else if (xVote > yVote)
            return -1 * returnVal;
        else {
            if (xLastVoteTime < yLastVoteTime)
                return returnVal;
            else if (xLastVoteTime > yLastVoteTime)
                return -1 * returnVal;
        }
        return 0;
    });
}

export function toDateString(date: Date) {
    return ("0" + (date.getMonth() + 1)).slice(-2) + "/" +
        ("0" + date.getDate()).slice(-2) + "/" +
        date.getFullYear() + " " +
        ("0" + date.getHours()).slice(-2) + ":" +
        ("0" + date.getMinutes()).slice(-2) + ":" +
        ("0" + date.getSeconds()).slice(-2);
}