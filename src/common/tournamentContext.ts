import React, { createContext } from "react";
import { ModalStateEnum, TournamentContext } from "./types";

const tournamentContext: TournamentContext = {
  tournamentList: [],
  setTournamentList: () => { },

  submitTournament: () => { },

  editableTournamentId: undefined,
  setEditableTournamentId: () => { },

  editTournamentModalState: undefined,
  setEditTournamentModalState: () => { },

  notificationModalState: undefined,
  setNotificationModalState: () => { },

  lastReadItemIndex: 0,
  setLastReadItemIndex: ()=> {},
  currentPage: 1
};

export const TContext = createContext(tournamentContext);