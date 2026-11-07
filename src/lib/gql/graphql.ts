/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type AdminLoginInput = {
  email: string;
  password: string;
};

export type AdminRefreshInput = {
  refresh_token: string;
};

export type AdminLoginMutationVariables = Exact<{
  input: AdminLoginInput;
}>;


export type AdminLoginMutation = { adminLogin: { access_token: string, refresh_token: string, expires_in: number } };

export type AdminMeQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminMeQuery = { adminMe: { id: string, email: string, first_name: string, last_name: string, image_url: string | null } };

export type AdminRefreshMutationVariables = Exact<{
  input: AdminRefreshInput;
}>;


export type AdminRefreshMutation = { adminRefresh: { access_token: string, refresh_token: string, expires_in: number } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const AdminLoginDocument = new TypedDocumentString(`
    mutation AdminLogin($input: AdminLoginInput!) {
  adminLogin(input: $input) {
    access_token
    refresh_token
    expires_in
  }
}
    `) as unknown as TypedDocumentString<AdminLoginMutation, AdminLoginMutationVariables>;
export const AdminMeDocument = new TypedDocumentString(`
    query AdminMe {
  adminMe {
    id
    email
    first_name
    last_name
    image_url
  }
}
    `) as unknown as TypedDocumentString<AdminMeQuery, AdminMeQueryVariables>;
export const AdminRefreshDocument = new TypedDocumentString(`
    mutation AdminRefresh($input: AdminRefreshInput!) {
  adminRefresh(input: $input) {
    access_token
    refresh_token
    expires_in
  }
}
    `) as unknown as TypedDocumentString<AdminRefreshMutation, AdminRefreshMutationVariables>;