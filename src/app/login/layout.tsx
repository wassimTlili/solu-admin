import { AdminClerkProvider } from "./clerk";

/** Clerk is only needed while signing in, so it loads on /login and its steps, nowhere else. */
export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return <AdminClerkProvider>{children}</AdminClerkProvider>;
}
