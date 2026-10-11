# ILÉ — Nigerian Kitchen & Table

A responsive restaurant web app built from the approved ILÉ screen design. Real Unsplash photographs by Keesha’s Kitchen and Chibuzo Nwaneri; no generated food imagery.

## Included

- Searchable Nigerian menu, categories, dietary notes, customisation and persistent device cart.
- Server-priced orders, pickup or Victoria Island delivery, saved history, tracking and reorder.
- Date-validated table requests, edits, cancellation and restaurant confirmation.
- ChatGPT sign-in through Sites, account-scoped D1 storage, profile, addresses, favourites and notification preferences.
- Staff-only restaurant console with order progression and reservation approval.
- Installable web app manifest and network-offline fallback. No authenticated pages or API data are cached by the service worker.

## Development

The Sites plugin owns dependency setup, build, migration deployment and publishing. Run `npm run db:generate` for schema changes and `npm run build` for an artifact. Run `node scripts/test-domain.mjs`, `node scripts/test-api.mjs`, and `node scripts/test-client.cjs` after installing dependencies.

## Restaurant setup before public launch

- The Site is public. Anyone can browse; account records and writes require sign-in. Sign-in is provided by Sites, not a simulated phone code.
- Set `STAFF_EMAIL` to the authorised restaurant operator's authenticated account email to enable the console. Staff authorisation is checked on every server request. No visitor can grant themselves access.
- Menu prices, allergen details, venue address, contact details, service area and operating times need restaurant approval.
- Online card payments and outbound SMS/email are not configured. Checkout uses pay on collection/delivery. Notification preferences are stored, and statuses are visible in the app.
- Table submissions are requests and remain `Requested` until authorised staff confirm them; this build does not invent table availability.
- Order submissions are saved records in this build. It is not connected to a trading restaurant or dispatch service.
- The D1 database is provisioned and migrated through `.openai/hosting.json`. Personal records are filtered by the Sites-authenticated user ID; prices and totals are recomputed on the server.

Photo sources: https://unsplash.com/@keeshasskitchen and https://unsplash.com/@chibuzonwaneri.
