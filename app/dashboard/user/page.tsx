import { lusitana } from '@/app/ui/fonts';
// import Table from '@/app/ui/invoices/table';
import { UserTableSkeleton } from '@/app/ui/skeletons';
import { CreateUser } from '@/app/ui/user/buttons';
import Table from '@/app/ui/user/table';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Users',
};

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';

  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>User Profile</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* <Search placeholder="Search username..." /> */}
        <CreateUser />
      </div>
      <Suspense key={query + currentPage} fallback={<UserTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center"></div>
    </div>
  );
}
