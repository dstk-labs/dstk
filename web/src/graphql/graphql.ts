/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Valid page sizes are 10, 25, and 50 records */
  Limit: { input: any; output: any; }
};

export type AccountInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  realName: Scalars['String']['input'];
  userName: Scalars['String']['input'];
};

export type AddTeamMemberInput = {
  role: UserRole;
  teamId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type ApiKey = {
  __typename?: 'ApiKey';
  apiKey?: Maybe<Scalars['String']['output']>;
  apiKeyId?: Maybe<Scalars['ID']['output']>;
  dateCreated?: Maybe<Scalars['String']['output']>;
  isArchived?: Maybe<Scalars['Boolean']['output']>;
  userId?: Maybe<User>;
};

export type CompletedPartInput = {
  ETag: Scalars['String']['input'];
  PartNumber: Scalars['Int']['input'];
};

export type Cursor = {
  __typename?: 'Cursor';
  cursorRelation?: Maybe<CursorRelation>;
  cursorToken?: Maybe<Scalars['String']['output']>;
  expiration?: Maybe<Scalars['String']['output']>;
};

export enum CursorRelation {
  Model = 'model',
  ModelVersion = 'model_version'
}

export type EditStorageProviderInput = {
  accessKeyId: Scalars['String']['input'];
  providerId: Scalars['String']['input'];
  secretAccessKey: Scalars['String']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  rememberMe?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MlModel = {
  __typename?: 'MLModel';
  createdBy?: Maybe<User>;
  currentModelVersion?: Maybe<MlModelVersion>;
  dateCreated?: Maybe<Scalars['String']['output']>;
  dateModified?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  isArchived?: Maybe<Scalars['Boolean']['output']>;
  modelId?: Maybe<Scalars['ID']['output']>;
  modelName?: Maybe<Scalars['String']['output']>;
  modifiedBy?: Maybe<User>;
  project?: Maybe<Project>;
  storageProvider?: Maybe<StorageProvider>;
};

export type MlModelConnection = {
  __typename?: 'MLModelConnection';
  edges?: Maybe<Array<MlModelEdge>>;
  pageInfo?: Maybe<PageInfo>;
};

export type MlModelEdge = {
  __typename?: 'MLModelEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<MlModel>;
};

export type MlModelVersion = {
  __typename?: 'MLModelVersion';
  createdBy?: Maybe<User>;
  dateCreated?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  isArchived?: Maybe<Scalars['Boolean']['output']>;
  isFinalized?: Maybe<Scalars['Boolean']['output']>;
  modelId?: Maybe<MlModel>;
  modelVersionId?: Maybe<Scalars['ID']['output']>;
  numericVersion?: Maybe<Scalars['Int']['output']>;
  s3Prefix?: Maybe<Scalars['String']['output']>;
};

export type MlModelVersionConnection = {
  __typename?: 'MLModelVersionConnection';
  edges?: Maybe<Array<MlModelVersionEdge>>;
  pageInfo?: Maybe<PageInfo>;
};

export type MlModelVersionEdge = {
  __typename?: 'MLModelVersionEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<MlModelVersion>;
};

export type ModelInput = {
  description: Scalars['String']['input'];
  modelName: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  storageProviderId: Scalars['String']['input'];
};

export type ModelVersionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  modelId: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addToTeam?: Maybe<Scalars['Boolean']['output']>;
  archiveApiKey?: Maybe<ApiKey>;
  archiveModel?: Maybe<MlModel>;
  archiveModelVersion?: Maybe<MlModelVersion>;
  archiveProject?: Maybe<Project>;
  archiveStorageProvider?: Maybe<StorageProvider>;
  createAccount?: Maybe<User>;
  createApiKey?: Maybe<ApiKey>;
  createModel?: Maybe<MlModel>;
  createModelVersion?: Maybe<MlModelVersion>;
  createProject?: Maybe<Project>;
  createStorageProvider?: Maybe<StorageProvider>;
  createTeam?: Maybe<Team>;
  editModel?: Maybe<MlModel>;
  editStorageProvider?: Maybe<StorageProvider>;
  login?: Maybe<Scalars['String']['output']>;
  logout?: Maybe<Scalars['Boolean']['output']>;
  presignURL?: Maybe<PresignedUrl>;
  publishModelVersion?: Maybe<MlModelVersion>;
};


export type MutationAddToTeamArgs = {
  data: AddTeamMemberInput;
};


export type MutationArchiveApiKeyArgs = {
  apiKeyId: Scalars['String']['input'];
};


export type MutationArchiveModelArgs = {
  modelId: Scalars['String']['input'];
};


export type MutationArchiveModelVersionArgs = {
  modelVersionId: Scalars['String']['input'];
};


export type MutationArchiveProjectArgs = {
  projectId: Scalars['String']['input'];
};


export type MutationArchiveStorageProviderArgs = {
  providerId: Scalars['String']['input'];
};


export type MutationCreateAccountArgs = {
  data: AccountInput;
};


export type MutationCreateModelArgs = {
  data: ModelInput;
};


export type MutationCreateModelVersionArgs = {
  data: ModelVersionInput;
};


export type MutationCreateProjectArgs = {
  data: ProjectInput;
};


export type MutationCreateStorageProviderArgs = {
  data: StorageProviderInput;
};


export type MutationCreateTeamArgs = {
  data: TeamInput;
};


export type MutationEditModelArgs = {
  data: ModelInput;
  modelId: Scalars['String']['input'];
};


export type MutationEditStorageProviderArgs = {
  data: EditStorageProviderInput;
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationPresignUrlArgs = {
  data: PresignedUrlInput;
};


export type MutationPublishModelVersionArgs = {
  modelVersionId: Scalars['String']['input'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  continuationToken?: Maybe<Scalars['String']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  hasPreviousPage?: Maybe<Scalars['Boolean']['output']>;
};

export type PartsInput = {
  Parts: Array<CompletedPartInput>;
};

export enum PresignMethod {
  AbortMultipartUpload = 'abortMultipartUpload',
  CreateMultipartUpload = 'createMultipartUpload',
  FinalizeMultipartUpload = 'finalizeMultipartUpload',
  UploadPart = 'uploadPart'
}

export type PresignedUrl = {
  __typename?: 'PresignedURL';
  ETag?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  partNumber?: Maybe<Scalars['Int']['output']>;
  uploadId?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type PresignedUrlInput = {
  filename?: InputMaybe<Scalars['String']['input']>;
  method: PresignMethod;
  modelVersionId: Scalars['String']['input'];
  multipartUpload?: InputMaybe<PartsInput>;
  partNumber?: InputMaybe<Scalars['Int']['input']>;
  uploadId?: InputMaybe<Scalars['String']['input']>;
};

export type Project = {
  __typename?: 'Project';
  createdBy?: Maybe<User>;
  dateCreated?: Maybe<Scalars['String']['output']>;
  dateModified?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  isArchived?: Maybe<Scalars['Boolean']['output']>;
  modifiedBy?: Maybe<User>;
  name?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['ID']['output']>;
};

export type ProjectInput = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  teamId: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getMLModel?: Maybe<MlModel>;
  getMLModelVersion?: Maybe<MlModelVersion>;
  getProject?: Maybe<Project>;
  getStorageProvider?: Maybe<StorageProvider>;
  getUser?: Maybe<User>;
  listApiKeys?: Maybe<Array<ApiKey>>;
  listMLModelVersions?: Maybe<MlModelVersionConnection>;
  listMLModels?: Maybe<MlModelConnection>;
  listObjectsForModelVersion?: Maybe<StorageProviderObjectConnection>;
  listProjects?: Maybe<Array<Project>>;
  listStorageProviders?: Maybe<Array<StorageProvider>>;
  listTeamMembers?: Maybe<Array<User>>;
  listTeams?: Maybe<Array<Team>>;
  listUsers?: Maybe<Array<User>>;
};


export type QueryGetMlModelArgs = {
  modelId: Scalars['String']['input'];
};


export type QueryGetMlModelVersionArgs = {
  modelVersionId: Scalars['String']['input'];
};


export type QueryGetProjectArgs = {
  projectId: Scalars['String']['input'];
};


export type QueryGetStorageProviderArgs = {
  storageProviderId: Scalars['String']['input'];
};


export type QueryListMlModelVersionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: Scalars['Limit']['input'];
  modelId: Scalars['String']['input'];
};


export type QueryListMlModelsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: Scalars['Limit']['input'];
  modelName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListObjectsForModelVersionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: Scalars['Limit']['input'];
  modelVersionId: Scalars['String']['input'];
  prefix?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListProjectsArgs = {
  teamId: Scalars['String']['input'];
};


export type QueryListTeamMembersArgs = {
  teamId: Scalars['String']['input'];
};


export type QueryListTeamsArgs = {
  teamId?: InputMaybe<Scalars['String']['input']>;
};

export type StorageProvider = {
  __typename?: 'StorageProvider';
  accessKeyId?: Maybe<Scalars['String']['output']>;
  bucket?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<User>;
  dateCreated?: Maybe<Scalars['String']['output']>;
  dateModified?: Maybe<Scalars['String']['output']>;
  endpointUrl?: Maybe<Scalars['String']['output']>;
  isArchived?: Maybe<Scalars['Boolean']['output']>;
  modifiedBy?: Maybe<User>;
  owner?: Maybe<User>;
  providerId?: Maybe<Scalars['ID']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  teamId?: Maybe<Scalars['String']['output']>;
};

export type StorageProviderInput = {
  accessKeyId: Scalars['String']['input'];
  bucket: Scalars['String']['input'];
  endpointUrl: Scalars['String']['input'];
  region: Scalars['String']['input'];
  secretAccessKey: Scalars['String']['input'];
  teamId: Scalars['String']['input'];
};

export type StorageProviderObject = {
  __typename?: 'StorageProviderObject';
  lastModified?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
};

export type StorageProviderObjectConnection = {
  __typename?: 'StorageProviderObjectConnection';
  edges?: Maybe<Array<StorageProviderObjectEdge>>;
  pageInfo?: Maybe<PageInfo>;
};

export type StorageProviderObjectEdge = {
  __typename?: 'StorageProviderObjectEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<StorageProviderObject>;
};

export type Team = {
  __typename?: 'Team';
  dateCreated?: Maybe<Scalars['String']['output']>;
  dateModified?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  teamId?: Maybe<Scalars['ID']['output']>;
};

export type TeamInput = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  dateCreated?: Maybe<Scalars['String']['output']>;
  dateModified?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  isEmailVerified?: Maybe<Scalars['Boolean']['output']>;
  isMfaEnrolled?: Maybe<Scalars['Boolean']['output']>;
  realName?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
};

export enum UserRole {
  Member = 'member',
  Owner = 'owner',
  Viewer = 'viewer'
}

export type LoginMutationVariables = Exact<{
  data: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: string | null };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}]}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;