/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type AdminAudienceInput = {
  /** Opened the app in the last N days */
  active_within_days?: number | null | undefined;
  /** City names (matched in her location) */
  cities?: Array<string> | null | undefined;
  cycle_types?: Array<CycleType> | null | undefined;
  /** Joined in the last N days */
  joined_within_days?: number | null | undefined;
  /** ALL, FILTER or MEMBERS */
  kind: string;
  /** Her phase on the day it is sent */
  phases?: Array<CyclePhase> | null | undefined;
  /** MEMBERS: the chosen members */
  user_ids?: Array<string> | null | undefined;
};

export type AdminBlogArticleInput = {
  cover_image?: string | null | undefined;
  first_para?: string | null | undefined;
  id: string;
  interest_tags: Array<string>;
  is_active: boolean;
  phase_tags: Array<CyclePhase>;
  title: string;
  topic_tags: Array<string>;
};

export type AdminCampaignInput = {
  audience: AdminAudienceInput;
  body: string;
  /** Screen a tap opens: today, cycle, progress, glow-up, goals, badges, friends, notifications */
  route: string;
  /** Omit to send now */
  send_at?: string | null | undefined;
  title: string;
};

export type AdminCancelEventInput = {
  id: string;
  /** Tell members who booked */
  notify_attendees?: boolean;
  /** Kept in the audit log */
  reason: string;
};

export type AdminCycleDayRowInput = {
  body_text: string;
  energy_text: string;
  phase: CyclePhase;
  phase_position: PhasePosition;
  variation: number;
};

export type AdminDidYouKnowInput = {
  category: string;
  external_id?: string | null | undefined;
  full_text: string;
  /** Omit to add a fact */
  id?: string | null | undefined;
  is_active?: boolean;
  source_url?: string | null | undefined;
  title: string;
};

export type AdminLibraryDetailInput = {
  body: string;
  icon: string;
  title?: string | null | undefined;
};

export type AdminLibraryItemInput = {
  body: string;
  details?: Array<AdminLibraryDetailInput>;
  /** Omit to add an item */
  id?: string | null | undefined;
  is_active?: boolean;
  kind: ContentKind;
  phase?: CyclePhase | null | undefined;
  title: string;
};

export type AdminLoginInput = {
  email: string;
  password: string;
};

export type AdminModerationInput = {
  id: string;
  /** Kept in the audit log */
  reason: string;
};

export type AdminPostStatusInput = {
  id: string;
  /** Kept in the audit log */
  reason: string;
  /** PUBLISHED or REJECTED */
  status: PostStatus;
};

export type AdminRefreshInput = {
  refresh_token: string;
};

export type AdminSmartCardInput = {
  content_type: string;
  /** True when adding: refuses an id already in use */
  create?: boolean | null | undefined;
  explanation: string;
  headline: string;
  hydration_tip?: string | null | undefined;
  /** e.g. M-E-MOR-01 (Set A) or B-M-E-MOR-01 (Set B) */
  id: string;
  mind?: string | null | undefined;
  phase: CyclePhase;
  phase_position: PhasePosition;
  set: string;
  source?: string | null | undefined;
  source_detail?: string | null | undefined;
  time_of_day: TimeOfDay;
  tone?: string | null | undefined;
};

export type AdminSuspendUserInput = {
  /** Shown in the audit log; keep it factual */
  reason: string;
  user_id: string;
};

export type AdminTestCampaignInput = {
  body: string;
  route: string;
  title: string;
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

/** Where a dashboard notification campaign is: scheduled, sending, sent, cancelled or failed */
export type CampaignStatus =
  | 'CANCELLED'
  | 'FAILED'
  | 'SCHEDULED'
  | 'SENDING'
  | 'SENT';

/** Kind of daily content card */
export type ContentKind =
  | 'ARTICLE'
  | 'DID_YOU_KNOW'
  | 'INSIGHT'
  | 'JOURNAL_PROMPT';

export type CreateEventInput = {
  capacity?: number | null | undefined;
  city?: string | null | undefined;
  cover_image_url?: string | null | undefined;
  description?: string | null | undefined;
  doors_open_at?: string | null | undefined;
  end_time: string;
  fee_amount?: number | null | undefined;
  host_description?: string | null | undefined;
  host_image_url?: string | null | undefined;
  host_name?: string | null | undefined;
  is_online: boolean;
  location_address?: string | null | undefined;
  location_place_id?: string | null | undefined;
  meeting_url?: string | null | undefined;
  phase_tip?: string | null | undefined;
  recommended_phases?: Array<CyclePhase> | null | undefined;
  start_time: string;
  status?: EventStatus | null | undefined;
  title: string;
  /** Onboarding interest ids, e.g. IN_ACTIVITIES_0004 */
  topics?: Array<string> | null | undefined;
  venue_details?: string | null | undefined;
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

/** Whether an event is going ahead */
export type EventStatus =
  | 'CANCELED'
  | 'SCHEDULED';

/** Whether anyone can join or join requests need approval */
export type GroupType =
  | 'PRIVATE'
  | 'PUBLIC';

/** Where in her phase today falls (early, mid, late; ovulation is unique) */
export type PhasePosition =
  | 'EARLY'
  | 'LATE'
  | 'MID'
  | 'UNIQUE';

export type PostStatus =
  | 'APPROVAL_PENDING'
  | 'ARCHIVED'
  | 'DELETED'
  | 'DRAFT'
  | 'PUBLISHED'
  | 'REJECTED';

/** Which part of the day a smart card is written for */
export type TimeOfDay =
  | 'AFTERNOON'
  | 'EVENING'
  | 'MORNING';

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

export type AdminAuditQueryVariables = Exact<{
  page?: number | null | undefined;
  limit?: number | null | undefined;
  action?: string | null | undefined;
  type?: string | null | undefined;
  target?: string | null | undefined;
}>;


export type AdminAuditQuery = { adminAuditLog: { total: number, page: number, limit: number, nodes: Array<{ id: string, action: string, target_type: string | null, target_id: string | null, details: unknown, created_at: string, admin_email: string | null, admin_name: string | null }> } };

export type AdminSetPostStatusMutationVariables = Exact<{
  input: AdminPostStatusInput;
}>;


export type AdminSetPostStatusMutation = { adminSetPostStatus: boolean };

export type AdminDeletePostMutationVariables = Exact<{
  input: AdminModerationInput;
}>;


export type AdminDeletePostMutation = { adminDeletePost: boolean };

export type AdminPostCommentsQueryVariables = Exact<{
  id: string;
}>;


export type AdminPostCommentsQuery = { adminPostComments: Array<{ id: string, content: string, parent_id: string | null, likes: number, created_at: string, author: { id: string, name: string, email: string, image_url: string | null } }> };

export type AdminDeleteCommentMutationVariables = Exact<{
  input: AdminModerationInput;
}>;


export type AdminDeleteCommentMutation = { adminDeleteComment: boolean };

export type AdminDeleteGroupMutationVariables = Exact<{
  input: AdminModerationInput;
}>;


export type AdminDeleteGroupMutation = { adminDeleteGroup: boolean };

export type AdminSaveEventMutationVariables = Exact<{
  id?: string | null | undefined;
  input: CreateEventInput;
}>;


export type AdminSaveEventMutation = { adminSaveEvent: { id: string, title: string } };

export type AdminCancelEventMutationVariables = Exact<{
  input: AdminCancelEventInput;
}>;


export type AdminCancelEventMutation = { adminCancelEvent: boolean };

export type AdminGroupsQueryVariables = Exact<{
  page?: number | null | undefined;
  limit?: number | null | undefined;
  search?: string | null | undefined;
  type?: GroupType | null | undefined;
}>;


export type AdminGroupsQuery = { adminGroups: { total: number, page: number, limit: number, nodes: Array<{ id: string, name: string, description: string | null, type: GroupType, image_url: string | null, location: string | null, phase_tag: CyclePhase | null, members: number, posts: number, pending: number, created_at: string, owner: { id: string, name: string, email: string, image_url: string | null } }> } };

export type AdminHangoutsQueryVariables = Exact<{
  page?: number | null | undefined;
  limit?: number | null | undefined;
  when?: string | null | undefined;
  search?: string | null | undefined;
}>;


export type AdminHangoutsQuery = { adminEvents: { total: number, page: number, limit: number, nodes: Array<{ id: string, title: string, description: string | null, cover_image_url: string | null, status: EventStatus, city: string | null, location_address: string | null, venue_details: string | null, meeting_url: string | null, is_online: boolean, start_time: string | null, end_time: string | null, doors_open_at: string | null, capacity: number | null, fee_amount: number | null, host_name: string | null, host_description: string | null, host_image_url: string | null, recommended_phases: Array<CyclePhase>, phase_tip: string | null, topics: Array<string>, going: number, cancelled: number, created_at: string }> }, adminInterests: Array<{ id: string, name: string }> };

export type AdminPostsQueryVariables = Exact<{
  page?: number | null | undefined;
  limit?: number | null | undefined;
  status?: PostStatus | null | undefined;
  search?: string | null | undefined;
  group?: string | null | undefined;
  author?: string | null | undefined;
}>;


export type AdminPostsQuery = { adminPosts: { total: number, page: number, limit: number, nodes: Array<{ id: string, content: string, status: PostStatus, group_id: string, group_name: string, author_phase: CyclePhase | null, likes: number, comments: number, helpfuls: number, saves: number, created_at: string, author: { id: string, name: string, email: string, image_url: string | null } }> } };

export type AdminSaveCardMutationVariables = Exact<{
  input: AdminSmartCardInput;
}>;


export type AdminSaveCardMutation = { adminSaveSmartCard: { id: string } };

export type AdminDeleteCardMutationVariables = Exact<{
  id: string;
}>;


export type AdminDeleteCardMutation = { adminDeleteSmartCard: boolean };

export type AdminSaveFactMutationVariables = Exact<{
  input: AdminDidYouKnowInput;
}>;


export type AdminSaveFactMutation = { adminSaveDidYouKnow: { id: string } };

export type AdminDeleteFactMutationVariables = Exact<{
  id: string;
}>;


export type AdminDeleteFactMutation = { adminDeleteDidYouKnow: boolean };

export type AdminSaveDayRowMutationVariables = Exact<{
  input: AdminCycleDayRowInput;
}>;


export type AdminSaveDayRowMutation = { adminSaveCycleDayRow: { row_id: string } };

export type AdminDeleteDayRowMutationVariables = Exact<{
  id: string;
}>;


export type AdminDeleteDayRowMutation = { adminDeleteCycleDayRow: boolean };

export type AdminSaveArticleMutationVariables = Exact<{
  input: AdminBlogArticleInput;
}>;


export type AdminSaveArticleMutation = { adminSaveBlogArticle: { id: string } };

export type AdminRefreshArticleMutationVariables = Exact<{
  id: string;
}>;


export type AdminRefreshArticleMutation = { adminRefreshBlogArticle: { id: string } };

export type AdminSaveLibraryItemMutationVariables = Exact<{
  input: AdminLibraryItemInput;
}>;


export type AdminSaveLibraryItemMutation = { adminSaveLibraryItem: { id: string } };

export type AdminDeleteLibraryItemMutationVariables = Exact<{
  id: string;
}>;


export type AdminDeleteLibraryItemMutation = { adminDeleteLibraryItem: boolean };

export type AdminArticlesQueryVariables = Exact<{
  page?: number | null | undefined;
  limit?: number | null | undefined;
  search?: string | null | undefined;
  active?: boolean | null | undefined;
  phase?: CyclePhase | null | undefined;
}>;


export type AdminArticlesQuery = { adminBlogArticles: { total: number, page: number, limit: number, nodes: Array<{ id: string, slug: string, title: string, url: string, cover_image: string | null, first_para: string | null, phase_tags: Array<CyclePhase>, interest_tags: Array<string>, topic_tags: Array<string>, published_at: string | null, is_active: boolean, impressions: number }> } };

export type AdminDayRowsQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminDayRowsQuery = { adminCycleDayRows: Array<{ row_id: string, phase: CyclePhase, phase_position: PhasePosition, variation: number, body_text: string, energy_text: string }> };

export type AdminFactsQueryVariables = Exact<{
  page?: number | null | undefined;
  limit?: number | null | undefined;
  search?: string | null | undefined;
  category?: string | null | undefined;
  active?: boolean | null | undefined;
}>;


export type AdminFactsQuery = { adminDidYouKnow: { total: number, page: number, limit: number, nodes: Array<{ id: string, external_id: string | null, category: string | null, title: string, full_text: string, source_url: string | null, is_active: boolean, position: number }> } };

export type AdminLibraryQueryVariables = Exact<{
  page?: number | null | undefined;
  limit?: number | null | undefined;
  kind?: ContentKind | null | undefined;
  phase?: CyclePhase | null | undefined;
  search?: string | null | undefined;
  active?: boolean | null | undefined;
}>;


export type AdminLibraryQuery = { adminLibraryItems: { total: number, page: number, limit: number, nodes: Array<{ id: string, kind: ContentKind, phase: CyclePhase | null, title: string, body: string, is_active: boolean, updated_at: string, details: Array<{ icon: string, title: string | null, body: string }> }> } };

export type AdminCardsQueryVariables = Exact<{
  page?: number | null | undefined;
  limit?: number | null | undefined;
  set?: string | null | undefined;
  phase?: CyclePhase | null | undefined;
  position?: PhasePosition | null | undefined;
  time?: TimeOfDay | null | undefined;
  search?: string | null | undefined;
}>;


export type AdminCardsQuery = { adminSmartCards: { total: number, page: number, limit: number, nodes: Array<{ id: string, set: string, phase: CyclePhase, phase_position: PhasePosition, time_of_day: TimeOfDay, content_type: string, tone: string | null, headline: string, explanation: string, mind: string | null, hydration_tip: string | null, source: string | null, source_detail: string | null }> } };

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

export type AdminAudienceCountQueryVariables = Exact<{
  audience: AdminAudienceInput;
}>;


export type AdminAudienceCountQuery = { adminAudienceCount: { members: number, reachable: number } };

export type AdminCampaignMemberSearchQueryVariables = Exact<{
  search?: string | null | undefined;
}>;


export type AdminCampaignMemberSearchQuery = { adminUsers: { nodes: Array<{ id: string, first_name: string, last_name: string, email: string, image_url: string | null }> } };

export type AdminCreateCampaignMutationVariables = Exact<{
  input: AdminCampaignInput;
}>;


export type AdminCreateCampaignMutation = { adminCreateCampaign: { id: string, status: CampaignStatus, recipients: number, pushed: number, queued: number, inbox_only: number } };

export type AdminCancelCampaignMutationVariables = Exact<{
  id: string;
}>;


export type AdminCancelCampaignMutation = { adminCancelCampaign: { id: string, status: CampaignStatus } };

export type AdminTestCampaignMutationVariables = Exact<{
  input: AdminTestCampaignInput;
}>;


export type AdminTestCampaignMutation = { adminTestCampaign: { pushed: number, devices: number, queued: boolean } };

export type AdminCampaignHistoryQueryVariables = Exact<{
  page?: number | null | undefined;
}>;


export type AdminCampaignHistoryQuery = { adminCampaigns: { total: number, page: number, limit: number, nodes: Array<{ id: string, title: string, body: string, audience_label: string, status: CampaignStatus, scheduled_at: string | null, sent_at: string | null, error: string | null, recipients: number, pushed: number, queued: number, inbox_only: number, created_by_name: string | null, created_at: string }> } };

export type AdminCampaignRecipientQueryVariables = Exact<{
  id: string;
}>;


export type AdminCampaignRecipientQuery = { adminUser: { id: string, first_name: string, last_name: string, email: string, image_url: string | null, status: UserStatus } };

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

export const AdminAuditDocument = new TypedDocumentString(`
    query AdminAudit($page: Int, $limit: Int, $action: String, $type: String, $target: String) {
  adminAuditLog(
    page: $page
    limit: $limit
    action: $action
    target_type: $type
    target_id: $target
  ) {
    total
    page
    limit
    nodes {
      id
      action
      target_type
      target_id
      details
      created_at
      admin_email
      admin_name
    }
  }
}
    `) as unknown as TypedDocumentString<AdminAuditQuery, AdminAuditQueryVariables>;
export const AdminSetPostStatusDocument = new TypedDocumentString(`
    mutation AdminSetPostStatus($input: AdminPostStatusInput!) {
  adminSetPostStatus(input: $input)
}
    `) as unknown as TypedDocumentString<AdminSetPostStatusMutation, AdminSetPostStatusMutationVariables>;
export const AdminDeletePostDocument = new TypedDocumentString(`
    mutation AdminDeletePost($input: AdminModerationInput!) {
  adminDeletePost(input: $input)
}
    `) as unknown as TypedDocumentString<AdminDeletePostMutation, AdminDeletePostMutationVariables>;
export const AdminPostCommentsDocument = new TypedDocumentString(`
    query AdminPostComments($id: String!) {
  adminPostComments(post_id: $id) {
    id
    content
    parent_id
    likes
    created_at
    author {
      id
      name
      email
      image_url
    }
  }
}
    `) as unknown as TypedDocumentString<AdminPostCommentsQuery, AdminPostCommentsQueryVariables>;
export const AdminDeleteCommentDocument = new TypedDocumentString(`
    mutation AdminDeleteComment($input: AdminModerationInput!) {
  adminDeleteComment(input: $input)
}
    `) as unknown as TypedDocumentString<AdminDeleteCommentMutation, AdminDeleteCommentMutationVariables>;
export const AdminDeleteGroupDocument = new TypedDocumentString(`
    mutation AdminDeleteGroup($input: AdminModerationInput!) {
  adminDeleteGroup(input: $input)
}
    `) as unknown as TypedDocumentString<AdminDeleteGroupMutation, AdminDeleteGroupMutationVariables>;
export const AdminSaveEventDocument = new TypedDocumentString(`
    mutation AdminSaveEvent($id: String, $input: CreateEventInput!) {
  adminSaveEvent(id: $id, input: $input) {
    id
    title
  }
}
    `) as unknown as TypedDocumentString<AdminSaveEventMutation, AdminSaveEventMutationVariables>;
export const AdminCancelEventDocument = new TypedDocumentString(`
    mutation AdminCancelEvent($input: AdminCancelEventInput!) {
  adminCancelEvent(input: $input)
}
    `) as unknown as TypedDocumentString<AdminCancelEventMutation, AdminCancelEventMutationVariables>;
export const AdminGroupsDocument = new TypedDocumentString(`
    query AdminGroups($page: Int, $limit: Int, $search: String, $type: GroupType) {
  adminGroups(page: $page, limit: $limit, search: $search, type: $type) {
    total
    page
    limit
    nodes {
      id
      name
      description
      type
      image_url
      location
      phase_tag
      members
      posts
      pending
      created_at
      owner {
        id
        name
        email
        image_url
      }
    }
  }
}
    `) as unknown as TypedDocumentString<AdminGroupsQuery, AdminGroupsQueryVariables>;
export const AdminHangoutsDocument = new TypedDocumentString(`
    query AdminHangouts($page: Int, $limit: Int, $when: String, $search: String) {
  adminEvents(page: $page, limit: $limit, when: $when, search: $search) {
    total
    page
    limit
    nodes {
      id
      title
      description
      cover_image_url
      status
      city
      location_address
      venue_details
      meeting_url
      is_online
      start_time
      end_time
      doors_open_at
      capacity
      fee_amount
      host_name
      host_description
      host_image_url
      recommended_phases
      phase_tip
      topics
      going
      cancelled
      created_at
    }
  }
  adminInterests {
    id
    name
  }
}
    `) as unknown as TypedDocumentString<AdminHangoutsQuery, AdminHangoutsQueryVariables>;
export const AdminPostsDocument = new TypedDocumentString(`
    query AdminPosts($page: Int, $limit: Int, $status: PostStatus, $search: String, $group: String, $author: String) {
  adminPosts(
    page: $page
    limit: $limit
    status: $status
    search: $search
    group_id: $group
    author_id: $author
  ) {
    total
    page
    limit
    nodes {
      id
      content
      status
      group_id
      group_name
      author_phase
      likes
      comments
      helpfuls
      saves
      created_at
      author {
        id
        name
        email
        image_url
      }
    }
  }
}
    `) as unknown as TypedDocumentString<AdminPostsQuery, AdminPostsQueryVariables>;
export const AdminSaveCardDocument = new TypedDocumentString(`
    mutation AdminSaveCard($input: AdminSmartCardInput!) {
  adminSaveSmartCard(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<AdminSaveCardMutation, AdminSaveCardMutationVariables>;
export const AdminDeleteCardDocument = new TypedDocumentString(`
    mutation AdminDeleteCard($id: String!) {
  adminDeleteSmartCard(id: $id)
}
    `) as unknown as TypedDocumentString<AdminDeleteCardMutation, AdminDeleteCardMutationVariables>;
export const AdminSaveFactDocument = new TypedDocumentString(`
    mutation AdminSaveFact($input: AdminDidYouKnowInput!) {
  adminSaveDidYouKnow(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<AdminSaveFactMutation, AdminSaveFactMutationVariables>;
export const AdminDeleteFactDocument = new TypedDocumentString(`
    mutation AdminDeleteFact($id: String!) {
  adminDeleteDidYouKnow(id: $id)
}
    `) as unknown as TypedDocumentString<AdminDeleteFactMutation, AdminDeleteFactMutationVariables>;
export const AdminSaveDayRowDocument = new TypedDocumentString(`
    mutation AdminSaveDayRow($input: AdminCycleDayRowInput!) {
  adminSaveCycleDayRow(input: $input) {
    row_id
  }
}
    `) as unknown as TypedDocumentString<AdminSaveDayRowMutation, AdminSaveDayRowMutationVariables>;
export const AdminDeleteDayRowDocument = new TypedDocumentString(`
    mutation AdminDeleteDayRow($id: String!) {
  adminDeleteCycleDayRow(row_id: $id)
}
    `) as unknown as TypedDocumentString<AdminDeleteDayRowMutation, AdminDeleteDayRowMutationVariables>;
export const AdminSaveArticleDocument = new TypedDocumentString(`
    mutation AdminSaveArticle($input: AdminBlogArticleInput!) {
  adminSaveBlogArticle(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<AdminSaveArticleMutation, AdminSaveArticleMutationVariables>;
export const AdminRefreshArticleDocument = new TypedDocumentString(`
    mutation AdminRefreshArticle($id: String!) {
  adminRefreshBlogArticle(id: $id) {
    id
  }
}
    `) as unknown as TypedDocumentString<AdminRefreshArticleMutation, AdminRefreshArticleMutationVariables>;
export const AdminSaveLibraryItemDocument = new TypedDocumentString(`
    mutation AdminSaveLibraryItem($input: AdminLibraryItemInput!) {
  adminSaveLibraryItem(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<AdminSaveLibraryItemMutation, AdminSaveLibraryItemMutationVariables>;
export const AdminDeleteLibraryItemDocument = new TypedDocumentString(`
    mutation AdminDeleteLibraryItem($id: String!) {
  adminDeleteLibraryItem(id: $id)
}
    `) as unknown as TypedDocumentString<AdminDeleteLibraryItemMutation, AdminDeleteLibraryItemMutationVariables>;
export const AdminArticlesDocument = new TypedDocumentString(`
    query AdminArticles($page: Int, $limit: Int, $search: String, $active: Boolean, $phase: CyclePhase) {
  adminBlogArticles(
    page: $page
    limit: $limit
    search: $search
    active: $active
    phase: $phase
  ) {
    total
    page
    limit
    nodes {
      id
      slug
      title
      url
      cover_image
      first_para
      phase_tags
      interest_tags
      topic_tags
      published_at
      is_active
      impressions
    }
  }
}
    `) as unknown as TypedDocumentString<AdminArticlesQuery, AdminArticlesQueryVariables>;
export const AdminDayRowsDocument = new TypedDocumentString(`
    query AdminDayRows {
  adminCycleDayRows {
    row_id
    phase
    phase_position
    variation
    body_text
    energy_text
  }
}
    `) as unknown as TypedDocumentString<AdminDayRowsQuery, AdminDayRowsQueryVariables>;
export const AdminFactsDocument = new TypedDocumentString(`
    query AdminFacts($page: Int, $limit: Int, $search: String, $category: String, $active: Boolean) {
  adminDidYouKnow(
    page: $page
    limit: $limit
    search: $search
    category: $category
    active: $active
  ) {
    total
    page
    limit
    nodes {
      id
      external_id
      category
      title
      full_text
      source_url
      is_active
      position
    }
  }
}
    `) as unknown as TypedDocumentString<AdminFactsQuery, AdminFactsQueryVariables>;
export const AdminLibraryDocument = new TypedDocumentString(`
    query AdminLibrary($page: Int, $limit: Int, $kind: ContentKind, $phase: CyclePhase, $search: String, $active: Boolean) {
  adminLibraryItems(
    page: $page
    limit: $limit
    kind: $kind
    phase: $phase
    search: $search
    active: $active
  ) {
    total
    page
    limit
    nodes {
      id
      kind
      phase
      title
      body
      details {
        icon
        title
        body
      }
      is_active
      updated_at
    }
  }
}
    `) as unknown as TypedDocumentString<AdminLibraryQuery, AdminLibraryQueryVariables>;
export const AdminCardsDocument = new TypedDocumentString(`
    query AdminCards($page: Int, $limit: Int, $set: String, $phase: CyclePhase, $position: PhasePosition, $time: TimeOfDay, $search: String) {
  adminSmartCards(
    page: $page
    limit: $limit
    set: $set
    phase: $phase
    phase_position: $position
    time_of_day: $time
    search: $search
  ) {
    total
    page
    limit
    nodes {
      id
      set
      phase
      phase_position
      time_of_day
      content_type
      tone
      headline
      explanation
      mind
      hydration_tip
      source
      source_detail
    }
  }
}
    `) as unknown as TypedDocumentString<AdminCardsQuery, AdminCardsQueryVariables>;
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
export const AdminAudienceCountDocument = new TypedDocumentString(`
    query AdminAudienceCount($audience: AdminAudienceInput!) {
  adminAudienceCount(audience: $audience) {
    members
    reachable
  }
}
    `) as unknown as TypedDocumentString<AdminAudienceCountQuery, AdminAudienceCountQueryVariables>;
export const AdminCampaignMemberSearchDocument = new TypedDocumentString(`
    query AdminCampaignMemberSearch($search: String) {
  adminUsers(limit: 8, filter: { search: $search, status: ACTIVE }) {
    nodes {
      id
      first_name
      last_name
      email
      image_url
    }
  }
}
    `) as unknown as TypedDocumentString<AdminCampaignMemberSearchQuery, AdminCampaignMemberSearchQueryVariables>;
export const AdminCreateCampaignDocument = new TypedDocumentString(`
    mutation AdminCreateCampaign($input: AdminCampaignInput!) {
  adminCreateCampaign(input: $input) {
    id
    status
    recipients
    pushed
    queued
    inbox_only
  }
}
    `) as unknown as TypedDocumentString<AdminCreateCampaignMutation, AdminCreateCampaignMutationVariables>;
export const AdminCancelCampaignDocument = new TypedDocumentString(`
    mutation AdminCancelCampaign($id: String!) {
  adminCancelCampaign(id: $id) {
    id
    status
  }
}
    `) as unknown as TypedDocumentString<AdminCancelCampaignMutation, AdminCancelCampaignMutationVariables>;
export const AdminTestCampaignDocument = new TypedDocumentString(`
    mutation AdminTestCampaign($input: AdminTestCampaignInput!) {
  adminTestCampaign(input: $input) {
    pushed
    devices
    queued
  }
}
    `) as unknown as TypedDocumentString<AdminTestCampaignMutation, AdminTestCampaignMutationVariables>;
export const AdminCampaignHistoryDocument = new TypedDocumentString(`
    query AdminCampaignHistory($page: Int) {
  adminCampaigns(page: $page, limit: 15) {
    total
    page
    limit
    nodes {
      id
      title
      body
      audience_label
      status
      scheduled_at
      sent_at
      error
      recipients
      pushed
      queued
      inbox_only
      created_by_name
      created_at
    }
  }
}
    `) as unknown as TypedDocumentString<AdminCampaignHistoryQuery, AdminCampaignHistoryQueryVariables>;
export const AdminCampaignRecipientDocument = new TypedDocumentString(`
    query AdminCampaignRecipient($id: String!) {
  adminUser(id: $id) {
    id
    first_name
    last_name
    email
    image_url
    status
  }
}
    `) as unknown as TypedDocumentString<AdminCampaignRecipientQuery, AdminCampaignRecipientQueryVariables>;
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