import SignOutBtn from "@/components/sign-out-btn";
import { Button } from "@/components/ui/button";
import { useGetUser } from "@/lib/auth-client";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@packages/convex";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { data: user } = useGetUser();
  const { data: personalOrg } = useQuery(convexQuery(api.org.queries.getPersonalOrg, {}));
  console.log({ personalOrg });
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      {!user && <SignOutBtn />}
      {personalOrg && (
        <Link to="/$slug/dashboard" params={{ slug: personalOrg.slug }}>
          <Button>Dashboard</Button>
        </Link>
      )}
    </div>
  );
}
