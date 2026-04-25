# PulseRescue AI Frontend

React-based frontend for the AI emergency response system.

## Pages

- `/` product overview and live platform summary
- `/dashboard` hospital command center
- `/dashboard/dispatch` dispatch workflow overview
- `/dashboard/units` ambulance fleet interface
- `/dashboard/settings` deployment and integration notes

## Environment

Create `.env.local` from `.env.example`.

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
BACKEND_API_BASE_URL=http://localhost:4000
```

`NEXT_PUBLIC_API_BASE_URL` is used for server-side fetches.
`BACKEND_API_BASE_URL` is used by the frontend rewrite so browser calls to `/api/*` are proxied to the backend service.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Notes

- The dashboard expects the backend service to expose `/api/cases`, `/api/dashboard/summary`, and `/api/ambulances`.
- Fleet actions on `/dashboard/units` update ambulance status through `PATCH /api/ambulances/:driverId`.
