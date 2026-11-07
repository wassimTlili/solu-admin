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
    "\n  query AdminOverview($days: Int) {\n    adminOverview(days: $days) {\n      range_days\n      from\n      to\n      kpis {\n        total_members\n        new_members\n        new_members_previous\n        active_today\n        active_week\n        active_month\n        stickiness\n        with_cycle\n        push_reachable\n        suspended\n      }\n      series { key points { date value } }\n      cycle_types { key label count }\n      phases_today { key label count }\n      cities { key label count }\n      glow_levels { key label count }\n      interests { key label count }\n      moods { key label count }\n      goals { key label count }\n      community { posts comments likes groups bookings upcoming_hangouts }\n      top_groups { key label count }\n      content {\n        insight_views\n        insight_views_set_a\n        insight_views_set_b\n        discoveries_shown\n        discoveries_dismissed\n        article_impressions\n        ai_questions\n      }\n      top_articles { key label count }\n      notifications { sent read by_topic { key label count } }\n    }\n  }\n": typeof types.AdminOverviewDocument,
    "\n  mutation AdminLogin($input: AdminLoginInput!) {\n    adminLogin(input: $input) {\n      access_token\n      refresh_token\n      expires_in\n    }\n  }\n": typeof types.AdminLoginDocument,
    "\n  query AdminMe {\n    adminMe {\n      id\n      email\n      first_name\n      last_name\n      image_url\n    }\n  }\n": typeof types.AdminMeDocument,
    "\n  mutation AdminRefresh($input: AdminRefreshInput!) {\n    adminRefresh(input: $input) {\n      access_token\n      refresh_token\n      expires_in\n    }\n  }\n": typeof types.AdminRefreshDocument,
};
const documents: Documents = {
    "\n  query AdminOverview($days: Int) {\n    adminOverview(days: $days) {\n      range_days\n      from\n      to\n      kpis {\n        total_members\n        new_members\n        new_members_previous\n        active_today\n        active_week\n        active_month\n        stickiness\n        with_cycle\n        push_reachable\n        suspended\n      }\n      series { key points { date value } }\n      cycle_types { key label count }\n      phases_today { key label count }\n      cities { key label count }\n      glow_levels { key label count }\n      interests { key label count }\n      moods { key label count }\n      goals { key label count }\n      community { posts comments likes groups bookings upcoming_hangouts }\n      top_groups { key label count }\n      content {\n        insight_views\n        insight_views_set_a\n        insight_views_set_b\n        discoveries_shown\n        discoveries_dismissed\n        article_impressions\n        ai_questions\n      }\n      top_articles { key label count }\n      notifications { sent read by_topic { key label count } }\n    }\n  }\n": types.AdminOverviewDocument,
    "\n  mutation AdminLogin($input: AdminLoginInput!) {\n    adminLogin(input: $input) {\n      access_token\n      refresh_token\n      expires_in\n    }\n  }\n": types.AdminLoginDocument,
    "\n  query AdminMe {\n    adminMe {\n      id\n      email\n      first_name\n      last_name\n      image_url\n    }\n  }\n": types.AdminMeDocument,
    "\n  mutation AdminRefresh($input: AdminRefreshInput!) {\n    adminRefresh(input: $input) {\n      access_token\n      refresh_token\n      expires_in\n    }\n  }\n": types.AdminRefreshDocument,
};

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
