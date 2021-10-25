import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type AdditionalEntityFields = {
  path?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addPost?: Maybe<Post>;
  sendConfirmationEmail?: Maybe<Scalars['Boolean']>;
  signIn?: Maybe<User>;
  signOut?: Maybe<Scalars['Boolean']>;
  signUp?: Maybe<User>;
};


export type MutationAddPostArgs = {
  body: Scalars['String'];
  inReplyTo?: Maybe<Scalars['String']>;
};


export type MutationSendConfirmationEmailArgs = {
  _id: Scalars['String'];
};


export type MutationSignInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignUpArgs = {
  email: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  _id: Scalars['String'];
  author: PostAuthor;
  body: Scalars['String'];
  createdAt: Scalars['String'];
  deletedAt?: Maybe<Scalars['String']>;
  inReplyTo?: Maybe<Scalars['String']>;
};

export type PostAuthor = {
  __typename?: 'PostAuthor';
  _id: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<User>;
  getPosts: Array<Maybe<Post>>;
};


export type QueryGetPostsArgs = {
  inReplyTo?: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['String'];
  confirmedAt?: Maybe<Scalars['Date']>;
  createdAt: Scalars['Date'];
  email: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  isConfirmed?: Maybe<Scalars['Boolean']>;
  lastActiveAt: Scalars['Date'];
  locked?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  updatedAt?: Maybe<Scalars['Date']>;
  username: Scalars['String'];
};

export type PostInfoFragment = { __typename: 'Post', _id: string, body: string, createdAt: string, author: { __typename?: 'PostAuthor', _id: string } };

export type UserInfoFragment = { __typename: 'User', _id: string, email: string, username: string, name?: string | null | undefined, image?: string | null | undefined, locked?: boolean | null | undefined, isConfirmed?: boolean | null | undefined, lastActiveAt: any, confirmedAt?: any | null | undefined, updatedAt?: any | null | undefined, createdAt: any };

export type AddPostMutationVariables = Exact<{
  body: Scalars['String'];
  inReplyTo?: Maybe<Scalars['String']>;
}>;


export type AddPostMutation = { __typename?: 'Mutation', addPost?: { __typename: 'Post', _id: string, body: string, createdAt: string, author: { __typename?: 'PostAuthor', _id: string } } | null | undefined };

export type SendConfirmationEmailMutationVariables = Exact<{
  _id: Scalars['String'];
}>;


export type SendConfirmationEmailMutation = { __typename?: 'Mutation', sendConfirmationEmail?: boolean | null | undefined };

export type SignInMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn?: { __typename: 'User', _id: string, email: string, username: string, name?: string | null | undefined, image?: string | null | undefined, locked?: boolean | null | undefined, isConfirmed?: boolean | null | undefined, lastActiveAt: any, confirmedAt?: any | null | undefined, updatedAt?: any | null | undefined, createdAt: any } | null | undefined };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'Mutation', signOut?: boolean | null | undefined };

export type SignUpMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
  name?: Maybe<Scalars['String']>;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp?: { __typename: 'User', _id: string, email: string, username: string, name?: string | null | undefined, image?: string | null | undefined, locked?: boolean | null | undefined, isConfirmed?: boolean | null | undefined, lastActiveAt: any, confirmedAt?: any | null | undefined, updatedAt?: any | null | undefined, createdAt: any } | null | undefined };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename: 'User', _id: string, email: string, username: string, name?: string | null | undefined, image?: string | null | undefined, locked?: boolean | null | undefined, isConfirmed?: boolean | null | undefined, lastActiveAt: any, confirmedAt?: any | null | undefined, updatedAt?: any | null | undefined, createdAt: any } | null | undefined };

export type GetPostsQueryVariables = Exact<{
  skip?: Maybe<Scalars['Int']>;
  inReplyTo?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
}>;


export type GetPostsQuery = { __typename?: 'Query', getPosts: Array<{ __typename: 'Post', _id: string, body: string, createdAt: string, author: { __typename?: 'PostAuthor', _id: string } } | null | undefined> };



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AdditionalEntityFields: AdditionalEntityFields;
  String: ResolverTypeWrapper<Scalars['String']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Post: ResolverTypeWrapper<Post>;
  PostAuthor: ResolverTypeWrapper<PostAuthor>;
  Query: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AdditionalEntityFields: AdditionalEntityFields;
  String: Scalars['String'];
  Date: Scalars['Date'];
  Mutation: {};
  Boolean: Scalars['Boolean'];
  Post: Post;
  PostAuthor: PostAuthor;
  Query: {};
  Int: Scalars['Int'];
  User: User;
};

export type UnionDirectiveArgs = {
  discriminatorField?: Maybe<Scalars['String']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type UnionDirectiveResolver<Result, Parent, ContextType = any, Args = UnionDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveArgs = {
  discriminatorField: Scalars['String'];
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type AbstractEntityDirectiveResolver<Result, Parent, ContextType = any, Args = AbstractEntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {
  embedded?: Maybe<Scalars['Boolean']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type EntityDirectiveResolver<Result, Parent, ContextType = any, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveArgs = {
  overrideType?: Maybe<Scalars['String']>;
};

export type ColumnDirectiveResolver<Result, Parent, ContextType = any, Args = ColumnDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = { };

export type IdDirectiveResolver<Result, Parent, ContextType = any, Args = IdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = {
  overrideType?: Maybe<Scalars['String']>;
};

export type LinkDirectiveResolver<Result, Parent, ContextType = any, Args = LinkDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = { };

export type EmbeddedDirectiveResolver<Result, Parent, ContextType = any, Args = EmbeddedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveArgs = {
  path: Scalars['String'];
};

export type MapDirectiveResolver<Result, Parent, ContextType = any, Args = MapDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addPost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<MutationAddPostArgs, 'body'>>;
  sendConfirmationEmail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationSendConfirmationEmailArgs, '_id'>>;
  signIn?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationSignInArgs, 'email' | 'password'>>;
  signOut?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  signUp?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationSignUpArgs, 'email' | 'password' | 'username'>>;
};

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['PostAuthor'], ParentType, ContextType>;
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  inReplyTo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostAuthorResolvers<ContextType = any, ParentType extends ResolversParentTypes['PostAuthor'] = ResolversParentTypes['PostAuthor']> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  currentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  getPosts?: Resolver<Array<Maybe<ResolversTypes['Post']>>, ParentType, ContextType, RequireFields<QueryGetPostsArgs, never>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  confirmedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isConfirmed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  lastActiveAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  locked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Date?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostAuthor?: PostAuthorResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  union?: UnionDirectiveResolver<any, any, ContextType>;
  abstractEntity?: AbstractEntityDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  column?: ColumnDirectiveResolver<any, any, ContextType>;
  id?: IdDirectiveResolver<any, any, ContextType>;
  link?: LinkDirectiveResolver<any, any, ContextType>;
  embedded?: EmbeddedDirectiveResolver<any, any, ContextType>;
  map?: MapDirectiveResolver<any, any, ContextType>;
};

export const PostInfoFragmentDoc = gql`
    fragment PostInfo on Post {
  __typename
  _id
  author {
    _id
  }
  body
  createdAt
}
    `;
export const UserInfoFragmentDoc = gql`
    fragment UserInfo on User {
  __typename
  _id
  email
  username
  name
  image
  locked
  isConfirmed
  lastActiveAt
  confirmedAt
  updatedAt
  createdAt
}
    `;
export const AddPostDocument = gql`
    mutation addPost($body: String!, $inReplyTo: String) {
  addPost(body: $body, inReplyTo: $inReplyTo) {
    ...PostInfo
  }
}
    ${PostInfoFragmentDoc}`;
export type AddPostMutationFn = Apollo.MutationFunction<AddPostMutation, AddPostMutationVariables>;

/**
 * __useAddPostMutation__
 *
 * To run a mutation, you first call `useAddPostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPostMutation, { data, loading, error }] = useAddPostMutation({
 *   variables: {
 *      body: // value for 'body'
 *      inReplyTo: // value for 'inReplyTo'
 *   },
 * });
 */
export function useAddPostMutation(baseOptions?: Apollo.MutationHookOptions<AddPostMutation, AddPostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddPostMutation, AddPostMutationVariables>(AddPostDocument, options);
      }
export type AddPostMutationHookResult = ReturnType<typeof useAddPostMutation>;
export type AddPostMutationResult = Apollo.MutationResult<AddPostMutation>;
export type AddPostMutationOptions = Apollo.BaseMutationOptions<AddPostMutation, AddPostMutationVariables>;
export const SendConfirmationEmailDocument = gql`
    mutation sendConfirmationEmail($_id: String!) {
  sendConfirmationEmail(_id: $_id)
}
    `;
export type SendConfirmationEmailMutationFn = Apollo.MutationFunction<SendConfirmationEmailMutation, SendConfirmationEmailMutationVariables>;

/**
 * __useSendConfirmationEmailMutation__
 *
 * To run a mutation, you first call `useSendConfirmationEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendConfirmationEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendConfirmationEmailMutation, { data, loading, error }] = useSendConfirmationEmailMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useSendConfirmationEmailMutation(baseOptions?: Apollo.MutationHookOptions<SendConfirmationEmailMutation, SendConfirmationEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendConfirmationEmailMutation, SendConfirmationEmailMutationVariables>(SendConfirmationEmailDocument, options);
      }
export type SendConfirmationEmailMutationHookResult = ReturnType<typeof useSendConfirmationEmailMutation>;
export type SendConfirmationEmailMutationResult = Apollo.MutationResult<SendConfirmationEmailMutation>;
export type SendConfirmationEmailMutationOptions = Apollo.BaseMutationOptions<SendConfirmationEmailMutation, SendConfirmationEmailMutationVariables>;
export const SignInDocument = gql`
    mutation signIn($email: String!, $password: String!) {
  signIn(email: $email, password: $password) {
    ...UserInfo
  }
}
    ${UserInfoFragmentDoc}`;
export type SignInMutationFn = Apollo.MutationFunction<SignInMutation, SignInMutationVariables>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignInMutation(baseOptions?: Apollo.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, options);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>;
export type SignInMutationOptions = Apollo.BaseMutationOptions<SignInMutation, SignInMutationVariables>;
export const SignOutDocument = gql`
    mutation signOut {
  signOut
}
    `;
export type SignOutMutationFn = Apollo.MutationFunction<SignOutMutation, SignOutMutationVariables>;

/**
 * __useSignOutMutation__
 *
 * To run a mutation, you first call `useSignOutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignOutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signOutMutation, { data, loading, error }] = useSignOutMutation({
 *   variables: {
 *   },
 * });
 */
export function useSignOutMutation(baseOptions?: Apollo.MutationHookOptions<SignOutMutation, SignOutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignOutMutation, SignOutMutationVariables>(SignOutDocument, options);
      }
export type SignOutMutationHookResult = ReturnType<typeof useSignOutMutation>;
export type SignOutMutationResult = Apollo.MutationResult<SignOutMutation>;
export type SignOutMutationOptions = Apollo.BaseMutationOptions<SignOutMutation, SignOutMutationVariables>;
export const SignUpDocument = gql`
    mutation signUp($email: String!, $password: String!, $username: String!, $name: String) {
  signUp(email: $email, password: $password, username: $username, name: $name) {
    ...UserInfo
  }
}
    ${UserInfoFragmentDoc}`;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      username: // value for 'username'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const CurrentUserDocument = gql`
    query currentUser {
  currentUser {
    ...UserInfo
  }
}
    ${UserInfoFragmentDoc}`;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
      }
export function useCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
        }
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserQueryResult = Apollo.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;
export const GetPostsDocument = gql`
    query getPosts($skip: Int, $inReplyTo: String, $userId: String) {
  getPosts(skip: $skip, inReplyTo: $inReplyTo, userId: $userId) {
    ...PostInfo
  }
}
    ${PostInfoFragmentDoc}`;

/**
 * __useGetPostsQuery__
 *
 * To run a query within a React component, call `useGetPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostsQuery({
 *   variables: {
 *      skip: // value for 'skip'
 *      inReplyTo: // value for 'inReplyTo'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetPostsQuery(baseOptions?: Apollo.QueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, options);
      }
export function useGetPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostsQuery, GetPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, options);
        }
export type GetPostsQueryHookResult = ReturnType<typeof useGetPostsQuery>;
export type GetPostsLazyQueryHookResult = ReturnType<typeof useGetPostsLazyQuery>;
export type GetPostsQueryResult = Apollo.QueryResult<GetPostsQuery, GetPostsQueryVariables>;
import { ObjectID } from 'mongodb';

declare module '*/posts.ts' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const PostInfo: DocumentNode;
export const getPosts: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/user.ts' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const UserInfo: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/addPost.ts' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const addPost: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/sendconfirmationemail.ts' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const sendConfirmationEmail: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/signin.ts' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const signIn: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/signout.ts' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const signOut: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/signup.ts' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const signUp: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/currentUser.ts' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const currentUser: DocumentNode;

  export default defaultDocument;
}
    
export const PostInfo = gql`
    fragment PostInfo on Post {
  __typename
  _id
  author {
    _id
  }
  body
  createdAt
}
    `;
export const UserInfo = gql`
    fragment UserInfo on User {
  __typename
  _id
  email
  username
  name
  image
  locked
  isConfirmed
  lastActiveAt
  confirmedAt
  updatedAt
  createdAt
}
    `;
export const AddPost = gql`
    mutation addPost($body: String!, $inReplyTo: String) {
  addPost(body: $body, inReplyTo: $inReplyTo) {
    ...PostInfo
  }
}
    ${PostInfo}`;
export const SendConfirmationEmail = gql`
    mutation sendConfirmationEmail($_id: String!) {
  sendConfirmationEmail(_id: $_id)
}
    `;
export const SignIn = gql`
    mutation signIn($email: String!, $password: String!) {
  signIn(email: $email, password: $password) {
    ...UserInfo
  }
}
    ${UserInfo}`;
export const SignOut = gql`
    mutation signOut {
  signOut
}
    `;
export const SignUp = gql`
    mutation signUp($email: String!, $password: String!, $username: String!, $name: String) {
  signUp(email: $email, password: $password, username: $username, name: $name) {
    ...UserInfo
  }
}
    ${UserInfo}`;
export const CurrentUser = gql`
    query currentUser {
  currentUser {
    ...UserInfo
  }
}
    ${UserInfo}`;
export const GetPosts = gql`
    query getPosts($skip: Int, $inReplyTo: String, $userId: String) {
  getPosts(skip: $skip, inReplyTo: $inReplyTo, userId: $userId) {
    ...PostInfo
  }
}
    ${PostInfo}`;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    