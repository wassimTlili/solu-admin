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

export type AdminOverviewQueryVariables = Exact<{
  days?: number | null | undefined;
}>;


export type AdminOverviewQuery = { adminOverview: { range_days: number, from: string, to: string, kpis: { total_members: number, new_members: number, new_members_previous: number, active_today: number, active_week: number, active_month: number, stickiness: number, with_cycle: number, push_reachable: number, suspended: number }, series: Array<{ key: string, points: Array<{ date: string, value: number }> }>, cycle_types: Array<{ key: string, label: string, count: number }>, phases_today: Array<{ key: string, label: string, count: number }>, cities: Array<{ key: string, label: string, count: number }>, glow_levels: Array<{ key: string, label: string, count: number }>, interests: Array<{ key: string, label: string, count: number }>, moods: Array<{ key: string, label: string, count: number }>, goals: Array<{ key: string, label: string, count: number }>, community: { posts: number, comments: number, likes: number, groups: number, bookings: number, upcoming_hangouts: number }, top_groups: Array<{ key: string, label: string, count: number }>, content: { insight_views: number, insight_views_set_a: number, insight_views_set_b: number, discoveries_shown: number, discoveries_dismissed: number, article_impressions: number, ai_questions: number }, top_articles: Array<{ key: string, label: string, count: number }>, notifications: { sent: number, read: number, by_topic: Array<{ key: string, label: string, count: number }> } } };

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

export const AdminOverviewDocument = new TypedDocumentString(`
    query AdminOverview($days: Int) {
  adminOverview(days: $days) {
    range_days
    from
    to
    kpis {
      total_members
      new_members
      new_members_previous
      active_today
      active_week
      active_month
      stickiness
      with_cycle
      push_reachable
      suspended
    }
    series {
      key
      points {
        date
        value
      }
    }
    cycle_types {
      key
      label
      count
    }
    phases_today {
      key
      label
      count
    }
    cities {
      key
      label
      count
    }
    glow_levels {
      key
      label
      count
    }
    interests {
      key
      label
      count
    }
    moods {
      key
      label
      count
    }
    goals {
      key
      label
      count
    }
    community {
      posts
      comments
      likes
      groups
      bookings
      upcoming_hangouts
    }
    top_groups {
      key
      label
      count
    }
    content {
      insight_views
      insight_views_set_a
      insight_views_set_b
      discoveries_shown
      discoveries_dismissed
      article_impressions
      ai_questions
    }
    top_articles {
      key
      label
      count
    }
    notifications {
      sent
      read
      by_topic {
        key
        label
        count
      }
    }
  }
}
    `) as unknown as TypedDocumentString<AdminOverviewQuery, AdminOverviewQueryVariables>;
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