import Query from './queries';
import Mutation from './mutations';
import { GraphQLScalarType, Kind } from 'graphql';
import { GraphQLUpload } from 'graphql-upload';

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

const simpleResponseScalar = new GraphQLScalarType({
  name: 'SimpleResponse',
  description: 'A custom response scalar type',
  serialize(value: string | true) {
    return value;
  },
  parseValue(value: string | true) {
    return value;
  },
});

const stringOrArrayScalar = new GraphQLScalarType({
  name: 'StringOrArray',
  description: 'A custom response scalar type for string or array of strings',
  serialize(value: string | string[]) {
    return value;
  },
  parseValue(value: string | string[]) {
    return value;
  },
});

export default {
  Date: dateScalar,
  SimpleResponse: simpleResponseScalar,
  StringOrArray: stringOrArrayScalar,
  Upload: GraphQLUpload,
  Query,
  Mutation,
};
