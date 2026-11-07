/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query AdminMember($id: String!) {\n    adminMe { id }\n    adminUser(id: $id) {\n      id\n      email\n      first_name\n      last_name\n      username\n      image_url\n      status\n      role\n      location\n      login_provider\n      cycle_type\n      phase\n      cycle_day\n      cycle_length\n      timezone\n      age\n      suspended_at\n      suspension_reason\n      lifetime_points\n      level\n      invited_by\n      device_platforms\n      group_names\n      created_at\n      last_login\n      counts {\n        posts\n        comments\n        groups\n        hangout_bookings\n        moods\n        journal_entries\n        period_logs\n        active_goals\n        badges\n        friends\n        devices\n        active_days_30\n      }\n      recent_posts { id excerpt group_name status created_at }\n    }\n    adminAuditLog(target_type: \"user\", target_id: $id, limit: 10) {\n      nodes { id action details created_at admin_email }\n    }\n  }\n": typeof types.AdminMemberDocument,
    "\n  mutation AdminSuspend($input: AdminSuspendUserInput!) {\n    adminSuspendUser(input: $input) { id status }\n  }\n": typeof types.AdminSuspendDocument,
    "\n  mutation AdminReactivate($id: String!) {\n    adminReactivateUser(user_id: $id) { id status }\n  }\n": typeof types.AdminReactivateDocument,
    "\n  mutation AdminSetRole($id: String!, $role: UserRole!) {\n    adminSetUserRole(user_id: $id, role: $role) { id role }\n  }\n": typeof types.AdminSetRoleDocument,
    "\n  mutation AdminDeleteMember($id: String!) {\n    adminDeleteUser(user_id: $id)\n  }\n": typeof types.AdminDeleteMemberDocument,
    "\n  query AdminMembers($page: Int, $limit: Int, $filter: AdminUserFilterInput) {\n    adminUsers(page: $page, limit: $limit, filter: $filter) {\n      total\n      page\n      limit\n      nodes {\n        id\n        email\n        first_name\n        last_name\n        username\n        image_url\n        status\n        role\n        location\n        cycle_type\n        phase\n        created_at\n        last_login\n      }\n    }\n  }\n": typeof types.AdminMembersDocument,
    "\n  query AdminOverview($days: Int) {\n    adminOverview(days: $days) {\n      range_days\n      from\n      to\n      kpis {\n        total_members\n        new_members\n        new_members_previous\n        active_today\n        active_week\n        active_month\n        stickiness\n        with_cycle\n        push_reachable\n        suspended\n      }\n      series { key points { date value } }\n      cycle_types { key label count }\n      phases_today { key label count }\n      cities { key label count }\n      glow_levels { key label count }\n      interests { key label count }\n      moods { key label count }\n      goals { key label count }\n      community { posts comments likes groups bookings upcoming_hangouts }\n      top_groups { key label count }\n      content {\n        insight_views\n        insight_views_set_a\n        insight_views_set_b\n        discoveries_shown\n        discoveries_dismissed\n        article_impressions\n        ai_questions\n      }\n      top_articles { key label count }\n      notifications { sent read by_topic { key label count } }\n    }\n  }\n": typeof types.AdminOverviewDocument,
    "\n  mutation AdminLogin($input: AdminLoginInput!) {\n    adminLogin(input: $input) {\n      access_token\n      refresh_token\n      expires_in\n    }\n  }\n": typeof types.AdminLoginDocument,
    "\n  query AdminMe {\n    adminMe {\n      id\n      email\n      first_name\n      last_name\n      image_url\n    }\n  }\n": typeof types.AdminMeDocument,
    "\n  mutation AdminRefresh($input: AdminRefreshInput!) {\n    adminRefresh(input: $input) {\n      access_token\n      refresh_token\n      expires_in\n    }\n  }\n": typeof types.AdminRefreshDocument,
};
const documents: Documents = {
    "\n  query AdminMember($id: String!) {\n    adminMe { id }\n    adminUser(id: $id) {\n      id\n      email\n      first_name\n      last_name\n      username\n      image_url\n      status\n      role\n      location\n      login_provider\n      cycle_type\n      phase\n      cycle_day\n      cycle_length\n      timezone\n      age\n      suspended_at\n      suspension_reason\n      lifetime_points\n      level\n      invited_by\n      device_platforms\n      group_names\n      created_at\n      last_login\n      counts {\n        posts\n        comments\n        groups\n        hangout_bookings\n        moods\n        journal_entries\n        period_logs\n        active_goals\n        badges\n        friends\n        devices\n        active_days_30\n      }\n      recent_posts { id excerpt group_name status created_at }\n    }\n    adminAuditLog(target_type: \"user\", target_id: $id, limit: 10) {\n      nodes { id action details created_at admin_email }\n    }\n  }\n": types.AdminMemberDocument,
    "\n  mutation AdminSuspend($input: AdminSuspendUserInput!) {\n    adminSuspendUser(input: $input) { id status }\n  }\n": types.AdminSuspendDocument,
    "\n  mutation AdminReactivate($id: String!) {\n    adminReactivateUser(user_id: $id) { id status }\n  }\n": types.AdminReactivateDocument,
    "\n  mutation AdminSetRole($id: String!, $role: UserRole!) {\n    adminSetUserRole(user_id: $id, role: $role) { id role }\n  }\n": types.AdminSetRoleDocument,
    "\n  mutation AdminDeleteMember($id: String!) {\n    adminDeleteUser(user_id: $id)\n  }\n": types.AdminDeleteMemberDocument,
    "\n  query AdminMembers($page: Int, $limit: Int, $filter: AdminUserFilterInput) {\n    adminUsers(page: $page, limit: $limit, filter: $filter) {\n      total\n      page\n      limit\n      nodes {\n        id\n        email\n        first_name\n        last_name\n        username\n        image_url\n        status\n        role\n        location\n        cycle_type\n        phase\n        created_at\n        last_login\n      }\n    }\n  }\n": types.AdminMembersDocument,
    "\n  query AdminOverview($days: Int) {\n    adminOverview(days: $days) {\n      range_days\n      from\n      to\n      kpis {\n        total_members\n        new_members\n        new_members_previous\n        active_today\n        active_week\n        active_month\n        stickiness\n        with_cycle\n        push_reachable\n        suspended\n      }\n      series { key points { date value } }\n      cycle_types { key label count }\n      phases_today { key label count }\n      cities { key label count }\n      glow_levels { key label count }\n      interests { key label count }\n      moods { key label count }\n      goals { key label count }\n      community { posts comments likes groups bookings upcoming_hangouts }\n      top_groups { key label count }\n      content {\n        insight_views\n        insight_views_set_a\n        insight_views_set_b\n        discoveries_shown\n        discoveries_dismissed\n        article_impressions\n        ai_questions\n      }\n      top_articles { key label count }\n      notifications { sent read by_topic { key label count } }\n    }\n  }\n": types.AdminOverviewDocument,
    "\n  mutation AdminLogin($input: AdminLoginInput!) {\n    adminLogin(input: $input) {\n      access_token\n      refresh_token\n      expires_in\n    }\n  }\n": types.AdminLoginDocument,
    "\n  query AdminMe {\n    adminMe {\n      id\n      email\n      first_name\n      last_name\n      image_url\n    }\n  }\n": types.AdminMeDocument,
    "\n  mutation AdminRefresh($input: AdminRefreshInput!) {\n    adminRefresh(input: $input) {\n      access_token\n      refresh_token\n      expires_in\n    }\n  }\n": types.AdminRefreshDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminMember($id: String!) {\n    adminMe { id }\n    adminUser(id: $id) {\n      id\n      email\n      first_name\n      last_name\n      username\n      image_url\n      status\n      role\n      location\n      login_provider\n      cycle_type\n      phase\n      cycle_day\n      cycle_length\n      timezone\n      age\n      suspended_at\n      suspension_reason\n      lifetime_points\n      level\n      invited_by\n      device_platforms\n      group_names\n      created_at\n      last_login\n      counts {\n        posts\n        comments\n        groups\n        hangout_bookings\n        moods\n        journal_entries\n        period_logs\n        active_goals\n        badges\n        friends\n        devices\n        active_days_30\n      }\n      recent_posts { id excerpt group_name status created_at }\n    }\n    adminAuditLog(target_type: \"user\", target_id: $id, limit: 10) {\n      nodes { id action details created_at admin_email }\n    }\n  }\n"): typeof import('./graphql').AdminMemberDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminSuspend($input: AdminSuspendUserInput!) {\n    adminSuspendUser(input: $input) { id status }\n  }\n"): typeof import('./graphql').AdminSuspendDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminReactivate($id: String!) {\n    adminReactivateUser(user_id: $id) { id status }\n  }\n"): typeof import('./graphql').AdminReactivateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminSetRole($id: String!, $role: UserRole!) {\n    adminSetUserRole(user_id: $id, role: $role) { id role }\n  }\n"): typeof import('./graphql').AdminSetRoleDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminDeleteMember($id: String!) {\n    adminDeleteUser(user_id: $id)\n  }\n"): typeof import('./graphql').AdminDeleteMemberDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminMembers($page: Int, $limit: Int, $filter: AdminUserFilterInput) {\n    adminUsers(page: $page, limit: $limit, filter: $filter) {\n      total\n      page\n      limit\n      nodes {\n        id\n        email\n        first_name\n        last_name\n        username\n        image_url\n        status\n        role\n        location\n        cycle_type\n        phase\n        created_at\n        last_login\n      }\n    }\n  }\n"): typeof import('./graphql').AdminMembersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminOverview($days: Int) {\n    adminOverview(days: $days) {\n      range_days\n      from\n      to\n      kpis {\n        total_members\n        new_members\n        new_members_previous\n        active_today\n        active_week\n        active_month\n        stickiness\n        with_cycle\n        push_reachable\n        suspended\n      }\n      series { key points { date value } }\n      cycle_types { key label count }\n      phases_today { key label count }\n      cities { key label count }\n      glow_levels { key label count }\n      interests { key label count }\n      moods { key label count }\n      goals { key label count }\n      community { posts comments likes groups bookings upcoming_hangouts }\n      top_groups { key label count }\n      content {\n        insight_views\n        insight_views_set_a\n        insight_views_set_b\n        discoveries_shown\n        discoveries_dismissed\n        article_impressions\n        ai_questions\n      }\n      top_articles { key label count }\n      notifications { sent read by_topic { key label count } }\n    }\n  }\n"): typeof import('./graphql').AdminOverviewDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminLogin($input: AdminLoginInput!) {\n    adminLogin(input: $input) {\n      access_token\n      refresh_token\n      expires_in\n    }\n  }\n"): typeof import('./graphql').AdminLoginDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminMe {\n    adminMe {\n      id\n      email\n      first_name\n      last_name\n      image_url\n    }\n  }\n"): typeof import('./graphql').AdminMeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminRefresh($input: AdminRefreshInput!) {\n    adminRefresh(input: $input) {\n      access_token\n      refresh_token\n      expires_in\n    }\n  }\n"): typeof import('./graphql').AdminRefreshDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
