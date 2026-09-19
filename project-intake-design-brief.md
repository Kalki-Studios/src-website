# Project Intake System — Product & Interaction Design Brief

**For:** Antigravity (build agent)
**Written by:** design/product pass before implementation
**Deadline:** working demo link by Wed, 23 Sep 2026
**Status:** decisions below are locked unless stated otherwise. Do not re-open them.

---

## 1. What this product actually is

A service provider ("bhaiya") builds working project prototypes for engineering students — web, app, ML/AI, IoT, general software. His problem is not that he lacks a website. His problem is that **requirement collection happens over dozens of half-finished WhatsApp threads and phone calls**, and he has to do the work of extracting a usable brief from each student, one message at a time.

So the product's job is narrow and specific:

> Move the messy first conversation out of WhatsApp and into one structured submission, so he can read requests when he wants, and reply only to the ones he wants.

WhatsApp is **not being replaced**. It stays as the conversation layer *after* he picks a project. The website is the intake layer only. Every design decision below follows from that.

The demo has one job: when he opens the link on his phone, within about 30 seconds he should think *"this means fewer calls."* Not *"nice website."*

---

## 2. Decisions I'm making for you (and why)

These are the places where the obvious answer is wrong. Follow these.

**Budget: ask it, but as a band, and include an escape hatch.**
A free-text budget box gets garbage — students genuinely don't know the number. A required exact figure drives abandonment. Use a single-select band with "Not sure yet" as a real, non-penalised option. He still gets a triage signal; the student is never blocked.
Bands: `Not sure yet` · `Under ₹3,000` · `₹3,000–8,000` · `₹8,000–15,000` · `₹15,000+`

**Priority: never let the student choose it.**
Every student will select "High." A self-declared urgency field is pure noise. Instead, **derive urgency from the deadline date**. The dashboard computes days remaining and colours the request itself. Honest signal, zero extra form fields, and it's automatically correct.

**Student accounts: no. Not in v1, probably not ever.**
This is a one-time submission, not a recurring product. A signup wall in front of a lead form is the single most reliable way to kill conversions. Instead: on submit, generate a short reference code (e.g. `PRJ-7K2M`) and show it big on the success screen, plus a link `/status/PRJ-7K2M` that shows only a status label. Students get the "can I check?" benefit with zero auth.

**Statuses: cut seven down to four.**
`New` → `Reviewing` → `Accepted` / `Rejected`. Plus a star toggle for "interesting, come back to this."
Every extra status is another decision he has to make on a phone screen. `In Progress` and `Completed` are project-management features for a product he hasn't asked for yet. Leave them out; add later if he actually asks.

**Voice notes: recommended against for v1.**
It's tempting (students explain better out loud, and he's Telugu-speaking). But it recreates the exact problem he's escaping — unstructured audio he has to sit through. A voice note is a WhatsApp voice note with extra steps. If he later says he wants it, add it as an *optional supplement* to the written fields, never a replacement.

**File upload: yes, and it matters more than you'd think.**
Indian college students almost always have a PDF or Word doc from their guide with the problem statement. Letting them attach it is the highest-value, lowest-effort field on the form. Cap at 3 files, 10 MB each, accept PDF/DOC/DOCX/PNG/JPG.

**"Additional requirements" free text: keep exactly one.**
One box labelled plainly, near the end. Not three overlapping ones.

---

## 3. The centerpiece interactive idea: **the hero is step 1**

> **Replaces the earlier "Handoff" split-screen hero. Remove that from the landing page.**
> The Handoff showed bhaiya's admin dashboard to the public. That was a pitch aimed at *him* — but he is not the visitor. The visitor is a stressed student with a deadline, who does not care what the admin panel looks like and should arguably never see it. Showing internal tooling on a public site makes the business look like a demo of itself. Keep the Handoff animation, but move it into the 60-second video you send him on Wednesday, where it belongs.

The hero should do one thing: **get the student into the form before they have time to decide it's too much work.**

**The concept:** the hero *is* step 1 of the form. No "Submit Project" button that leads to a form somewhere else — the first question is right there, above the fold, answerable in one tap.

**How it behaves:**

1. Headline, one line of supporting copy, then immediately the question: **"What kind of project do you need?"**
2. Six large tap targets: `Website / Web app` · `Mobile app` · `ML / AI` · `IoT / Hardware` · `Desktop or other software` · `Not sure yet`
3. On tap, the chosen card stays and locks in; the other five collapse away. A single text input rises into the space: **"In one line, what is it?"**
4. That input's placeholder rotates through **real examples from the category they just picked** — pick IoT and it cycles *"Water level monitoring using ultrasonic sensor"*, *"Smart helmet with accident detection"*, *"Soil moisture based irrigation system"*. Slow rotation, ~3 seconds each, pauses the moment they focus the field.
5. Enter or "Continue" → navigate to `/submit` with category and title already filled, landing them on step 2.
6. Under the input, one quiet line: *"4 short steps. About 3 minutes."*

**Why this is the right hero for this audience:**

- **It answers the student's real first question** — *can he even build my kind of project?* — in the first second, by showing six categories including theirs. No scrolling to a services section to find out.
- **The rotating placeholders are the portfolio**, doing the work of a case-study grid before the student has scrolled at all. They also teach the student what a good one-line description sounds like, which improves the quality of what bhaiya receives.
- **It removes the biggest drop-off point in the whole funnel** — the gap between "interested" and "started filling the form." Two fields are already answered before they've technically started.
- **"About 3 minutes" kills the main abandonment fear.** Students bounce from forms because they assume length, not because of actual length.
- **It's mobile-native.** Six tap cards and one text input is a better phone experience than any split-screen animation, and most of your traffic is phones.

**Motion discipline:** the only movement is the response to their tap — five cards collapsing, one input rising. That's interaction feedback, not decoration. Nothing auto-plays. `prefers-reduced-motion`: swap the collapse for an instant state change.

**Don't:** put the six cards in a carousel, add a "most popular" badge, or auto-select one. Let it be six equal choices.

---

## 4. The two workflow ideas that carry the product

The hero starts the form. These two make the rest work.

### 4.1 Category-first branching form

**The problem:** a generic 18-field form asks IoT students about hosting and web students about sensors. Everyone answers irrelevant questions badly, and bhaiya still has to call.

**The idea:** the form's **first question is the only universal one** — *What kind of project is it?* That single choice rewrites everything after it.

Step 1 — one question, six large tap targets:
`Website / Web app` · `Mobile app` · `ML / AI` · `IoT / Hardware` · `Desktop or other software` · `Not sure yet`

Then the shared steps, plus 2–3 branch-specific questions:

| Category | Extra questions |
|---|---|
| Web | Do you have a reference website or design? Does it need a login/admin panel? |
| Mobile app | Android, iOS, or both? Does it need a backend/database? |
| ML / AI | Do you already have a dataset? Does it need a UI, or is a notebook enough? |
| IoT | Which hardware do you already have? Who arranges the components — you or us? |
| Software | What platform must it run on? |
| Not sure | Skip branch entirely, rely on description + attachments |

**Why this wins:** every student answers ~10 relevant questions instead of 18 generic ones, so the form *feels shorter* while the brief bhaiya receives is *more complete*. That's the whole UX principle of this project, solved in one structural decision.

The "IoT — who arranges the components" question is the kind of thing that costs three WhatsApp messages every single time. Ask it once, in the form.

### 4.2 The WhatsApp bridge (the feature that will convince him)

On the request detail screen, a primary button: **"Message on WhatsApp"**.

It opens `wa.me/<student number>` with a pre-written message already filled in, in simple English:

> Hi Ravi, this is regarding your project request PRJ-7K2M (Smart Attendance System). I can take this up. Let's discuss the details.

Plus a secondary **"Copy details"** that puts the full request on the clipboard as clean plain text.

**Why this is the most important button in the product:** it proves you understand that WhatsApp isn't the enemy. He isn't being asked to abandon his workflow — he's being handed a faster on-ramp into it. In the demo, this is the moment where he gets it. Make it visually the strongest element on the detail screen.

---

## 5. Site structure

**Public**
- `/` — Landing. Hero (step 1 of the form, live) → how it works (4 steps) → previous work → CTA band. The six-category grid lives in the hero, so there is no separate services section — that would be the same content twice.
- `/submit` — The form (multi-step).
- `/submitted` — Success screen: big reference code, what happens next, expected reply time, link to check status.
- `/status/[code]` — Status only. No login. Shows: submitted / being reviewed / accepted / not taken this time.

**Private**
- `/admin` — Request list. This is the default landing after login.
- `/admin/[id]` — Request detail.
- `/admin/login` — Single account, created by you. No signup page.

That's it. No blog, no pricing page, no about page, no team section. A pricing page would be actively harmful — pricing is per-project and negotiable, and publishing rates would cost him leverage.

---

## 6. The form, in order

**Design rules:** 4 steps, a slim progress bar, one column, large touch targets, keyboard type set correctly per input (`tel`, `email`), autosave to `localStorage` on every change so a dropped connection doesn't wipe the form. Never show all 4 steps' worth of fields at once.

**Step 1 — Project type**
Already answered in the hero for anyone arriving from the landing page — they land on step 2 with the category locked in and a small editable chip showing their choice. Students who hit `/submit` directly see this step as the six cards; selecting one advances immediately, no "Next" button.

**Step 2 — About the project**
- Project title *(required)*
- Describe your project *(required, textarea, min ~30 words enforced softly — see the meter below)*. Placeholder should be a real example, not "Enter description."
- What do you need? *(required, single select)*: `Working prototype` · `Complete project` · `Fix / modify existing project` · `Only a demo for review` · `Not sure`
- Branch questions for the chosen category *(2–3, mostly optional)*
- Technologies you need *(optional)* — free text, with a one-line hint that it's fine to leave blank

**Step 3 — Timeline and budget**
- Submission deadline *(required, date picker, defaults to nothing — don't pre-fill)*
- Budget *(required, the bands from §2)*
- Attach files *(optional)* — drag/drop on desktop, plain tap-to-pick on mobile

**Step 4 — How to reach you**
- Your name *(required)*
- College *(required)*
- Phone *(required)*
- WhatsApp — checkbox "Same as phone number", checked by default; reveals a second field only when unchecked
- Email *(required)*
- Anything else you want to add *(optional)*

**Submit button:** "Send project request." Not "Submit."

### The completeness meter (nice-to-have, build if time allows)

Under the description box, a quiet three-state indicator:

- *"Add a few more lines so he can understand your idea"*
- *"Good — this explains the basic idea"*
- *"Very clear — he probably won't need to call you"*

Driven by simple heuristics: description length, whether category-branch questions are answered, whether a file is attached. **Never blocks submission.** It reframes detail as being in the student's own interest — which it is — instead of as a validation error. This is the cheapest available lever on the core problem.

If Tuesday is tight, cut this before cutting anything else in §6.

---

## 7. Admin dashboard

**Assume he opens this on an Android phone, inside WhatsApp's in-app browser.** Design mobile-first and treat desktop as the bonus. A desktop-first dashboard that "also works on mobile" will fail the demo.

**List view**
- Default sort: newest first. Secondary toggle: closest deadline first.
- Each row/card: student name · project title · category chip · deadline with computed days-left · budget band · status chip · star.
- Filter row that stays reachable: status, category, urgency (`< 7 days`, `< 15 days`), budget band.
- Search across name, college, title.
- Counts at the top: `New 6 · Reviewing 2 · Accepted 3`. Tapping one filters. These double as the empty-state guide.

**Urgency colouring** — functional only, not decorative:
`> 30 days` neutral · `8–30 days` normal · `≤ 7 days` flagged · `overdue` flagged and moved up.

**Detail view**
Everything on one scroll, in this order: student + contact block (phone/WhatsApp/email all tappable) → project summary → full description → branch answers → attachments → private notes box → status control → **Message on WhatsApp**.

Status change should be one tap with immediate optimistic UI, no modal, no confirmation dialog. He'll do this dozens of times.

**Private notes** matter: a small textarea only he sees. "Quoted 5k, waiting for reply." This is where the tool starts becoming his actual memory instead of his chat history, and it costs almost nothing to build.

---

## 8. Visual direction

Ground the design in the subject: engineering coursework, lab notebooks, technical drawing, submission deadlines. **Not** startup-SaaS, not cream-and-serif, not a dark hero with a neon accent.

**Signature device:** the hairline grid, borrowed from graph paper. Use it as section dividers, form-step separators, and the dashboard's table structure. Where other designs would reach for a card with a soft shadow, use a ruled line instead. One consistent device, used everywhere, zero decoration.

**Palette** — 6 tokens, most of the interface is the first three:
```
--ink     #16233A   deep navy — all text, headers
--paper   #FFFFFF   backgrounds
--rule    #DDE3EC   grid lines, borders, dividers
--mute    #5B6B84   secondary text, labels
--go      #0B6E4F   accepted, success, WhatsApp action
--flag    #C2410C   deadline pressure ONLY — never decorative
```
`--flag` is a functional colour. If it appears anywhere that isn't communicating time pressure, it's being used wrong.

**Type** — one family, weight for hierarchy:
- UI + display: a clean grotesque (Geist or Inter Tight). Display sizes at 600–700 weight, tight tracking. Body at 400.
- Tabular numerals on in the dashboard so deadline columns align.
- IBM Plex Mono for reference codes only (`PRJ-7K2M`) — it's an identifier, so mono is doing real work, not styling.

**Layout:** left-aligned throughout, including the hero. Centered hero text is the default tell. Body copy under 70 characters per line.

**Motion:** nothing auto-plays and nothing animates on scroll. The page's one piece of movement is the hero responding to the student's tap. Interaction feedback (step transitions, status changes, submit) is welcome and should be fast (150–200ms). Fade-and-slide-up on every section is the generated-page signature; don't.

**Avoid specifically:** ALL-CAPS eyebrow labels above headings, `01 / 02 / 03` numbering anywhere except the actual 4-step process (where it's real), `→` glued onto button text, identical rounded cards with the same grey shadow, one word of the headline in a different colour.

---

## 9. Copy (simple English — he is Telugu-speaking, and so are most students)

Short words, plain verbs, sentence case. No jargon.

**Hero headline:** *Tell us your project idea. Get a working project built.*
**Hero sub:** *Fill one form with your idea, deadline and budget. We read every request and reply to the ones we can take.*
**Primary CTA:** *Submit your project*

**How it works (4 steps):**
1. Fill the form with your project details
2. We read your request
3. If we can take it, we message you on WhatsApp
4. Work starts after we agree on details and cost

**Success screen:** *Request received.* / *Your reference number is PRJ-7K2M. Save it.* / *We read requests every day. If we can take your project, we will message you on WhatsApp. If you don't hear back in 3 days, we could not take it this time.*

Note that last line — **set the expectation that not every request is accepted, in writing, on the success screen.** This is exactly the promise he asked not to make. It also quietly reduces the follow-up messages he gets.

**Empty dashboard state:** *No requests yet. New submissions will appear here.*

### Positioning

Describe the service as what it is: development and prototyping work. Use *project development*, *working prototype*, *technical implementation*, *build support*. The strongest and most defensible framing is: **we build the working software, you understand it and present it.**

Don't reach for phrases that promise academic outcomes — no "guaranteed marks", no "submission ready", no "we handle your submission." Beyond being the kind of claim that makes a business look shady to anyone senior who lands on the page, they're claims he can't actually keep. Keeping the copy accurate to what he does is both the honest choice and the one that makes the site look like a real development business rather than an assignment mill.

---

## 10. Stack

**Recommended: Next.js (App Router) + Tailwind + shadcn/ui + Supabase, deployed on Vercel.**

Reasoning, since this was left open:
- **Next.js** — public site, form and admin dashboard in one codebase and one deployment. Server actions handle form submission without writing an API layer.
- **Supabase** — gives you Postgres, file storage and auth in one service. Storage solves attachments without touching S3. Auth solves the admin login with a single pre-created user and no signup flow. Free tier is comfortably enough.
- **Postgres over MongoDB** — the entire admin experience is filtering and sorting on structured fields. That's relational work. Mongo buys you nothing here.
- **Not Django** — fine framework, wrong fit for a 5-day polished-UI deadline; you'd be building the frontend separately anyway.

**Schema — two tables:**

```sql
requests (
  id            uuid primary key,
  ref_code      text unique,        -- PRJ-7K2M
  created_at    timestamptz,
  student_name  text,
  college       text,
  phone         text,
  whatsapp      text,
  email         text,
  category      text,               -- web|app|ml|iot|software|unsure
  title         text,
  description   text,
  deliverable   text,               -- prototype|complete|modify|demo|unsure
  tech_notes    text,
  deadline      date,
  budget_band   text,
  branch_answers jsonb,             -- category-specific Q&A
  extra_notes   text,
  status        text default 'new', -- new|reviewing|accepted|rejected
  starred       boolean default false,
  admin_notes   text,
  updated_at    timestamptz
)

attachments ( id, request_id → requests.id, storage_path, file_name, size_bytes )
```

Urgency is **computed at read time** from `deadline`. Never stored.

Row Level Security: public can `insert` into `requests` only. Only the authenticated admin can `select`/`update`. Get this right before deploying — an open table is the one mistake that turns this demo into a liability.

---

## 11. Demo strategy (read this — it decides whether he says yes)

**Seed the dashboard with 8 realistic requests before you send the link.** An empty dashboard is an unsold product. Seed them with genuinely varied, believable data — a mix of categories, two with deadlines inside a week so the urgency flagging visibly fires, a range of budget bands, a couple already marked Accepted and Rejected so the workflow is legible at a glance. Use plausible college names from Andhra Pradesh and Odisha. Don't use real students' details.

**Portfolio section:** you have one genuine case study — the project he built for you. Use it properly, with a screenshot. Fill the rest with clearly-labelled category examples rather than inventing client work, and **don't fabricate testimonials.** If he wants that section filled, he can send you real screenshots. That's a good second conversation to have with him.

**Send three things on Wednesday, not one:**
1. The link
2. A 60-second screen recording — submit a request, then show it appearing in his dashboard, then tap the WhatsApp button. He may never explore the admin side on his own; the video guarantees he sees the payoff. **This is where the student-side → dashboard-side handoff gets demonstrated.** It's the right argument, aimed at the right person, in the right place — a video for him, not a section on a page for students.
3. A one-line message in the same casual register you've been using: *"Bhaiya, demo is ready. Video shows how it works. Login details are in the next message."*

Send his login in a separate message so it's easy for him to find later.

**Test the link inside WhatsApp's in-app browser on a real Android phone before sending.** That's the only environment that matters on Wednesday.

---

## 12. Build order, Fri 18 → Wed 23

| Day | Work |
|---|---|
| **Fri** | Supabase project, schema, RLS, seed script. Next.js scaffold, design tokens, typography scale. No UI yet. |
| **Sat** | Public landing page, mobile-first. The Handoff hero last, after the static sections work. |
| **Sun** | The submission form. All four steps, branching, validation, localStorage autosave, submit → DB, success screen with ref code. |
| **Mon** | Admin: auth, list view, filters, sort, detail view, status changes, private notes, WhatsApp bridge. |
| **Tue** | File uploads, `/status/[code]`, seed the 8 requests, full mobile QA on a real phone, deploy. Record the video. |
| **Wed** | Send. |

Tuesday evening is your buffer. If you're behind by Monday night, cut in this order: completeness meter → `/status` page → file uploads → portfolio richness. **Never cut the WhatsApp bridge or mobile polish** — those are the demo.

---

## 13. Explicitly out of scope for v1

Do not build these, even if they seem quick: student accounts, payment or quote generation, in-app chat, email notifications to students, project progress tracking, multi-admin roles, analytics dashboards, dark mode, a blog, a pricing page, automated WhatsApp API integration.

Every one of these is a reasonable v2 conversation to have **after** he's used the intake system for two weeks and told you what's actually annoying him. Building them now costs you Wednesday.

---

## 14. The one thing not to lose

If any decision during the build is unclear, resolve it against this sentence:

> Instead of students repeatedly calling and messaging him with incomplete project details, students submit their requirements in one organized place, and he reviews those requests whenever he is free and chooses the projects he wants to take.

If a feature doesn't serve that, it doesn't ship on Wednesday.
