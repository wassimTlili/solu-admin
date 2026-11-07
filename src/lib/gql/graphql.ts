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

export type AdminSuspendUserInput = {
  /** Shown in the audit log; keep it factual */
  reason: string;
  user_id: string;
};

export type AdminUserFilterInput = {
  city?: string | null | undefined;
  cycle_type?: CycleType | null | undefined;
  /** Joined on or after (YYYY-MM-DD) */
  joined_from?: string | null | undefined;
  /** Joined on or before (YYYY-MM-DD) */
  joined_to?: string | null | undefined;
  role?: UserRole | null | undefined;
  /** Name, email or username */
  search?: string | null | undefined;
  sort?: string | null | undefined;
  status?: UserStatus | null | undefined;
};

/** Phase of the menstrual cycle */
export type CyclePhase =
  | 'FOLLICULAR'
  | 'LUTEAL'
  | 'MENSTRUAL'
  | 'OVULATION';

/** Natural, hormonal contraception, post-pill, irregular (spec v4 G5), or unsure (pre-v4) */
export type CycleType =
  | 'CONTRACEPTION'
  | 'IRREGULAR'
  | 'NATURAL'
  | 'NOT_SURE'
  | 'POST_PILL';

/** Role of the user */
export type UserRole =
  | 'ADMIN'
  | 'USER';

/** Status of the user */
export type UserStatus =
  | 'ACTIVE'
  | 'DELETED'
  | 'INACTIVE'
  | 'SUSPENDED';

export type AdminMemberQueryVariables = Exact<{
  id: string;
}>;


export type AdminMemberQuery = { adminMe: { id: string }, adminUser: { id: string, email: string, first_name: string, last_name: string, username: string | null, image_url: string | null, status: UserStatus, role: UserRole, location: string | null, login_provider: string | null, cycle_type: CycleType | null, phase: CyclePhase | null, cycle_day: number | null, cycle_length: number | null, timezone: string | null, age: number | null, suspended_at: string | null, suspension_reason: string | null, lifetime_points: number, level: string, invited_by: string | null, device_platforms: Array<string>, group_names: Array<string>, created_at: string, last_login: string | null, counts: { posts: number, comments: number, groups: number, hangout_bookings: number, moods: number, journal_entries: number, period_logs: number, active_goals: number, badges: number, friends: number, devices: number, active_days_30: number }, recent_posts: Array<{ id: string, excerpt: string, group_name: string, status: string, created_at: string }> }, adminAuditLog: { nodes: Array<{ id: string, action: string, details: unknown, created_at: string, admin_email: string | null }> } };

export type AdminSuspendMutationVariables = Exact<{
  input: AdminSuspendUserInput;
}>;


export type AdminSuspendMutation = { adminSuspendUser: { id: string, status: UserStatus } };

export type AdminReactivateMutationVariables = Exact<{
  id: string;
}>;


export type AdminReactivateMutation = { adminReactivateUser: { id: string, status: UserStatus } };

export type AdminSetRoleMutationVariables = Exact<{
  id: string;
  role: UserRole;
}>;


export type AdminSetRoleMutation = { adminSetUserRole: { id: string, role: UserRole } };

export type AdminDeleteMemberMutationVariables = Exact<{
  id: string;
}>;


export type AdminDeleteMemberMutation = { adminDeleteUser: boolean };

export type AdminMembersQueryVariables = Exact<{
  page?: number | null | undefined;
  limit?: number | null | undefined;
  filter?: AdminUserFilterInput | null | undefined;
}>;


export type AdminMembersQuery = { adminUsers: { total: number, page: number, limit: number, nodes: Array<{ id: string, email: string, first_name: string, last_name: string, username: string | null, image_url: string | null, status: UserStatus, role: UserRole, location: string | null, cycle_type: CycleType | null, phase: CyclePhase | null, created_at: string, last_login: string | null }> } };

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

export const AdminMemberDocument = new TypedDocumentString(`
    query AdminMember($id: String!) {
  adminMe {
    id
  }
  adminUser(id: $id) {
    id
    email
    first_name
    last_name
    username
    image_url
    status
    role
    location
    login_provider
    cycle_type
    phase
    cycle_day
    cycle_length
    timezone
    age
    suspended_at
    suspension_reason
    lifetime_points
    level
    invited_by
    device_platforms
    group_names
    created_at
    last_login
    counts {
      posts
      comments
      groups
      hangout_bookings
      moods
      journal_entries
      period_logs
      active_goals
      badges
      friends
      devices
      active_days_30
    }
    recent_posts {
      id
      excerpt
      group_name
      status
      created_at
    }
  }
  adminAuditLog(target_type: "user", target_id: $id, limit: 10) {
    nodes {
      id
      action
      details
      created_at
      admin_email
    }
  }
}
    `) as unknown as TypedDocumentString<AdminMemberQuery, AdminMemberQueryVariables>;
export const AdminSuspendDocument = new TypedDocumentString(`
    mutation AdminSuspend($input: AdminSuspendUserInput!) {
  adminSuspendUser(input: $input) {
    id
    status
  }
}
    `) as unknown as TypedDocumentString<AdminSuspendMutation, AdminSuspendMutationVariables>;
export const AdminReactivateDocument = new TypedDocumentString(`
    mutation AdminReactivate($id: String!) {
  adminReactivateUser(user_id: $id) {
    id
    status
  }
}
    `) as unknown as TypedDocumentString<AdminReactivateMutation, AdminReactivateMutationVariables>;
export const AdminSetRoleDocument = new TypedDocumentString(`
    mutation AdminSetRole($id: String!, $role: UserRole!) {
  adminSetUserRole(user_id: $id, role: $role) {
    id
    role
  }
}
    `) as unknown as TypedDocumentString<AdminSetRoleMutation, AdminSetRoleMutationVariables>;
export const AdminDeleteMemberDocument = new TypedDocumentString(`
    mutation AdminDeleteMember($id: String!) {
  adminDeleteUser(user_id: $id)
}
    `) as unknown as TypedDocumentString<AdminDeleteMemberMutation, AdminDeleteMemberMutationVariables>;
export const AdminMembersDocument = new TypedDocumentString(`
    query AdminMembers($page: Int, $limit: Int, $filter: AdminUserFilterInput) {
  adminUsers(page: $page, limit: $limit, filter: $filter) {
    total
    page
    limit
    nodes {
      id
      email
      first_name
      last_name
      username
      image_url
      status
      role
      location
      cycle_type
      phase
      created_at
      last_login
    }
  }
}
    `) as unknown as TypedDocumentString<AdminMembersQuery, AdminMembersQueryVariables>;
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