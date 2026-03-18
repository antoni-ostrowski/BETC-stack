import PageWrapper from "@/components/page-wrapper";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$slug/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PageWrapper>hi</PageWrapper>;
}
