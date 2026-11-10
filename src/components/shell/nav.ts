import {
  BarChart3,
  BookOpenText,
  CalendarDays,
  Lightbulb,
  MessagesSquare,
  Newspaper,
  ScrollText,
  Send,
  Sparkles,
  Sun,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** The dashboard's sections, in sidebar order. */
export const NAV: NavGroup[] = [
  {
    label: "Insights",
    items: [{ title: "Overview", href: "/", icon: BarChart3 }],
  },
  {
    label: "Members",
    items: [
      { title: "Members", href: "/members", icon: Users },
      { title: "Notifications", href: "/notifications", icon: Send },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Recommendations", href: "/content/recommendations", icon: Sparkles },
      { title: "Did You Know", href: "/content/did-you-know", icon: Lightbulb },
      { title: "Cycle-day lines", href: "/content/cycle-days", icon: Sun },
      { title: "Articles", href: "/content/articles", icon: Newspaper },
      { title: "Insights & prompts", href: "/content/library", icon: BookOpenText },
    ],
  },
  {
    label: "Community",
    items: [
      { title: "Posts", href: "/community/posts", icon: MessagesSquare },
      { title: "Groups", href: "/community/groups", icon: UsersRound },
      { title: "Hangouts", href: "/community/hangouts", icon: CalendarDays },
    ],
  },
  {
    label: "System",
    items: [{ title: "Audit log", href: "/audit", icon: ScrollText }],
  },
];

/** The title of the section a path belongs to. */
export const titleFor = (path: string): string => {
  const items = NAV.flatMap((group) => group.items);
  const match = items
    .filter((item) => (item.href === "/" ? path === "/" : path.startsWith(item.href)))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.title ?? "Solu Admin";
};
