import { LogOut } from "lucide-react";
import { logout } from "@/app/login/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { graphql } from "@/lib/gql";
import { adminRequest } from "@/lib/server/api";

const AdminMe = graphql(`
  query AdminMe {
    adminMe {
      id
      email
      first_name
      last_name
      image_url
    }
  }
`);

/** The signed-in admin and the sign-out button, at the bottom of the sidebar. */
export async function AdminBadge() {
  const { adminMe } = await adminRequest(AdminMe);
  const name = `${adminMe.first_name} ${adminMe.last_name}`.trim() || adminMe.email;
  return (
    <div className="flex items-center gap-2 rounded-lg p-1 group-data-[collapsible=icon]:justify-center">
      <Avatar className="size-8">
        {adminMe.image_url ? <AvatarImage src={adminMe.image_url} alt="" /> : null}
        <AvatarFallback>{name.slice(0, 1).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 leading-tight group-data-[collapsible=icon]:hidden">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{adminMe.email}</p>
      </div>
      <form action={logout} className="group-data-[collapsible=icon]:hidden">
        <button
          type="submit"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="size-4" />
        </button>
      </form>
    </div>
  );
}
