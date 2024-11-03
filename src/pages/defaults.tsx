import Link from "next/link";
import { InvoiceDefaults } from "~/modules";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Layout } from "~/components/layout";
// import { appRouter } from '~/server/api/root';
// import { createInnerTRPCContext } from '~/server/api/trpc';
// import { createServerSideHelpers } from '@trpc/react-query/server';

// export async function getServerSideProps() {
//   const helpers = createServerSideHelpers({
//     router: appRouter,
//     ctx: createInnerTRPCContext({ session: null }),
//   });
//   await helpers.invoiceDefaults.getUserDefaults.prefetch();
//   return {
//     props: { trpcState: helpers.dehydrate() },
//   };
// }

export default function Defaults() {
  return (
    <Layout>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link href="/defaults">Defaults</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <InvoiceDefaults />
    </Layout>
  );
}
