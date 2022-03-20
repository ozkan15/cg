import styles from '../styles/home.module.scss'

import type { NextPage } from 'next'
import { Fragment, useEffect, useState } from 'react'
import Card from './Components/card'
import { useApolloClient, useLazyQuery, useQuery } from '@apollo/react-hooks';
import client from '../src/apollo-client'
import React from 'react'
import { Entity, Props, Tournament, ModalStateEnum } from '../src/common/types'
import Header from './Components/header'
import BottomNav from './Components/buttomNav'
import Loading from './Components/loading'
import GET_TOURNAMENTS from '../src/common/query'
import { TContext } from '../src/common/tournamentContext'
import EditTournamentModal from './Components/editTournamentModal'
import Pagination from './Components/pagination'
import SortTournaments from './Components/sortTournaments';
import { sortList } from '../src/common/helpers';
import { DELETED_TOURNAMENTS } from '../src/common/constantst';

export async function getStaticProps() {
  let props: Props = {
    listedTournaments: []
  };

  try {
    const response = await client.query<Entity>({
      query: GET_TOURNAMENTS,
      variables: { count: 6, offset: 0 }
    });

    props = {
      listedTournaments: response.data.listedTournaments.slice(0, 6)
    };
  } catch (err) {
    console.log(err);
  }

  return {
    props
  };
}

/*
home page
*/
const Home: NextPage<Props> = (props) => {
  const client = useApolloClient();
  const [tournamentList, setTournamentList] = useState<Tournament[]>(props.listedTournaments);
  const [editTournamentModalState, setEditTournamentModalState] = useState<ModalStateEnum>(ModalStateEnum.HIDE);
  const [editableTournamentId, setEditableTournamentId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastReadItemIndex, setLastReadItemIndex] = useState(currentPage * 6);
  const [sortType, setSortType] = useState("1");

  const { error, data, loading } = useQuery<Entity>(GET_TOURNAMENTS, {
    fetchPolicy: "cache-first",
    skip: currentPage === 1 && lastReadItemIndex === 6,
    variables: { count: lastReadItemIndex, offset: 0 },
  });

  const userData = useQuery<Entity>(GET_TOURNAMENTS, {
    fetchPolicy: "cache-only",
    variables: { count: -1, offset: -1 },
  });

  useEffect(() => {
    if (data?.listedTournaments) {
      const deletedTournamentIds: string[] = JSON.parse(localStorage.getItem(DELETED_TOURNAMENTS) || "[]");
      const userAddedTournaments = (userData?.data?.listedTournaments || []).filter(s => !deletedTournamentIds.includes(s.id as string));
      const dbTournaments = data?.listedTournaments.filter(s => !deletedTournamentIds.includes(s.id as string));
      setTournamentList([...userAddedTournaments, ...dbTournaments]);
    }

  }, [data]);

  useEffect(() => {
    setTournamentList([...userData?.data?.listedTournaments || [], ...props.listedTournaments]);
    // initial cache
    client.cache.writeQuery<Entity>({
      query: GET_TOURNAMENTS,
      variables: { count: 6, offset: 0 },
      data: {
        listedTournaments: props.listedTournaments
      }
    });
  }, []);

  function changePage(prePage: number, page: number) {
    if (page < 1) return;
    setCurrentPage(page);
    setLastReadItemIndex(page - prePage > 0 ? lastReadItemIndex + 6 * (page - prePage) : lastReadItemIndex - 6 * (prePage - page));
  }

  return (
    <Fragment>
      {loading ? <Loading /> : null}
      <Header />
      <BottomNav />
      <TContext.Provider value={{
        tournamentList, setTournamentList,
        editTournamentModalState, setEditTournamentModalState,
        editableTournamentId, setEditableTournamentId,
        lastReadItemIndex,
        setLastReadItemIndex,
        currentPage
      }}>
        <EditTournamentModal />
        <div id={styles.home} className='container'>
          <div className='row justify-content-between pb-4'>
            <div className='col-md-3'>
              <SortTournaments onChange={(value) => setSortType(value)} defaultValue={sortType}>
                <option value="1">Order by most voted</option>
                <option value="2">Order by less voted</option>
              </SortTournaments>
            </div>
            <div className='col-md-3'>
              <Pagination currentPage={currentPage} onClick={changePage} />
            </div>
          </div>
          <div className='row'>
            {sortList(tournamentList, sortType).slice((currentPage - 1) * 6, currentPage * 6).map((s) =>
              <div key={s.id} className='col-md-6 col-lg-4' style={{ marginBottom: "30px" }}>
                <Card tournament={s} />
              </div>
            )}
          </div>
        </div>
      </TContext.Provider>
      <div id="footer" style={{ marginBottom: "60px" }}></div>
    </Fragment>
  )
}

export default Home
