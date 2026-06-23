# GoGenzeb

VIP Membership & Earnings Platform built with **Next.js** and **Supabase**.

## Stack

- **Next.js 16** (App Router)
- **Supabase** (PostgreSQL, Auth, Storage)
- **Tailwind CSS v4**
- **Currency:** Birr (ETB)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local` and fill in your keys
3. Run the migration in **SQL Editor**:

```
supabase/migrations/001_initial_schema.sql
```

4. Create a **Storage** bucket named `deposits` (private)

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, register, forgot password
│   ├── dashboard/       # User dashboard pages
│   └── admin/           # Admin panel (coming soon)
├── components/
│   ├── dashboard/       # Sidebar, stat cards, etc.
│   └── ui/              # Reusable UI components
└── lib/
    ├── supabase/        # Client, server, admin helpers
    └── constants.ts     # Withdrawal rules, commission rates
```

## Business Rules (configured)

| Rule | Value |
|------|-------|
| Currency | Birr |
| Min balance to unlock withdrawals | 700 Birr |
| Withdrawal retention | 30% |
| Referral commission (L1/L2/L3) | 10% / 10% / 10% |
| Daily VIP income | Manual trigger (admin) |
| Hosting | VPS |

## VPS Deployment

```bash
npm run build
npm start
```

Set up a system cron for scheduled tasks:

```bash
# Example: daily reward reset at midnight
0 0 * * * curl -H "Authorization: Bearer $CRON_SECRET" https://yourdomain.com/api/cron/daily-reset
```

Use **PM2** or **Docker** to keep the Next.js process running.

## Next Steps

- [ ] Wire Supabase Auth to login/register forms
- [ ] Connect dashboard to live profile data
- [ ] Deposit flow with screenshot upload
- [ ] Admin panel for approvals
- [ ] Manual VIP daily income trigger (admin action)
