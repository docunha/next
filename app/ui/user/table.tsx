import { fetchFilteredUsers } from '@/app/lib/data';
import { auth } from '@/auth';
import { DeleteUser, UpdateUser } from './buttons';

export default async function UsersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {

  const session = await auth();
  const users = await fetchFilteredUsers(session?.user?.email ?? '');

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {users?.map((user) => (
              <div
                key={user.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <div className="flex items-center gap-3">
                        <p>{user.name}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="pt-4 text-sm">
                  <div className="flex justify-end gap-3">
                    <UpdateUser id={user.id} />
                    <DeleteUser id={user.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full rounded-md text-gray-900 md:table">
            <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-gray-900">
              {users.map((user) => (
                <tr key={user.id} className="group">
                  <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                    <div className="flex items-center gap-3">
                      <p>{user.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                    <div className="flex justify-end gap-3">
                      <UpdateUser id={user.id} />
                      <DeleteUser id={user.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
