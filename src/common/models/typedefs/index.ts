import { Config, gql } from 'apollo-server-micro';
import { typeDefs as PostTypeDefs } from './posts';
import { typeDefs as CurrentUserTypeDefs } from './currentuser';

const typeDefs: Config['typeDefs'] = gql`
  ${PostTypeDefs}
  ${CurrentUserTypeDefs}
`;

export default typeDefs;
