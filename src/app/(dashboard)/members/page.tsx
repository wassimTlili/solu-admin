import Link from "next/link";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilterSelect, formatDate, Pager, param, PhaseDot, query, StatusBadge, timeAgo } from "@/components/data/bits";
import { graphql } from "@/lib/gql";
import type { AdminUserFilterInput, CycleType, UserRole, UserStatus } from "@/lib/gql/graphql";
import { adminRequest } from "@/lib/server/api";

export const metadata: Metadata = { title: "Members" };

const Members = graphql(`
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
`);

const STATUSES = ["ACTIVE", "SUSPENDED", "INACTIVE", "DELETED"];
const CYCLE_TYPES: [string, string][] = [
  ["NATURAL", "Natural"],
  ["CONTRACEPTION", "Hormonal contraception"],
  ["POST_PILL", "Post-pill"],
  ["IRREGULAR", "Irregular"],
  ["NOT_SURE", "Not sure"],
];
const SORTS: [string, string][] = [
  ["newest", "Newest"],
  ["oldest", "Oldest"],
  ["last_login", "Last sign-in"],
  ["name", "Name"],
];

export default async function MembersPage({ searchParams }: PageProps<"/members">) {
  const params = await searchParams;
  const q = param(params.q);
  const status = param(params.status);
  const role = param(params.role);
  const cycle = param(params.cycle);
  const city = param(params.city);
  const sort = param(params.sort);
  const page = Math.max(0, Number(param(params.page) ?? 0) || 0);

  const filter: AdminUserFilterInput = {
    search: q || undefined,
    status: (status as UserStatus) || undefined,
    role: (role as UserRole) || undefined,
    cycle_type: (cycle as CycleType) || undefined,
    city: city || undefined,
    sort: sort || undefined,
  };
  const { adminUsers } = await adminRequest(Members, { page, limit: 25, filter });
  const keep = { q, status, role, cycle, city, sort };

  return (
    <div className="grid gap-4">
      <form className="glass flex flex-wrap items-end gap-3 rounded-xl p-3" action="/members">
        <label className="grid min-w-56 flex-1 gap-1 text-xs text-muted-foreground">
          Search
          <span className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={q} placeholder="Name, email or @username" className="h-9 bg-white/60 pl-8" />
          </span>
        </label>
        <FilterSelect
          name="status"
          label="Status"
          value={status}
          options={[{ value: "", label: "All but deleted" }, ...STATUSES.map((value) => ({ value, label: value.charAt(0) + value.slice(1).toLowerCase() }))]}
        />
        <FilterSelect
          name="role"
          label="Role"
          value={role}
          options={[
            { value: "", label: "Everyone" },
            { value: "USER", label: "Members" },
            { value: "ADMIN", label: "Admins" },
          ]}
        />
        <FilterSelect
          name="cycle"
          label="Cycle type"
          value={cycle}
          options={[{ value: "", label: "Any" }, ...CYCLE_TYPES.map(([value, label]) => ({ value, label }))]}
        />
        <label className="grid gap-1 text-xs text-muted-foreground">
          City
          <Input name="city" defaultValue={city} placeholder="Dubai" className="h-9 w-32 bg-white/60" />
        </label>
        <FilterSelect name="sort" label="Sort" value={sort} options={SORTS.map(([value, label]) => ({ value, label }))} />
        <Button type="submit" className="h-9">
          Apply
        </Button>
        {Object.values(keep).some(Boolean) ? (
          <Link href="/members" className="h-9 content-center px-1 text-sm text-muted-foreground hover:text-foreground">
            Clear
          </Link>
        ) : null}
      </form>

      <Card className="py-0">
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Member</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Cycle</TableHead>
                <TableHead>Phase today</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="pr-4">Last sign-in</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.nodes.length ? (
                adminUsers.nodes.map((user) => {
                  const name = `${user.first_name} ${user.last_name}`.trim();
                  return (
                    <TableRow key={user.id} className="relative">
                      <TableCell className="pl-4">
                        <Link href={`/members/${user.id}`} className="flex items-center gap-3 after:absolute after:inset-0">
                          <Avatar className="size-8">
                            {user.image_url ? <AvatarImage src={user.image_url} alt="" /> : null}
                            <AvatarFallback>{(name || user.email).slice(0, 1).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="grid leading-tight">
                            <span className="font-medium">
                              {name || "—"}
                              {user.role === "ADMIN" ? (
                                <span className="ml-1.5 rounded bg-primary/12 px-1.5 py-0.5 text-[10px] font-semibold text-primary">ADMIN</span>
                              ) : null}
                            </span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={user.status} />
                      </TableCell>
                      <TableCell>{user.location ?? "—"}</TableCell>
                      <TableCell>{CYCLE_TYPES.find(([value]) => value === user.cycle_type)?.[1] ?? "—"}</TableCell>
                      <TableCell>
                        <PhaseDot phase={user.phase} />
                      </TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell className="pr-4">{timeAgo(user.last_login)}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No members match these filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pager
        page={adminUsers.page}
        limit={adminUsers.limit}
        total={adminUsers.total}
        href={(next) => `/members${query({ ...keep, page: next || undefined })}`}
      />
    </div>
  );
}
