import { gql } from "apollo-boost";

const GET_TOURNAMENTS = gql`
query getAllTournaments($count: Int!, $offset: Int!){
  listedTournaments(count: $count, offset: $offset) {
    id
    name
    deadline
    waitlistParticipantsCount
    owner {
      id
      username
      avatar
    }
  }
}
`;

export default GET_TOURNAMENTS;