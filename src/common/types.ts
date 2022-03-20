
export interface TournamentContext {
    tournamentList?: Tournament[],
    setTournamentList?: React.Dispatch<React.SetStateAction<Tournament[]>>,

    submitTournament?: (tournament: FormData) => void,

    editableTournamentId?: string | undefined,
    setEditableTournamentId?: React.Dispatch<React.SetStateAction<string>>

    editTournamentModalState?: ModalStateEnum,
    setEditTournamentModalState?: React.Dispatch<React.SetStateAction<ModalStateEnum>>,

    notificationModalState?: ModalParameters,
    setNotificationModalState?: React.Dispatch<React.SetStateAction<ModalParameters>>,

    lastReadItemIndex: number,
    setLastReadItemIndex: React.Dispatch<React.SetStateAction<number>>,
    currentPage: number
}

export enum ModalStateEnum {
    SHOW = 1,
    HIDE = 2,
    LOADING = 3
}

export enum NotificationTypeEnum {
    ERROR = 1,
    WARNING = 2,
    INFO = 3
}

export interface Owner {
    __typename: string;
    id?: string;
    username: string;
    avatar: string;
}

export interface Tournament {
    __typename: string;
    id?: string;
    name: string;
    owner: Owner;
    vote: number;
    lastVoteTime: string;
    coverImage: string;
    alias: string;
    prize: number;
    deadline: string;
    waitlistParticipantsCount: number;
    oldAvatar?: string;
    oldCoverImage?: string;
}

export interface Entity {
    listedTournaments: Tournament[]
}

export interface Props {
    listedTournaments: Tournament[]
}

export interface ModalParameters {
    visibility?: boolean,
    title?: string,
    type?: NotificationTypeEnum,
    message?: string,
    onConfirmation?: () => void,
    onCancel?: () => void
}