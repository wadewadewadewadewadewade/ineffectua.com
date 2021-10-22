import Query from './queries';
import Mutation from './mutations';
import { GraphQLScalarType, Kind } from 'graphql';

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value: Date | null) {
    if (value) return value.getTime(); // Convert outgoing Date to integer for JSON
    return value;
  },
  parseValue(value: number | null) {
    if (value === null) return value;
    return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});

export default {
  Date: dateScalar,
  Query,
  Mutation,
};
