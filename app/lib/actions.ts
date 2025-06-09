'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { z } from 'zod';
import { fetchImageUrlCustomer, fetchInvoiceCustomer } from './data';
import { deleteUTFiles } from './deleteUTFile';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({ invalid_type_error: 'Please select a customer.' }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  //Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch (error) {
    // console.error('Database Error:', error);
    // throw new Error('Failed to create invoice.');
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  // export async function updateInvoice(id: string, formData: FormData) {

  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
  //Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    // console.error('Database Error:', error);
    // throw new Error('Failed to update invoice.');
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  // throw new Error('Failed to Delete Invoice');
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

/**
 * Customer Actions
 */
const FormSchemaCustomer = z.object({
  id: z.string(),
  name: z.string().nonempty({ message: 'Please insert a customer name.' }),
  email: z.string().email({
    message: 'Please insert a valid email address.',
  }),
  image_url: z.string().nonempty({
    message: 'Please insert a valid image URL.',
  }),
});

export type StateCustomer = {
  errors?: {
    name?: string[];
    email?: string[];
    image_url?: string[];
  };
  message?: string | null;
};

const CreateCustomer = FormSchemaCustomer.omit({ id: true });
export async function createCustomer(
  prevState: StateCustomer,
  formData: FormData
) {
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: formData.get('image_url'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Customer.',
    };
  }
  const { name, email, image_url } = validatedFields.data;

  await sql`
    INSERT INTO customers (name, email, image_url)
    VALUES (${name}, ${email}, ${image_url})
  `;
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

const UpdateCustomer = FormSchemaCustomer.omit({ id: true });
export async function updateCustomer(
  id: string,
  prevState: StateCustomer,
  formData: FormData
) {
  // export async function updateCustomer(id: string, formData: FormData) {
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: formData.get('image_url'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Customer.',
    };
  }
  //Prepare data for insertion into the database
  const { name, email, image_url } = validatedFields.data;

  try {
    await sql`
    UPDATE customers
    SET name = ${name}, email = ${email}, image_url = ${image_url}
    WHERE id = ${id}
  `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Customer.' };
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

export async function deleteCustomer(id: string) {
  const invoiceToDelete = await fetchInvoiceCustomer(id);

  invoiceToDelete.map((invoice) => {
    deleteInvoice(invoice.id);
  });

  const urlCustomer = await fetchImageUrlCustomer(id);
  if (urlCustomer != '/customers/profile-default.png') {
    const image_urlToRemove = urlCustomer.substring(urlCustomer.lastIndexOf('/') + 1);
    deleteUTFiles([image_urlToRemove]);
  }

  await sql`DELETE FROM customers WHERE id = ${id}`;
  revalidatePath('/dashboard/customers');
}

export async function updateCustomerProfile(id: string, image_url: string) {
  try {
    await sql`
    UPDATE customers
    SET image_url = ${image_url}
    WHERE id = ${id}
  `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Customer profile.' };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
