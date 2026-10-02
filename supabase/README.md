# Supabase backend

The app has Supabase email sign-in and stores clients and invoices in the organization database. Purchases, expenses, company settings, and automatic invoice email are not connected yet.

## First setup

1. Open the Supabase dashboard at `https://supabase.com/dashboard`, create an account, then create a project named `Generar Accounting`.
2. Choose a region in the EU. Generate a strong database password, save it in a password manager, and do not put it in this repository or send it in chat.
3. Wait until the project is ready. Open **SQL Editor**, create a query, paste the contents of `migrations/20261003000100_accounting_core.sql`, and run it. The migration creates the tables and enables Row Level Security.
4. Create a second query and run `migrations/20261003000200_cloud_invoice_writes.sql`. It adds invoice snapshots and an atomic, organization-scoped operation for saving invoice lines. Run each migration only once.
5. In **Authentication > Sign In / Providers**, verify that the Email provider is enabled. Hosted Supabase projects require email confirmation by default. In **URL Configuration**, set the production Site URL to `https://danilkatkovpsy-coder.github.io/Generar-Accounting/` and add that URL plus `http://127.0.0.1:8000/` to the allowed redirect URLs.
6. Open the project's **Connect** dialog or **Settings > API Keys** and copy the **Project URL** and public **publishable** key (or legacy `anon` key). These are intended for browser apps. Never share the database password, a `service_role` key, or a secret API key.
7. Do not upload real client or accounting data until authentication and database access have been connected and tested.

The `create_organization(name, registration_code)` RPC creates an organization for the signed-in user and makes that user its owner. Team invitations need a server-side endpoint; clients must not be allowed to write directly to `organization_members`.

## Google sign-in

The login screen includes a Google button. Configure its provider once before using it:

1. In Google Cloud, create or select a project and configure the Google Auth Platform consent screen. For initial testing, use the External audience and add your Google account as a test user if the app remains in Testing.
2. Create an OAuth client ID with application type **Web application**. Add these **Authorized JavaScript origins**:
	- `https://danilkatkovpsy-coder.github.io`
	- `http://127.0.0.1:8000`
3. Add this **Authorized redirect URI**: `https://jkdknlxgeuvxhyauhden.supabase.co/auth/v1/callback`.
4. Create the client and copy its Client ID and Client Secret. In Supabase, open **Authentication > Sign In / Providers > Google**, enable Google, and enter both values.
5. Save the Google provider settings. Keep the Client Secret in Supabase only; never put it in this repository or the browser app.

## Keys and email

The Supabase project URL and publishable/anon key may be used by the browser only after the app is connected and the RLS policies have been reviewed. Never put a `service_role` key, database password, or email-provider API key in `index.html`, another browser file, or the GitHub repository.

Invoice email must be sent by a server-side function. That function will create delivery records so the app can display sent/failed status. The current “Отправить” action still opens the user's mail program and does not send or attach email automatically. Later, a mail provider and verified sender address will be needed; its API key must be stored as a server-side function secret, never in browser code.