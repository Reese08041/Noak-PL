# NaokPL

A private finance opportunity and interview preparation workspace. Default search: United States, student programs, May 2029 graduation, including unknown graduation eligibility. Change geography and education from Edit profile.

## Run locally

Requires Node.js 22.13 or newer and npm. Install from the committed lockfile with npm ci. Copy .env.example to .dev.vars. Run npm run build once, then apply the initial local schema with: node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --file drizzle/0000_quiet_elektra.sql. Do not reapply that initial SQL to an existing database. Then npm run dev; open http://127.0.0.1:5173. Local sign-in is a development mock for one test identity; never expose the development server to the internet. npm test checks ingestion and lesson integrity. npx tsc --noEmit checks types. npm run build builds the Worker-compatible application.

## Architecture

Vinext/React/TypeScript, Cloudflare Worker routes and D1 SQLite durable storage. Opportunities and source checks are shared; application records, notes, stories, mock history and learning progress are keyed by authenticated user ID. Production identity comes from the trusted Sites dispatcher, never a user ID in submitted JSON. Preserve that boundary when migrating hosting. Local data and secrets are ignored by Git and deployment packages.

GET /api/opportunities reads live stored records and provenance. POST /api/refresh?source=BOARD imports one configured official board. lib/catalog.ts defines expandable finance functions, program types, source industries and regions; lib/normalize.ts implements conservative extraction; lib/ingest.ts handles atomic import, rate limits and closure checks. Repeated imports preserve first discovery and deduplicate requisition/cycle IDs. One failed feed does not close jobs. Two successful absences at least 24 hours apart close a missing job; first absence marks it unverified.

## Hosting and independent refresh

This checkout is bound to the existing private Site in .openai/hosting.json. Publish through the Sites workflow, with generated migrations and the exact pushed source commit. Do not register another Site for this checkout. A linked cloud schedule must POST each registered source and verify the resulting source_checks/ingestion_runs. Browser activity is not the scheduler. The Source directory displays actual last successful checks. See DELIVERY.md for the final verified hosting/schedule status.

PRIVATE_REFRESH_ENABLED=true allows refresh behind the owner-only Sites boundary. **Before widening the audience, disable this setting and replace it with dedicated server-side scheduler authorization.** Never place service credentials in the frontend, source, task prompt or URLs. REFRESH_SCHEDULE_LABEL is optional presentation metadata and is not proof of a successful scheduled run.

## Data coverage and limits

Eleven official Greenhouse job-board APIs cover Garda Capital Partners, GCM Grosvenor, Bridgewater, Capstone Investment Advisors, Assured Guaranty, Compeer Financial, Robinhood, Perpay, Faraday Future, Heven AeroTech and EQT Corporation. This includes investing, insurance, banking, fintech and finance at industrial/energy employers. Initial latest feeds contain 127 classified finance listings worldwide; counts change. No demonstration openings are mixed into live results.

Coverage is deliberately incomplete: large investment banks, many private equity/VC firms and Workday/Taleo sources are not integrated. Some supported function/program filters have no current openings. No paywalls, login barriers or CAPTCHAs are bypassed. The initial adapter uses title-based categorization and explicit text excerpts; users must review the full published requirements and official application. Unknown graduation years stay selectable. Year matching does not establish month, citizenship, degree or sponsorship eligibility. Provider first-published dates may refer to reused requisitions; discovery dates are separate. Missing deadlines, compensation and sponsorship remain unspecified. Only explicitly structured deadlines support deadline sorting/filtering; prose deadlines remain visible in details.

Add a verified source to lib/catalog.ts only after checking its actual public feed and application links. For another ATS, write a dedicated adapter and test its complete-feed semantics before enabling closure detection. Broader web discovery is currently manual source research; no recurring general web crawler is included.

## Learning content

36 original mini-lessons across 12 tracks, with relative beginner/intermediate/advanced levels, calculations, explanations, citations and review dates. They form an introductory library, not a complete professional qualification or full interview question bank. lib/learning.ts links specific public resources from SEC, CFA Institute, NYU/Damodaran, FINRA, CME, OCC, ACCA, MIT, Python, NAIC, FinCEN, CFI and Wall Street Prep. Behavioral guidance links USF, Harvard and JPMorganChase. Original numerical exercises are clearly separated from publisher material. Paid full courses are not copied. No AI feedback or paid API is required.

Flashcard ratings and quiz attempts schedule reviews; missed concepts drive recommendations. Timed mocks use a three-minute clock and explicit self-assessment, not a prediction of hiring success. Stories must come from the user's actual experience.

## Costs and accounts

No paid data or AI service is required or purchased. Local operation has no additional service subscription, but needs the computer running. Private hosting and cloud schedules use the user's existing Sites/ChatGPT availability and account limits; this project does not establish or guarantee the account's platform pricing. A public domain or alternative hosting service is optional and has not been purchased. Public access requires the user's approval and the refresh-authentication change above.

## Reliability

See tests/core.test.ts for deterministic real-SQLite ingestion, failures, deduplication, parsing, filters, grading and citation coverage checks. Source failures are displayed and retained records remain available. Keep D1 backups according to the hosting account's available facilities; this version has no user-facing export/recovery console. Never commit .dev.vars, .env secrets, local database files or authentication tokens.
