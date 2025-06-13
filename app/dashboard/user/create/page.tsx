import Breadcrumbs from '@/app/ui/user/breadcrumbs';
import Form from '@/app/ui/user/create-form';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'User Profile', href: '/dashboard/user' },
          {
            label: 'Create',
            href: '/dashboard/user/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
