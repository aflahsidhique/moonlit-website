# Moonlit Foundation — Admin API

Express + Prisma (SQLite) backend for the admin panel at `/admin` and the
volunteer portal at `/portal`. Handles volunteer registrations, blood
requests, partner inquiries, contact messages, newsletter signups, and
event creation/registration — everything the public site's forms submit
to, and everything the admin panel manages.

## Setup

```bash
cd server
npm install
cp .env.example .env        # then edit ADMIN_EMAIL / ADMIN_PASSWORD / JWT_SECRET / CLOUDINARY_*
npx prisma migrate dev --name init
npm run seed                 # creates the admin login + 2 sample events
npm run dev                   # http://localhost:4000
```

`npm run seed` is idempotent — safe to re-run. It only creates the admin
account if one doesn't already exist for `ADMIN_EMAIL`, and only seeds
sample events if the events table is empty.

**Cloudinary** — the volunteer form's photo and ID document uploads are
streamed straight to Cloudinary (never written to local disk). Set
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`
in `.env` from your [Cloudinary console](https://cloudinary.com/console).
Only JPG/JPEG and PNG are accepted (enforced both client-side via the file
input's `accept` attribute and server-side via multer's `fileFilter`),
5MB max per file. Uploads land in the `moonlit/volunteer-photos` and
`moonlit/volunteer-ids` folders in your Cloudinary account.

**Change the seeded admin password** after your first login — there's no
"change password" endpoint yet, so for now: update `ADMIN_PASSWORD` in
`.env`, delete the admin row via `npx prisma studio`, and re-run
`npm run seed`.

## Volunteer approval → credentials → portal

The first time an admin approves a volunteer (in `/admin`), the server:
1. Assigns a permanent **Volunteer ID** — `MLF` + year + 5-digit number,
   e.g. `MLF202500001`, `MLF202500002` — the counter resets each year.
2. Generates a random password, hashes it (bcrypt) and stores the hash —
   the plaintext password is never saved anywhere, only used once to
   compose the notification.
3. Emails and texts the volunteer their Volunteer ID, password, and the
   portal link (`PORTAL_URL` in `.env`).

Volunteers log in at `/portal/index.html` with their Volunteer ID +
password to view their own profile and status (read-only for now).

**If email/SMS wasn't configured yet** (see below), approval still
succeeds — the admin panel's toast will say e.g. `email failed: not
configured`. Use the **Resend Credentials** button on an approved
volunteer's row to generate a fresh password and retry delivery once
you've set up Gmail/SMS Gate (the old password stops working the moment
you do this).

**Email (Gmail SMTP)** — set `GMAIL_USER` (full Gmail address) and
`GMAIL_APP_PASSWORD` (a 16-character [App Password](https://myaccount.google.com/apppasswords),
not your normal Gmail password — requires 2-Step Verification enabled on
the account). Leave blank to skip email sending.

**SMS ([SMS Gate](https://sms-gate.app))** — set `SMSGATE_BASE_URL`
(`https://api.sms-gate.app/3rdparty/v1` for their hosted cloud service, or
your own device's URL if self-hosting), `SMSGATE_USERNAME` and
`SMSGATE_PASSWORD` (Basic Auth credentials issued per-device when you
register with SMS Gate). Leave blank to skip SMS sending. Phone numbers
are normalized to E.164 assuming +91 (India) when no country code is
given, since that's what the registration form collects.

## Serving the static site alongside it

The frontend (the `.html` files one level up, plus `/admin`) is still a
plain static site with no build step. Don't open it via `file://` —
serve it so `fetch()` calls behave consistently across browsers:

```bash
# from the project root, in a separate terminal
npx serve -l 5500
```

Then add whatever origin you're serving from to `CORS_ORIGINS` in `.env`
(defaults already include `http://localhost:5500`).

## API surface

All routes are prefixed `/api`. Public routes need no auth. Admin routes
require `Authorization: Bearer <token>` from `POST /api/auth/login`.
Volunteer-portal routes require a *separate* token from
`POST /api/volunteer-auth/login` — the two token types carry different
`role` claims and are rejected on each other's routes (an admin token gets
`403` on `/volunteer-auth/me`, and vice versa).

| Resource | Public | Admin |
|---|---|---|
| Auth | `POST /auth/login` | `GET /auth/me` |
| Volunteers | `POST /volunteers` | `GET /volunteers`, `PATCH /volunteers/:id`, `DELETE /volunteers/:id`, `POST /volunteers/:id/resend-credentials` |
| Volunteer portal | `POST /volunteer-auth/login` | *(volunteer auth)* `GET /volunteer-auth/me` |
| Blood requests | `POST /blood-requests` | `GET /blood-requests`, `PATCH /blood-requests/:id`, `DELETE /blood-requests/:id` |
| Partner inquiries | `POST /partners` | `GET /partners`, `PATCH /partners/:id`, `DELETE /partners/:id` |
| Contact messages | `POST /contact` | `GET /contact`, `PATCH /contact/:id`, `DELETE /contact/:id` |
| Newsletter | `POST /newsletter` | `GET /newsletter`, `DELETE /newsletter/:id` |
| Events | `GET /events` (published only) | `GET /events/admin` (all), `POST /events`, `PUT /events/:id`, `PATCH /events/:id/status`, `DELETE /events/:id` |
| Event registrations | `POST /events/:id/register` | `GET /events/:id/registrations`, `GET /event-registrations` (all events), `PATCH /event-registrations/:id`, `DELETE /event-registrations/:id` |

Status values (enforced in route handlers, since SQLite has no native enum
support in Prisma):
- Volunteers / Partners: `pending | approved | rejected`
- Blood requests: `pending | in_progress | fulfilled | closed`
- Contact messages: `unread | read | replied`
- Events: `draft | published`
- Event registrations: `pending | confirmed | cancelled`

## Notes for production

This is built for local/dev use as requested. Before deploying anywhere
public:
- Switch `datasource db` in `prisma/schema.prisma` from `sqlite` to
  `postgresql` (or `mysql`) and point `DATABASE_URL` at a real server —
  a single-file SQLite DB isn't safe for concurrent writes under real load.
- Tighten `CORS_ORIGINS` to your real domain only.
- Put the API behind HTTPS and set a long, unique `JWT_SECRET`.
- Add rate-limiting to the public POST endpoints (volunteer/blood/contact
  forms are unauthenticated and open to spam as-is).
