# BOOK MY TICKETS — product decisions before coding

Answer by number. The suggestions below are proposals, not assumed approval. You can explicitly accept suggested defaults and override individual answers. No credentials or private verification documents are needed for this discussion.

## A. Delivery and market

1. Immediate scope: founder portal + partner portal + backend only, or connect/rebuild the customer mobile app in this release too? Suggested: portals/backend first, then mobile integration.
2. Launch categories: movies only, or also concerts/music, comedy, theatre plays, sports, workshops, exhibitions, activities and venue rentals? Which must be usable in the first release?
3. Where will launch operate: countries, cities, currency and interface languages? Suggested initial assumption to confirm: India, INR and English, with localization-ready records.
4. Is venue rental/resource booking itself a product, or are venues only locations where customers buy event tickets? If rental is included, are deposits, time slots and venue-owner approvals required?

## B. Partners and publishing

5. Can partners self-register, or only join through founder invitations? Suggested: self-application with founder approval before selling.
6. Can one partner organization operate multiple venues, and can one person belong to multiple organizations? Suggested: yes to both, with explicit memberships.
7. Can a partner be both a theatre/venue owner and an event organizer? Can organizers host at someone else's venue, and who approves/reserves the venue/date?
8. What verification is required: business name/contact, tax/business identifiers, identity documents, venue proof, bank details or a signed agreement? Which files can staff view, and when do they expire?
9. Which changes need founder approval: partner onboarding, venues, seat maps, movies, events, shows, prices, cancellations, bank details, offers and banners? Suggested: configurable approval rules by resource type.
10. Who manages the shared movie/cast catalog: founders only, partner submissions for approval, or an authorized third-party feed? No copied customer profiles or third-party reviews are proposed.

## C. Staff and access

11. Which founder-team roles are required: founder, operations, catalog editor, support, finance and marketing? Who may invite staff or grant permissions?
12. Which partner roles are required: owner, venue manager, box-office cashier, gate scanner, marketing and accountant? Can each be limited to specific venues/events?
13. Should large refunds, payout releases, owner bank changes and sensitive exports require another founder's approval? If so, what thresholds or exceptions apply?
14. Login methods: founder/partner email-password plus authenticator MFA, email OTP, phone OTP, or a combination? How should customer login work later? Do you already have SMS/email providers?
15. What customer information may partners see: attendee name only, masked phone/email, or contact details for their own bookings? May they export it or use it for marketing, and how is consent obtained?

## D. Venue, event and inventory features

16. Which ticket inventory types are needed: assigned seats, general admission capacity, standing zones, ticket tiers, tables, season passes or combinations? Suggested: assigned seats and general admission as separate supported inventory models.
17. Theatre detail: multiple screens, seat-map editor, row/seat labels, premium/recliner sections, wheelchair/companion seats, broken/blocked seats, languages, subtitles and 2D/3D/IMAX-style formats — which are required initially?
18. Scheduling: repeating shows, event sessions, multi-day passes, on-sale windows, blackout dates, buffer/cleanup times and age restrictions — which should exist in release one?
19. Is this platform the sole source of ticket inventory, or must it share seats with existing theatre POS/other ticketing systems? Are box-office cash/UPI sales required, and are any integration APIs available?
20. Booking rules: hold duration, maximum tickets per order/customer, group booking, complimentary/guest-list tickets, organizer quotas, waitlists and booking cutoff times? Suggested starting hold: five minutes, subject to payment-provider behavior.
21. Do you need food/beverage add-ons, merchandise, parking, memberships, gift cards, loyalty points or subscriptions in the first release?
22. Gate operations: online browser/mobile scanning, dedicated scanner app, or offline scanning? Are re-entry, multi-entry passes, partial group admission and manual code lookup required? Suggested first release: online scanning with duplicate-entry prevention.

## E. Payments, cancellations and finance

23. Will online payment be live in release one or provider sandbox first? Preferred gateway, for example Razorpay, Cashfree, Stripe or another provider? Which payment methods are required?
24. Who receives customer funds: the platform followed by partner settlements, or each partner directly? Do you require automatic split settlements or can verified manual payouts start the business?
25. How do you earn: percentage commission, fixed fee per ticket, customer convenience fee, partner subscription, promotion charges, or a combination? Are terms global or partner/venue/category-specific?
26. Payout rules: daily/weekly/after-event, minimum balance, reserves/holds, deductions, dispute handling and bank-change approval?
27. Cancellation/refund rules: customer cancellation allowed until when, partial ticket cancellation, rescheduling, event cancellation, no-show handling, fee treatment and who approves refunds?
28. Which financial outputs are needed: receipts, tax invoices, credit notes, partner statements, revenue/occupancy reports and CSV/PDF exports? Who supplies the applicable tax/fee rules for configuration?

## F. Discovery, growth and support

29. Customer features to design for: search, city/GPS selection, nearby venues, filters, favourites, following actors/venues/organizers, trailers, ratings, verified-attendee reviews and offers? Which are first-release requirements?
30. Founder promotions: home banners, sponsored search/listings, city-specific campaigns, featured movies/events, coupon codes and scheduled ads? Can partners submit/purchase placements, and who approves them?
31. Notifications: in-app, Android/iOS push, email, SMS and/or WhatsApp? Which are transactional versus opt-in marketing, which segments are needed, and are provider accounts available?
32. Support and moderation: customer/partner support tickets, refund requests, review reporting, chat, escalation levels and response tracking? Should reviews require a completed booking or verified attendance?

## G. Data, storage and operations

33. Confirm storage: PostgreSQL for structured business records and persistent server disk for images/JPG/PNG/WebP and documents, rather than browser localStorage. Are video/audio uploads needed too, or will trailers use approved external links?
34. Media limits: maximum image/document/video size, partner storage quotas, supported formats, private versus public documents and who can delete/replace files? Suggested initial media: JPG/PNG/WebP plus private PDFs; no executable/SVG uploads by default.
35. Data collection: which discovery/booking interactions should be recorded, whether precise location is needed, consent choices, retention periods, export/deletion requests and which staff can access reports? Suggested default: account/booking essentials and aggregated operational metrics; optional marketing tracking separately consented.
36. Deployment: local development machine first, one VPS, existing server or another environment? Approximate first-year venues, daily bookings, concurrent checkout traffic and media volume? Any existing domain, reverse proxy, PostgreSQL installation or occupied services to preserve?
37. Backups: where should separate copies of PostgreSQL and media be stored, how much data loss is acceptable, and how quickly must service be restored? Can the backup destination be a second machine or offline disk while keeping live storage local?
38. Delivery priorities: which modules must work in the first review, which can follow, and what are the acceptance criteria? Suggested first review: secure founder bootstrap, login/MFA, roles, partner approvals, venue/catalog setup, uploads and audit; booking/payments follow as the next complete flow.

## Before-code approval checklist

- Confirm the scope and first-release categories.
- Confirm local media storage and deployment direction.
- Confirm organization/venue ownership and approval rules.
- Confirm authentication and staff permissions.
- Confirm inventory source and ticket types.
- Confirm payment recipient, commission, refunds and settlements.
- Confirm whether mobile reconnection is part of the same release.
- Review architecture-draft.md, then approve or amend the proposal.

Implementation should not substitute guessed business rules for unanswered decisions above.
