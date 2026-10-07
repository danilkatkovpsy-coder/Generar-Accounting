# Supabase backend

The app stores clients, invoices, purchases, expenses, suppliers, supplier invoices, Kontoplaan, opening balances, manual journal entries, company details, invoice appearance settings, and invoice email templates in the organization database after all migrations are applied. Invoice email uses the `send-invoice` Edge Function and Resend; delivery remains unavailable until the server secrets are configured and the function is deployed.

## First setup

1. Open the Supabase dashboard at `https://supabase.com/dashboard`, create an account, then create a project named `Arvesemu`.
2. Choose a region in the EU. Generate a strong database password, save it in a password manager, and do not put it in this repository or send it in chat.
3. Wait until the project is ready. Open **SQL Editor**, create a query, paste the contents of `migrations/20261003000100_accounting_core.sql`, and run it. The migration creates the tables and enables Row Level Security.
4. Create a second query and run `migrations/20261003000200_cloud_invoice_writes.sql`. It adds invoice snapshots and an atomic, organization-scoped operation for saving invoice lines. Run each migration only once.
5. Create a third query and run `migrations/20261003000300_organization_accounting_data.sql`. It adds organization-scoped storage for purchases, expenses, suppliers, supplier invoices, and invoice appearance settings; it also adds company contact and bank fields. Existing browser-only data is copied to the organization the first time an authorized user signs in after this migration.
6. Run `migrations/20261004000100_organization_member_read_grants.sql` to grant the member-list read required by authenticated app sessions.
7. Run `migrations/20261004000200_invoice_email_delivery_service_grants.sql` to grant the Edge Function the minimum access needed to record email delivery status.
8. Run `migrations/20261004000300_invoice_email_template_key.sql` to allow cloud storage of the single customizable invoice email template used with either interface language.
9. Run `migrations/20261004000400_vat_registration_and_invoice_tax.sql` to add organization VAT settings and invoice tax fields.
10. Run `migrations/20261005000100_invoice_payment_status.sql` to add invoice payment status and payment date. This is required for the Paid/Unpaid control in Sales.
11. Run `migrations/20261005000200_invoice_amount_due.sql` to add invoice balances, backfill unpaid amounts, and keep paid status synchronized with a zero balance.
12. Run `migrations/20261005000300_invoice_payments.sql` to store invoice payment amounts, methods, and dates, and atomically update the remaining balance.
13. Run `migrations/20261005000400_seller_website.sql` to add the organization website field.
14. Run `migrations/20261005000500_invoice_author_emails.sql` to add invoice creator and editor metadata.
15. Run `migrations/20261005000600_invoice_item_discounts.sql` to persist invoice line discounts.
16. Run `migrations/20261006000100_invoice_item_editor_fields.sql` to persist invoice line account, object, unit, and text-line details.
17. Run `migrations/20261007000100_invoice_payment_bank_entry_reversal.sql` to support reversing linked bank entries when invoice payments are edited or removed.
18. Run `migrations/20261007000200_sales_quotes_and_orders.sql` to store quotes and sales orders.
19. Run `migrations/20261007000300_fixed_assets.sql` to allow organization-scoped fixed-asset data.
20. Run `migrations/20261007000400_manual_journal_entries.sql` to allow organization-scoped manual journal entries.
21. Run `migrations/20261007000500_unified_accounting_ledger.sql` to allow organization-scoped Kontoplaan and opening-balance records.
22. Run `migrations/20261007000600_delete_organization.sql` to add the organization deletion verification store and role-checked deletion logic.
23. Run `migrations/20261007000700_email_verified_organization_deletion.sql` only if it was not applied previously; it removes any legacy direct-delete RPC and completes the previous email-code rollout.
24. Run `migrations/20261007000800_reauthenticated_organization_deletion.sql` to remove email-code storage and require fresh account reauthentication. Email/password users re-enter their password; Google users sign in through Google with `prompt=login`. The database accepts deletion only when `auth_time` is no older than five minutes, the user is an owner or administrator, and another organization remains.
25. In **Authentication > Sign In / Providers**, verify that Email and Google providers are enabled. In **URL Configuration**, set the production Site URL to `https://arvesemu.ee/` and add `https://arvesemu.ee/**`, `https://www.arvesemu.ee/**`, `https://danilkatkovpsy-coder.github.io/**`, `http://127.0.0.1:8000/**`, `http://127.0.0.1:8173/**`, and `http://localhost:8173/**` to the allowed redirect URLs. These permit sign-in and reauthentication callbacks to return to the app.
26. Open the project's **Connect** dialog or **Settings > API Keys** and copy the **Project URL** and public **publishable** key (or legacy `anon` key). These are intended for browser apps. Never share the database password, a `service_role` key, or a secret API key.
27. Do not upload real client or accounting data until all 22 migrations have been applied and authentication, database access, and email delivery have been tested.

The `create_organization(name, registration_code)` RPC creates an organization for the signed-in user and makes that user its owner. Organization deletion requires recent reauthentication: email/password users re-enter their password, while Google users complete OAuth with `prompt=login`. The database verifies the fresh `auth_time`, permits only owners and administrators, and refuses to remove the user's last organization. Team invitations need a server-side endpoint; clients must not be allowed to write directly to `organization_members`.

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

## Invoice email delivery

The send action uses the `send-invoice` Supabase Edge Function. It checks the signed-in user's organization role, reads the saved invoice, emails its PDF attachment through Resend, and writes `pending`, `sent`, or `failed` to `invoice_email_deliveries`. The visible sender is the verified domain address in `EMAIL_FROM`; replies are addressed to the organization's owner email from Supabase Auth.

1. Create a Resend account and verify a domain you control. Add the DNS records Resend gives you. A GitHub Pages address is not a sender domain. For initial testing, Resend's test sender can only send to the account's verified address.
2. Create a Resend API key. Do not paste it into chat, source files, GitHub, or the browser.
3. Install the Supabase CLI on macOS (`brew install supabase/tap/supabase`) and log in (`supabase login`).
4. From the project folder, enter the Resend key and verified sender address as Supabase secrets. Type the real key only in your terminal:

	```sh
	supabase secrets set --project-ref jkdknlxgeuvxhyauhden RESEND_API_KEY=re_your_key EMAIL_FROM="Arvesemu <arved@your-verified-domain>"
	```

5. Deploy the function:

	```sh
	supabase functions deploy send-invoice --project-ref jkdknlxgeuvxhyauhden
	```

The browser sends only the invoice ID and generated PDF. Supabase secrets, including `SUPABASE_SERVICE_ROLE_KEY`, stay on the server. Test with your own verified email before sending customer invoices.