import { fetchCustomerById, fetchCustomers, fetchInvoiceById } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/customers/edit-form';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
export const metadata: Metadata = {
  title: 'Edit customer',
  description: 'Edit an existing customer.',
};
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [customer] = await Promise.all([
    fetchCustomerById(id),
  ]);
  if (!customer) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customer' },
          {
            label: 'Edit Customer',
            href: `/dashboard/customer/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form customer={customer}/>
    </main>
  );
}
