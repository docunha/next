'use client';

import { createCustomer, StateCustomer } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import { EnvelopeIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import Image from 'next/image';
import { useActionState } from 'react';

export default function Form() {
  const initialState: StateCustomer = { message: null, errors: {} };
  const [state, formAction] = useActionState(createCustomer, initialState);
  const image_url = '/customers/profile-default.png';
  // const [image_url, setImage_url] = useState(image_urlDefault);
  // const { startUpload } = useUploadThing('profilePicture', {
  //   onClientUploadComplete: (res) => {
  //     setImage_url(res[0].ufsUrl);
  //   },
  //   onUploadError: (error: Error) => {
  //     // console.error('Upload failed:', error);
  //     throw new Error('Create failed Customer profile picture');
  //   },
  // });
  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Customer Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="string"
              placeholder="Customer name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="name-error"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* customer email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="string"
                defaultValue=""
                placeholder="Customer Email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="email-error"
              />
              <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Customer Image */}
        <div className="mb-4">
          <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
            Customer Profile
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <div className="flex items-center gap-3">
                <input type="hidden" name="image_url" value={image_url} />
                {/* <label
                  style={{
                    cursor: 'pointer',
                  }}
                > */}
                <Image
                  src={image_url}
                  className="rounded-full"
                  alt={`New customer profile picture`}
                  width={28}
                  height={28}
                />
                {/* <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      // Do something with the file before uploading
                      // const compressed = await compress(file);
                      // Then start the upload of the compressed file
                      await startUpload([file]);
                    }}
                  /> */}
                {/* </label> */}
              </div>
            </div>
          </div>
        </div>
        {/* Image Customer */}
        {/* <div className="mb-4">
          <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
            Select Image
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="image_url"
                name="image_url"
                type="string"
                defaultValue=""
                placeholder="/customers/profile-default.png"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="image_url-error"
              />
              <PhotoIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="image_url-error" aria-live="polite" aria-atomic="true">
            {state.errors?.image_url &&
              state.errors.image_url.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div> */}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Customer</Button>
      </div>
    </form>
  );
}
