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
    "\n  query AdminAudit($page: Int, $limit: Int, $action: String, $type: String, $target: String) {\n    adminAuditLog(page: $page, limit: $limit, action: $action, target_type: $type, target_id: $target) {\n      total\n      page\n      limit\n      nodes {\n        id\n        action\n        target_type\n        target_id\n        details\n        created_at\n        admin_email\n        admin_name\n      }\n    }\n  }\n": typeof types.AdminAuditDocument,
    "\n  mutation AdminSetPostStatus($input: AdminPostStatusInput!) {\n    adminSetPostStatus(input: $input)\n  }\n": typeof types.AdminSetPostStatusDocument,
    "\n  mutation AdminDeletePost($input: AdminModerationInput!) {\n    adminDeletePost(input: $input)\n  }\n": typeof types.AdminDeletePostDocument,
    "\n  query AdminPostComments($id: String!) {\n    adminPostComments(post_id: $id) {\n      id\n      content\n      parent_id\n      likes\n      created_at\n      author { id name email image_url }\n    }\n  }\n": typeof types.AdminPostCommentsDocument,
    "\n  mutation AdminDeleteComment($input: AdminModerationInput!) {\n    adminDeleteComment(input: $input)\n  }\n": typeof types.AdminDeleteCommentDocument,
    "\n  mutation AdminDeleteGroup($input: AdminModerationInput!) {\n    adminDeleteGroup(input: $input)\n  }\n": typeof types.AdminDeleteGroupDocument,
    "\n  mutation AdminSaveEvent($id: String, $input: CreateEventInput!) {\n    adminSaveEvent(id: $id, input: $input) { id title }\n  }\n": typeof types.AdminSaveEventDocument,
    "\n  mutation AdminCancelEvent($input: AdminCancelEventInput!) {\n    adminCancelEvent(input: $input)\n  }\n": typeof types.AdminCancelEventDocument,
    "\n  query AdminGroups($page: Int, $limit: Int, $search: String, $type: GroupType) {\n    adminGroups(page: $page, limit: $limit, search: $search, type: $type) {\n      total\n      page\n      limit\n      nodes {\n        id\n        name\n        description\n        type\n        image_url\n        location\n        phase_tag\n        members\n        posts\n        pending\n        created_at\n        owner { id name email image_url }\n      }\n    }\n  }\n": typeof types.AdminGroupsDocument,
    "\n  query AdminHangouts($page: Int, $limit: Int, $when: String, $search: String) {\n    adminEvents(page: $page, limit: $limit, when: $when, search: $search) {\n      total\n      page\n      limit\n      nodes {\n        id\n        title\n        description\n        cover_image_url\n        status\n        city\n        location_address\n        venue_details\n        meeting_url\n        is_online\n        start_time\n        end_time\n        doors_open_at\n        capacity\n        fee_amount\n        host_name\n        host_description\n        host_image_url\n        recommended_phases\n        phase_tip\n        topics\n        going\n        cancelled\n        created_at\n      }\n    }\n    adminInterests { id name }\n  }\n": typeof types.AdminHangoutsDocument,
    "\n  query AdminPosts($page: Int, $limit: Int, $status: PostStatus, $search: String, $group: String, $author: String) {\n    adminPosts(page: $page, limit: $limit, status: $status, search: $search, group_id: $group, author_id: $author) {\n      total\n      page\n      limit\n      nodes {\n        id\n        content\n        status\n        group_id\n        group_name\n        author_phase\n        likes\n        comments\n        helpfuls\n        saves\n        created_at\n        author { id name email image_url }\n      }\n    }\n  }\n": typeof types.AdminPostsDocument,
    "\n  mutation AdminSaveCard($input: AdminSmartCardInput!) {\n    adminSaveSmartCard(input: $input) { id }\n  }\n": typeof types.AdminSaveCardDocument,
    "\n  mutation AdminDeleteCard($id: String!) {\n    adminDeleteSmartCard(id: $id)\n  }\n": typeof types.AdminDeleteCardDocument,
    "\n  mutation AdminSaveFact($input: AdminDidYouKnowInput!) {\n    adminSaveDidYouKnow(input: $input) { id }\n  }\n": typeof types.AdminSaveFactDocument,
    "\n  mutation AdminDeleteFact($id: String!) {\n    adminDeleteDidYouKnow(id: $id)\n  }\n": typeof types.AdminDeleteFactDocument,
    "\n  mutation AdminSaveDayRow($input: AdminCycleDayRowInput!) {\n    adminSaveCycleDayRow(input: $input) { row_id }\n  }\n": typeof types.AdminSaveDayRowDocument,
    "\n  mutation AdminDeleteDayRow($id: String!) {\n    adminDeleteCycleDayRow(row_id: $id)\n  }\n": typeof types.AdminDeleteDayRowDocument,
    "\n  mutation AdminSaveArticle($input: AdminBlogArticleInput!) {\n    adminSaveBlogArticle(input: $input) { id }\n  }\n": typeof types.AdminSaveArticleDocument,
    "\n  mutation AdminRefreshArticle($id: String!) {\n    adminRefreshBlogArticle(id: $id) { id }\n  }\n": typeof types.AdminRefreshArticleDocument,
    "\n  mutation AdminSaveLibraryItem($input: AdminLibraryItemInput!) {\n    adminSaveLibraryItem(input: $input) { id }\n  }\n": typeof types.AdminSaveLibraryItemDocument,
    "\n  mutation AdminDeleteLibraryItem($id: String!) {\n    adminDeleteLibraryItem(id: $id)\n  }\n": typeof types.AdminDeleteLibraryItemDocument,
    "\n  query AdminArticles($page: Int, $limit: Int, $search: String, $active: Boolean, $phase: CyclePhase) {\n    adminBlogArticles(page: $page, limit: $limit, search: $search, active: $active, phase: $phase) {\n      total\n      page\n      limit\n      nodes {\n        id\n        slug\n        title\n        url\n        cover_image\n        first_para\n        phase_tags\n        interest_tags\n        topic_tags\n        published_at\n        is_active\n        impressions\n      }\n    }\n  }\n": typeof types.AdminArticlesDocument,
    "\n  query AdminDayRows {\n    adminCycleDayRows {\n      row_id\n      phase\n      phase_position\n      variation\n      body_text\n      energy_text\n    }\n  }\n": typeof types.AdminDayRowsDocument,
    "\n  query AdminFacts($page: Int, $limit: Int, $search: String, $category: String, $active: Boolean) {\n    adminDidYouKnow(page: $page, limit: $limit, search: $search, category: $category, active: $active) {\n      total\n      page\n      limit\n      nodes {\n        id\n        external_id\n        category\n        title\n        full_text\n        source_url\n        is_active\n        position\n      }\n    }\n  }\n": typeof types.AdminFactsDocument,
    "\n  query AdminLibrary($page: Int, $limit: Int, $kind: ContentKind, $phase: CyclePhase, $search: String, $active: Boolean) {\n    adminLibraryItems(page: $page, limit: $limit, kind: $kind, phase: $phase, search: $search, active: $active) {\n      total\n      page\n      limit\n      nodes {\n        id\n        kind\n        phase\n        title\n        body\n        details {\n          icon\n          title\n          body\n        }\n        is_active\n        updated_at\n      }\n    }\n  }\n": typeof types.AdminLibraryDocument,
    "\n  query AdminCards(\n    $page: Int\n    $limit: Int\n    $set: String\n    $phase: CyclePhase\n    $position: PhasePosition\n    $time: TimeOfDay\n    $search: String\n  ) {\n    adminSmartCards(\n      page: $page\n      limit: $limit\n      set: $set\n      phase: $phase\n      phase_position: $position\n      time_of_day: $time\n      search: $search\n    ) {\n      total\n      page\n      limit\n      nodes {\n        id\n        set\n        phase\n        phase_position\n        time_of_day\n        content_type\n        tone\n        headline\n        explanation\n        mind\n        hydration_tip\n        source\n        source_detail\n      }\n    }\n  }\n": typeof types.AdminCardsDocument,
    "\n  query AdminMember($id: String!) {\n    adminMe { id }\n    adminUser(id: $id) {\n      id\n      email\n      first_name\n      last_name\n      username\n      image_url\n      status\n      role\n      location\n      login_provider\n      cycle_type\n      phase\n      cycle_day\n      cycle_length\n      timezone\n      age\n      suspended_at\n      suspension_reason\n      lifetime_points\n      level\n      invited_by\n      device_platforms\n      group_names\n      created_at\n      last_login\n      counts {\n        posts\n        comments\n        groups\n        hangout_bookings\n        moods\n        journal_entries\n        period_logs\n        active_goals\n        badges\n        friends\n        devices\n        active_days_30\n      }\n      recent_posts { id excerpt group_name status created_at }\n    }\n    adminAuditLog(target_type: \"user\", target_id: $id, limit: 10) {\n      nodes { id action details created_at admin_email }\n    }\n  }\n": typeof types.AdminMemberDocument,
    "\n  mutation AdminSuspend($input: AdminSuspendUserInput!) {\n    adminSuspendUser(input: $input) { id status }\n  }\n": typeof types.AdminSuspendDocument,
    "\n  mutation AdminReactivate($id: String!) {\n    adminReactivateUser(user_id: $id) { id status }\n  }\n": typeof types.AdminReactivateDocument,
    "\n  mutation AdminSetRole($id: String!, $role: UserRole!) {\n    adminSetUserRole(user_id: $id, role: $role) { id role }\n  }\n": typeof types.AdminSetRoleDocument,
    "\n  mutation AdminDeleteMember($id: String!) {\n    adminDeleteUser(user_id: $id)\n  }\n": typeof types.AdminDeleteMemberDocument,
    "\n  query AdminMembers($page: Int, $limit: Int, $filter: AdminUserFilterInput) {\n    adminUsers(page: $page, limit: $limit, filter: $filter) {\n      total\n      page\n      limit\n      nodes {\n        id\n        email\n        first_name\n        last_name\n        username\n        image_url\n        status\n        role\n        location\n        cycle_type\n        phase\n        created_at\n        last_login\n      }\n    }\n  }\n": typeof types.AdminMembersDocument,
    "\n  query AdminAudienceCount($audience: AdminAudienceInput!) {\n    adminAudienceCount(audience: $audience) { members reachable }\n  }\n": typeof types.AdminAudienceCountDocument,
    "\n  query AdminCampaignMemberSearch($search: String) {\n    adminUsers(limit: 8, filter: { search: $search, status: ACTIVE }) {\n      nodes { id first_name last_name email image_url }\n    }\n  }\n": typeof types.AdminCampaignMemberSearchDocument,
    "\n  mutation AdminCreateCampaign($input: AdminCampaignInput!) {\n    adminCreateCampaign(input: $input) { id status recipients pushed queued inbox_only }\n  }\n": typeof types.AdminCreateCampaignDocument,
    "\n  mutation AdminCancelCampaign($id: String!) {\n    adminCancelCampaign(id: $id) { id status }\n  }\n": typeof types.AdminCancelCampaignDocument,
    "\n  mutation AdminTestCampaign($input: AdminTestCampaignInput!) {\n    adminTestCampaign(input: $input) { pushed devices queued }\n  }\n": typeof types.AdminTestCampaignDocument,
    "\n  query AdminCampaignHistory($page: Int) {\n    adminCampaigns(page: $page, limit: 15) {\n      total\n      page\n      limit\n      nodes {\n        id\n        title\n        body\n        audience_label\n        status\n        scheduled_at\n        sent_at\n        error\n        recipients\n        pushed\n        queued\n        inbox_only\n        created_by_name\n        created_at\n      }\n    }\n  }\n": typeof types.AdminCampaignHistoryDocument,
    "\n  query AdminCampaignRecipient($id: String!) {\n    adminUser(id: $id) { id first_name last_name email image_url status }\n  }\n": typeof types.AdminCampaignRecipientDocument,
    "\n  query AdminOverview($days: Int) {\n    adminOverview(days: $days) {\n      range_days\n      from\n      to\n      kpis {\n        total_members\n        new_members\n        new_members_previous\n        active_today\n        active_week\n        active_month\n        stickiness\n        with_cycle\n        push_reachable\n        suspended\n      }\n      series { key points { date value } }\n      cycle_types { key label count }\n      phases_today { key label count }\n      cities { key label count }\n      glow_levels { key label count }\n      interests { key label count }\n      moods { key label count }\n      goals { key label count }\n      community { posts comments likes groups bookings upcoming_hangouts }\n      top_groups { key label count }\n      content {\n        insight_views\n        insight_views_set_a\n        insight_views_set_b\n        discoveries_shown\n        discoveries_dismissed\n        article_impressions\n        ai_questions\n      }\n      top_articles { key label count }\n      notifications { sent read by_topic { key label count } }\n    }\n  }\n": typeof types.AdminOverviewDocument,
    "\n  mutation AdminLogin($input: AdminLoginInput!) {\n    adminLogin(input: $input) {\n      access_token\n      refresh_token\n      expires_in\n    }\n  }\n": typeof types.AdminLoginDocument,
    "\n  query AdminMe {\n    adminMe {\n      id\n      email\n      first_name\n      last_name\n      image_url\n    }\n  }\n": typeof types.AdminMeDocument,
    "\n  mutation AdminRefresh($input: AdminRefreshInput!) {\n    adminRefresh(input: $input) {\n      access_token\n      refresh_token\n      expires_in\n    }\n  }\n": typeof types.AdminRefreshDocument,
};
const documents: Documents = {
    "\n  query AdminAudit($page: Int, $limit: Int, $action: String, $type: String, $target: String) {\n    adminAuditLog(page: $page, limit: $limit, action: $action, target_type: $type, target_id: $target) {\n      total\n      page\n      limit\n      nodes {\n        id\n        action\n        target_type\n        target_id\n        details\n        created_at\n        admin_email\n        admin_name\n      }\n    }\n  }\n": types.AdminAuditDocument,
    "\n  mutation AdminSetPostStatus($input: AdminPostStatusInput!) {\n    adminSetPostStatus(input: $input)\n  }\n": types.AdminSetPostStatusDocument,
    "\n  mutation AdminDeletePost($input: AdminModerationInput!) {\n    adminDeletePost(input: $input)\n  }\n": types.AdminDeletePostDocument,
    "\n  query AdminPostComments($id: String!) {\n    adminPostComments(post_id: $id) {\n      id\n      content\n      parent_id\n      likes\n      created_at\n      author { id name email image_url }\n    }\n  }\n": types.AdminPostCommentsDocument,
    "\n  mutation AdminDeleteComment($input: AdminModerationInput!) {\n    adminDeleteComment(input: $input)\n  }\n": types.AdminDeleteCommentDocument,
    "\n  mutation AdminDeleteGroup($input: AdminModerationInput!) {\n    adminDeleteGroup(input: $input)\n  }\n": types.AdminDeleteGroupDocument,
    "\n  mutation AdminSaveEvent($id: String, $input: CreateEventInput!) {\n    adminSaveEvent(id: $id, input: $input) { id title }\n  }\n": types.AdminSaveEventDocument,
    "\n  mutation AdminCancelEvent($input: AdminCancelEventInput!) {\n    adminCancelEvent(input: $input)\n  }\n": types.AdminCancelEventDocument,
    "\n  query AdminGroups($page: Int, $limit: Int, $search: String, $type: GroupType) {\n    adminGroups(page: $page, limit: $limit, search: $search, type: $type) {\n      total\n      page\n      limit\n      nodes {\n        id\n        name\n        description\n        type\n        image_url\n        location\n        phase_tag\n        members\n        posts\n        pending\n        created_at\n        owner { id name email image_url }\n      }\n    }\n  }\n": types.AdminGroupsDocument,
    "\n  query AdminHangouts($page: Int, $limit: Int, $when: String, $search: String) {\n    adminEvents(page: $page, limit: $limit, when: $when, search: $search) {\n      total\n      page\n      limit\n      nodes {\n        id\n        title\n        description\n        cover_image_url\n        status\n        city\n        location_address\n        venue_details\n        meeting_url\n        is_online\n        start_time\n        end_time\n        doors_open_at\n        capacity\n        fee_amount\n        host_name\n        host_description\n        host_image_url\n        recommended_phases\n        phase_tip\n        topics\n        going\n        cancelled\n        created_at\n      }\n    }\n    adminInterests { id name }\n  }\n": types.AdminHangoutsDocument,
    "\n  query AdminPosts($page: Int, $limit: Int, $status: PostStatus, $search: String, $group: String, $author: String) {\n    adminPosts(page: $page, limit: $limit, status: $status, search: $search, group_id: $group, author_id: $author) {\n      total\n      page\n      limit\n      nodes {\n        id\n        content\n        status\n        group_id\n        group_name\n        author_phase\n        likes\n        comments\n        helpfuls\n        saves\n        created_at\n        author { id name email image_url }\n      }\n    }\n  }\n": types.AdminPostsDocument,
    "\n  mutation AdminSaveCard($input: AdminSmartCardInput!) {\n    adminSaveSmartCard(input: $input) { id }\n  }\n": types.AdminSaveCardDocument,
    "\n  mutation AdminDeleteCard($id: String!) {\n    adminDeleteSmartCard(id: $id)\n  }\n": types.AdminDeleteCardDocument,
    "\n  mutation AdminSaveFact($input: AdminDidYouKnowInput!) {\n    adminSaveDidYouKnow(input: $input) { id }\n  }\n": types.AdminSaveFactDocument,
    "\n  mutation AdminDeleteFact($id: String!) {\n    adminDeleteDidYouKnow(id: $id)\n  }\n": types.AdminDeleteFactDocument,
    "\n  mutation AdminSaveDayRow($input: AdminCycleDayRowInput!) {\n    adminSaveCycleDayRow(input: $input) { row_id }\n  }\n": types.AdminSaveDayRowDocument,
    "\n  mutation AdminDeleteDayRow($id: String!) {\n    adminDeleteCycleDayRow(row_id: $id)\n  }\n": types.AdminDeleteDayRowDocument,
    "\n  mutation AdminSaveArticle($input: AdminBlogArticleInput!) {\n    adminSaveBlogArticle(input: $input) { id }\n  }\n": types.AdminSaveArticleDocument,
    "\n  mutation AdminRefreshArticle($id: String!) {\n    adminRefreshBlogArticle(id: $id) { id }\n  }\n": types.AdminRefreshArticleDocument,
    "\n  mutation AdminSaveLibraryItem($input: AdminLibraryItemInput!) {\n    adminSaveLibraryItem(input: $input) { id }\n  }\n": types.AdminSaveLibraryItemDocument,
    "\n  mutation AdminDeleteLibraryItem($id: String!) {\n    adminDeleteLibraryItem(id: $id)\n  }\n": types.AdminDeleteLibraryItemDocument,
    "\n  query AdminArticles($page: Int, $limit: Int, $search: String, $active: Boolean, $phase: CyclePhase) {\n    adminBlogArticles(page: $page, limit: $limit, search: $search, active: $active, phase: $phase) {\n      total\n      page\n      limit\n      nodes {\n        id\n        slug\n        title\n        url\n        cover_image\n        first_para\n        phase_tags\n        interest_tags\n        topic_tags\n        published_at\n        is_active\n        impressions\n      }\n    }\n  }\n": types.AdminArticlesDocument,
    "\n  query AdminDayRows {\n    adminCycleDayRows {\n      row_id\n      phase\n      phase_position\n      variation\n      body_text\n      energy_text\n    }\n  }\n": types.AdminDayRowsDocument,
    "\n  query AdminFacts($page: Int, $limit: Int, $search: String, $category: String, $active: Boolean) {\n    adminDidYouKnow(page: $page, limit: $limit, search: $search, category: $category, active: $active) {\n      total\n      page\n      limit\n      nodes {\n        id\n        external_id\n        category\n        title\n        full_text\n        source_url\n        is_active\n        position\n      }\n    }\n  }\n": types.AdminFactsDocument,
    "\n  query AdminLibrary($page: Int, $limit: Int, $kind: ContentKind, $phase: CyclePhase, $search: String, $active: Boolean) {\n    adminLibraryItems(page: $page, limit: $limit, kind: $kind, phase: $phase, search: $search, active: $active) {\n      total\n      page\n      limit\n      nodes {\n        id\n        kind\n        phase\n        title\n        body\n        details {\n          icon\n          title\n          body\n        }\n        is_active\n        updated_at\n      }\n    }\n  }\n": types.AdminLibraryDocument,
    "\n  query AdminCards(\n    $page: Int\n    $limit: Int\n    $set: String\n    $phase: CyclePhase\n    $position: PhasePosition\n    $time: TimeOfDay\n    $search: String\n  ) {\n    adminSmartCards(\n      page: $page\n      limit: $limit\n      set: $set\n      phase: $phase\n      phase_position: $position\n      time_of_day: $time\n      search: $search\n    ) {\n      total\n      page\n      limit\n      nodes {\n        id\n        set\n        phase\n        phase_position\n        time_of_day\n        content_type\n        tone\n        headline\n        explanation\n        mind\n        hydration_tip\n        source\n        source_detail\n      }\n    }\n  }\n": types.AdminCardsDocument,
    "\n  query AdminMember($id: String!) {\n    adminMe { id }\n    adminUser(id: $id) {\n      id\n      email\n      first_name\n      last_name\n      username\n      image_url\n      status\n      role\n      location\n      login_provider\n      cycle_type\n      phase\n      cycle_day\n      cycle_length\n      timezone\n      age\n      suspended_at\n      suspension_reason\n      lifetime_points\n      level\n      invited_by\n      device_platforms\n      group_names\n      created_at\n      last_login\n      counts {\n        posts\n        comments\n        groups\n        hangout_bookings\n        moods\n        journal_entries\n        period_logs\n        active_goals\n        badges\n        friends\n        devices\n        active_days_30\n      }\n      recent_posts { id excerpt group_name status created_at }\n    }\n    adminAuditLog(target_type: \"user\", target_id: $id, limit: 10) {\n      nodes { id action details created_at admin_email }\n    }\n  }\n": types.AdminMemberDocument,
    "\n  mutation AdminSuspend($input: AdminSuspendUserInput!) {\n    adminSuspendUser(input: $input) { id status }\n  }\n": types.AdminSuspendDocument,
    "\n  mutation AdminReactivate($id: String!) {\n    adminReactivateUser(user_id: $id) { id status }\n  }\n": types.AdminReactivateDocument,
    "\n  mutation AdminSetRole($id: String!, $role: UserRole!) {\n    adminSetUserRole(user_id: $id, role: $role) { id role }\n  }\n": types.AdminSetRoleDocument,
    "\n  mutation AdminDeleteMember($id: String!) {\n    adminDeleteUser(user_id: $id)\n  }\n": types.AdminDeleteMemberDocument,
    "\n  query AdminMembers($page: Int, $limit: Int, $filter: AdminUserFilterInput) {\n    adminUsers(page: $page, limit: $limit, filter: $filter) {\n      total\n      page\n      limit\n      nodes {\n        id\n        email\n        first_name\n        last_name\n        username\n        image_url\n        status\n        role\n        location\n        cycle_type\n        phase\n        created_at\n        last_login\n      }\n    }\n  }\n": types.AdminMembersDocument,
    "\n  query AdminAudienceCount($audience: AdminAudienceInput!) {\n    adminAudienceCount(audience: $audience) { members reachable }\n  }\n": types.AdminAudienceCountDocument,
    "\n  query AdminCampaignMemberSearch($search: String) {\n    adminUsers(limit: 8, filter: { search: $search, status: ACTIVE }) {\n      nodes { id first_name last_name email image_url }\n    }\n  }\n": types.AdminCampaignMemberSearchDocument,
    "\n  mutation AdminCreateCampaign($input: AdminCampaignInput!) {\n    adminCreateCampaign(input: $input) { id status recipients pushed queued inbox_only }\n  }\n": types.AdminCreateCampaignDocument,
    "\n  mutation AdminCancelCampaign($id: String!) {\n    adminCancelCampaign(id: $id) { id status }\n  }\n": types.AdminCancelCampaignDocument,
    "\n  mutation AdminTestCampaign($input: AdminTestCampaignInput!) {\n    adminTestCampaign(input: $input) { pushed devices queued }\n  }\n": types.AdminTestCampaignDocument,
    "\n  query AdminCampaignHistory($page: Int) {\n    adminCampaigns(page: $page, limit: 15) {\n      total\n      page\n      limit\n      nodes {\n        id\n        title\n        body\n        audience_label\n        status\n        scheduled_at\n        sent_at\n        error\n        recipients\n        pushed\n        queued\n        inbox_only\n        created_by_name\n        created_at\n      }\n    }\n  }\n": types.AdminCampaignHistoryDocument,
    "\n  query AdminCampaignRecipient($id: String!) {\n    adminUser(id: $id) { id first_name last_name email image_url status }\n  }\n": types.AdminCampaignRecipientDocument,
    "\n  query AdminOverview($days: Int) {\n    adminOverview(days: $days) {\n      range_days\n      from\n      to\n      kpis {\n        total_members\n        new_members\n        new_members_previous\n        active_today\n        active_week\n        active_month\n        stickiness\n        with_cycle\n        push_reachable\n        suspended\n      }\n      series { key points { date value } }\n      cycle_types { key label count }\n      phases_today { key label count }\n      cities { key label count }\n      glow_levels { key label count }\n      interests { key label count }\n      moods { key label count }\n      goals { key label count }\n      community { posts comments likes groups bookings upcoming_hangouts }\n      top_groups { key label count }\n      content {\n        insight_views\n        insight_views_set_a\n        insight_views_set_b\n        discoveries_shown\n        discoveries_dismissed\n        article_impressions\n        ai_questions\n      }\n      top_articles { key label count }\n      notifications { sent read by_topic { key label count } }\n    }\n  }\n": types.AdminOverviewDocument,
    "\n  mutation AdminLogin($input: AdminLoginInput!) {\n    adminLogin(input: $input) {\n      access_token\n      refresh_token\n      expires_in\n    }\n  }\n": types.AdminLoginDocument,
    "\n  query AdminMe {\n    adminMe {\n      id\n      email\n      first_name\n      last_name\n      image_url\n    }\n  }\n": types.AdminMeDocument,
    "\n  mutation AdminRefresh($input: AdminRefreshInput!) {\n    adminRefresh(input: $input) {\n      access_token\n      refresh_token\n      expires_in\n    }\n  }\n": types.AdminRefreshDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminAudit($page: Int, $limit: Int, $action: String, $type: String, $target: String) {\n    adminAuditLog(page: $page, limit: $limit, action: $action, target_type: $type, target_id: $target) {\n      total\n      page\n      limit\n      nodes {\n        id\n        action\n        target_type\n        target_id\n        details\n        created_at\n        admin_email\n        admin_name\n      }\n    }\n  }\n"): typeof import('./graphql').AdminAuditDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminSetPostStatus($input: AdminPostStatusInput!) {\n    adminSetPostStatus(input: $input)\n  }\n"): typeof import('./graphql').AdminSetPostStatusDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminDeletePost($input: AdminModerationInput!) {\n    adminDeletePost(input: $input)\n  }\n"): typeof import('./graphql').AdminDeletePostDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminPostComments($id: String!) {\n    adminPostComments(post_id: $id) {\n      id\n      content\n      parent_id\n      likes\n      created_at\n      author { id name email image_url }\n    }\n  }\n"): typeof import('./graphql').AdminPostCommentsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminDeleteComment($input: AdminModerationInput!) {\n    adminDeleteComment(input: $input)\n  }\n"): typeof import('./graphql').AdminDeleteCommentDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminDeleteGroup($input: AdminModerationInput!) {\n    adminDeleteGroup(input: $input)\n  }\n"): typeof import('./graphql').AdminDeleteGroupDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminSaveEvent($id: String, $input: CreateEventInput!) {\n    adminSaveEvent(id: $id, input: $input) { id title }\n  }\n"): typeof import('./graphql').AdminSaveEventDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminCancelEvent($input: AdminCancelEventInput!) {\n    adminCancelEvent(input: $input)\n  }\n"): typeof import('./graphql').AdminCancelEventDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminGroups($page: Int, $limit: Int, $search: String, $type: GroupType) {\n    adminGroups(page: $page, limit: $limit, search: $search, type: $type) {\n      total\n      page\n      limit\n      nodes {\n        id\n        name\n        description\n        type\n        image_url\n        location\n        phase_tag\n        members\n        posts\n        pending\n        created_at\n        owner { id name email image_url }\n      }\n    }\n  }\n"): typeof import('./graphql').AdminGroupsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminHangouts($page: Int, $limit: Int, $when: String, $search: String) {\n    adminEvents(page: $page, limit: $limit, when: $when, search: $search) {\n      total\n      page\n      limit\n      nodes {\n        id\n        title\n        description\n        cover_image_url\n        status\n        city\n        location_address\n        venue_details\n        meeting_url\n        is_online\n        start_time\n        end_time\n        doors_open_at\n        capacity\n        fee_amount\n        host_name\n        host_description\n        host_image_url\n        recommended_phases\n        phase_tip\n        topics\n        going\n        cancelled\n        created_at\n      }\n    }\n    adminInterests { id name }\n  }\n"): typeof import('./graphql').AdminHangoutsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminPosts($page: Int, $limit: Int, $status: PostStatus, $search: String, $group: String, $author: String) {\n    adminPosts(page: $page, limit: $limit, status: $status, search: $search, group_id: $group, author_id: $author) {\n      total\n      page\n      limit\n      nodes {\n        id\n        content\n        status\n        group_id\n        group_name\n        author_phase\n        likes\n        comments\n        helpfuls\n        saves\n        created_at\n        author { id name email image_url }\n      }\n    }\n  }\n"): typeof import('./graphql').AdminPostsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminSaveCard($input: AdminSmartCardInput!) {\n    adminSaveSmartCard(input: $input) { id }\n  }\n"): typeof import('./graphql').AdminSaveCardDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminDeleteCard($id: String!) {\n    adminDeleteSmartCard(id: $id)\n  }\n"): typeof import('./graphql').AdminDeleteCardDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminSaveFact($input: AdminDidYouKnowInput!) {\n    adminSaveDidYouKnow(input: $input) { id }\n  }\n"): typeof import('./graphql').AdminSaveFactDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminDeleteFact($id: String!) {\n    adminDeleteDidYouKnow(id: $id)\n  }\n"): typeof import('./graphql').AdminDeleteFactDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminSaveDayRow($input: AdminCycleDayRowInput!) {\n    adminSaveCycleDayRow(input: $input) { row_id }\n  }\n"): typeof import('./graphql').AdminSaveDayRowDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminDeleteDayRow($id: String!) {\n    adminDeleteCycleDayRow(row_id: $id)\n  }\n"): typeof import('./graphql').AdminDeleteDayRowDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminSaveArticle($input: AdminBlogArticleInput!) {\n    adminSaveBlogArticle(input: $input) { id }\n  }\n"): typeof import('./graphql').AdminSaveArticleDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminRefreshArticle($id: String!) {\n    adminRefreshBlogArticle(id: $id) { id }\n  }\n"): typeof import('./graphql').AdminRefreshArticleDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminSaveLibraryItem($input: AdminLibraryItemInput!) {\n    adminSaveLibraryItem(input: $input) { id }\n  }\n"): typeof import('./graphql').AdminSaveLibraryItemDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminDeleteLibraryItem($id: String!) {\n    adminDeleteLibraryItem(id: $id)\n  }\n"): typeof import('./graphql').AdminDeleteLibraryItemDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminArticles($page: Int, $limit: Int, $search: String, $active: Boolean, $phase: CyclePhase) {\n    adminBlogArticles(page: $page, limit: $limit, search: $search, active: $active, phase: $phase) {\n      total\n      page\n      limit\n      nodes {\n        id\n        slug\n        title\n        url\n        cover_image\n        first_para\n        phase_tags\n        interest_tags\n        topic_tags\n        published_at\n        is_active\n        impressions\n      }\n    }\n  }\n"): typeof import('./graphql').AdminArticlesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminDayRows {\n    adminCycleDayRows {\n      row_id\n      phase\n      phase_position\n      variation\n      body_text\n      energy_text\n    }\n  }\n"): typeof import('./graphql').AdminDayRowsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminFacts($page: Int, $limit: Int, $search: String, $category: String, $active: Boolean) {\n    adminDidYouKnow(page: $page, limit: $limit, search: $search, category: $category, active: $active) {\n      total\n      page\n      limit\n      nodes {\n        id\n        external_id\n        category\n        title\n        full_text\n        source_url\n        is_active\n        position\n      }\n    }\n  }\n"): typeof import('./graphql').AdminFactsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminLibrary($page: Int, $limit: Int, $kind: ContentKind, $phase: CyclePhase, $search: String, $active: Boolean) {\n    adminLibraryItems(page: $page, limit: $limit, kind: $kind, phase: $phase, search: $search, active: $active) {\n      total\n      page\n      limit\n      nodes {\n        id\n        kind\n        phase\n        title\n        body\n        details {\n          icon\n          title\n          body\n        }\n        is_active\n        updated_at\n      }\n    }\n  }\n"): typeof import('./graphql').AdminLibraryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminCards(\n    $page: Int\n    $limit: Int\n    $set: String\n    $phase: CyclePhase\n    $position: PhasePosition\n    $time: TimeOfDay\n    $search: String\n  ) {\n    adminSmartCards(\n      page: $page\n      limit: $limit\n      set: $set\n      phase: $phase\n      phase_position: $position\n      time_of_day: $time\n      search: $search\n    ) {\n      total\n      page\n      limit\n      nodes {\n        id\n        set\n        phase\n        phase_position\n        time_of_day\n        content_type\n        tone\n        headline\n        explanation\n        mind\n        hydration_tip\n        source\n        source_detail\n      }\n    }\n  }\n"): typeof import('./graphql').AdminCardsDocument;
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
export function graphql(source: "\n  query AdminAudienceCount($audience: AdminAudienceInput!) {\n    adminAudienceCount(audience: $audience) { members reachable }\n  }\n"): typeof import('./graphql').AdminAudienceCountDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminCampaignMemberSearch($search: String) {\n    adminUsers(limit: 8, filter: { search: $search, status: ACTIVE }) {\n      nodes { id first_name last_name email image_url }\n    }\n  }\n"): typeof import('./graphql').AdminCampaignMemberSearchDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminCreateCampaign($input: AdminCampaignInput!) {\n    adminCreateCampaign(input: $input) { id status recipients pushed queued inbox_only }\n  }\n"): typeof import('./graphql').AdminCreateCampaignDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminCancelCampaign($id: String!) {\n    adminCancelCampaign(id: $id) { id status }\n  }\n"): typeof import('./graphql').AdminCancelCampaignDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AdminTestCampaign($input: AdminTestCampaignInput!) {\n    adminTestCampaign(input: $input) { pushed devices queued }\n  }\n"): typeof import('./graphql').AdminTestCampaignDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminCampaignHistory($page: Int) {\n    adminCampaigns(page: $page, limit: 15) {\n      total\n      page\n      limit\n      nodes {\n        id\n        title\n        body\n        audience_label\n        status\n        scheduled_at\n        sent_at\n        error\n        recipients\n        pushed\n        queued\n        inbox_only\n        created_by_name\n        created_at\n      }\n    }\n  }\n"): typeof import('./graphql').AdminCampaignHistoryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AdminCampaignRecipient($id: String!) {\n    adminUser(id: $id) { id first_name last_name email image_url status }\n  }\n"): typeof import('./graphql').AdminCampaignRecipientDocument;
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
