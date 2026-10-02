# NaokPL

Private website: https://naokpl.reesedathird.chatgpt.site

Delivered October 1, 2026. Sign in with the owning ChatGPT account. Public access has not been enabled and no paid services were purchased.

## What works

- Real opportunities, official application links, search and eligibility filters, source coverage and verification dates.
- Defaults: United States, student opportunities, May 2029 graduation, unknown graduation eligibility included.
- 36 original mini-lessons across 12 finance tracks, quizzes, flashcards, spaced review, technical and behavioral timed practice.
- Private application stages and notes, story bank, profile and study progress stored in the site's database.
- A midnight-blue, indigo and teal interface with mobile navigation and collapsible filters.

## Verified results

The hosted import on October 1 at approximately 3:41 p.m. Eastern successfully checked all 11 registered employer feeds and stored 128 unique finance listings. The hosted private-record endpoint returned HTTP 401 when called using service access without a signed-in visitor. This keeps the shared data updater separate from personal records.

The resumed local checkout passed all 13 data tests and TypeScript checks. The tests cover repeat imports, duplicate requisitions and recruiting cycles, source failures, expired listings, graduation parsing, unknown eligibility and quiz grading. A mobile layout check at 390 pixels showed no horizontal overflow. Browser checks confirmed calculation feedback and saved study progress; the earlier test application's stage and notes persisted after restarting. Local preview records belong to a development test account and were not copied into the hosted personal database.

Private publication succeeded, including the current refresh configuration. The hosted update path was tested through supported service access without an open browser.

## Background refresh

An enabled, Site-linked cloud schedule refreshes all registered sources daily at 7:00 a.m. America/New_York, beginning October 2, 2026. Its first scheduled execution has not happened yet; creation of the schedule is not proof of a completed scheduled run. Each run reads registered sources, imports them sequentially, and checks stored results. Routine successful runs should remain quiet; failures or required user action should be reported.

The updater uses GET /api/opportunities, POST /api/refresh?source=<registered-source-id>, then GET /api/opportunities for readback. It obtains supported private-Site service access at runtime. Credentials are not included in the schedule, source archive or browser code. Preserve owner-only access. Before any future public sharing, disable PRIVATE_REFRESH_ENABLED and implement narrower scheduler authorization.

## Coverage and limitations

Feeds: Garda Capital Partners, GCM Grosvenor, Bridgewater Associates, Capstone Investment Advisors, Assured Guaranty, Compeer Financial, Robinhood, Perpay, Faraday Future, Heven AeroTech and EQT Corporation.

Coverage is curated, not exhaustive. Many large investment banks, PE/VC firms, Workday/Taleo portals and special early-career programs are not integrated. Some categories have no current openings. General web discovery is manual source research rather than an automated crawler. Function and eligibility parsing are search aids; check the employer's complete requirements. Unknown deadlines, compensation and sponsorship are left unspecified.

The preparation library is introductory, not a full professional qualification or comprehensive interview bank. Its exercises are original and link to supporting resources. No paid AI feedback is required. There is no user-facing backup/export console.

## Source and setup

NaokPL-source.zip contains the saved source, tests, database migration, dependency lockfile and README with local setup instructions. It excludes installed dependencies, local database data and secrets. The published source commit is daffd647f6f0823f0b5f4d805528fb75422e7ca0. This delivery note describes hosting and scheduling completed after that source snapshot.

To develop locally, extract the archive, install Node.js 22.13 or newer, run npm ci, and follow README.md for environment setup, local database initialization, build and preview. Never expose the development authentication mock to the internet. Reuse the existing Site registration in .openai/hosting.json rather than creating another Site.

No paid data or AI subscription is used. Hosting and scheduling depend on the account's existing Sites/ChatGPT availability and limits; pricing or unlimited usage is not guaranteed. No custom domain was purchased.

## Maintenance identifiers

- Site: appgprj_6abdd3601dac8191b56cd3578dfbb54e
- Saved version: appgprj_6abdd3601dac8191b56cd3578dfbb54e~appgver_46ade229868c8191985ba1a04c88bbba
- Successful deployment with refresh label: appgdep_6abeb7846edc8191a154df1f0a4fb7b8
- Enabled schedule: Automation_9714a469c4408191a7bfda5b81e99c31

The local Sites packaging files became unavailable during this continuation. The supported remote build fallback successfully published the already-pushed source. Future source edits may require restoring the Sites local tooling; the hosted site and saved schedule are independent of that local tooling.
