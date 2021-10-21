import { Config, gql } from 'apollo-server-micro';
import { typeDefs as PostTypeDefs } from './post';
import { typeDefs as CurrentUserTypeDefs } from './user';

const typeDefs: Config['typeDefs'] = gql`
  ${PostTypeDefs}
  ${CurrentUserTypeDefs}
`;

export default typeDefs;
