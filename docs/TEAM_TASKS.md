# Team Roles and Task Allocation - Group 14

| Member | SRN | Role |
|--------|-----|------|
| Mayukh K Pravin | PES2UG24CS271 | Scrum Master |
| Mancirat Singh | PES2UG24CS263 | Product Owner |
| N V Kritheesh | PES2UG24CS293 | Developer |
| Nandan C | PES2UG24CS301 | Tester |

## Tasks (2 per member)

| # | Owner | Task | Covers |
|---|-------|------|--------|
| 1 | Mayukh (SM) | Create GitHub issues and a Project board for all tasks below; run stand-ups and track progress | Process |
| 2 | Mayukh (SM) | Integration: load `schema.sql` + `schema_sprint2.sql`, run `npm run seed`, start the app, merge all work into `main`, prepare the sprint report | Delivery |
| 3 | Mancirat (PO) | Write user stories and acceptance criteria per requirement, prioritise the backlog, and update SRS Appendix B checklist and RTM wording | FR-01 to FR-17 |
| 4 | Mancirat (PO) | Run the final demo against acceptance criteria and give accept/reject per feature; record results in the sprint report | FR-01 to FR-17 |
| 5 | Kritheesh (Dev) | Set up and verify fees, complaints and maintenance modules; fix any bugs found | FR-07 to FR-11 |
| 6 | Kritheesh (Dev) | Set up and verify leave, visitors, announcements and reports modules and the `portal.html` pages; fix any bugs found | FR-12 to FR-17 |
| 7 | Nandan (Tester) | Execute functional test cases (TC-AUTH, TC-STU, TC-ROOM, TC-FEE, TC-COMP, TC-MAINT-01, TC-LEAVE, TC-VIS, TC-ANN, TC-REPORT) and record pass/fail | FR-01 to FR-17 |
| 8 | Nandan (Tester) | Execute security and non-functional tests (TC-SEC-01..06, TC-DATA-01, TC-REL-01, TC-COMPAT-01, TC-PERF-01) and update the RTM status column | SEC, NFR |

## Where the code lives

| Module | Requirements | Files |
|--------|--------------|-------|
| Fees | FR-07, FR-08 | `src/routes/fees.js`, `src/controllers/feeController.js` |
| Complaints / maintenance | FR-09, FR-10, FR-11 | `src/routes/complaints.js`, `src/controllers/complaintController.js` |
| Leave / outpass | FR-12, FR-13, FR-14 | `src/routes/leave.js`, `src/controllers/leaveController.js` |
| Visitors | FR-15 | `src/routes/visitors.js`, `src/controllers/visitorController.js` |
| Announcements | FR-16 | `src/routes/announcements.js`, `src/controllers/announcementController.js` |
| Reports | FR-17 | `src/routes/reports.js`, `src/controllers/reportController.js` |
| Pages | all | `public/portal.html`, `public/js/portal.js` |
| Database | all | `database/schema_sprint2.sql` |

## Manual test checklist (FR-07 to FR-17)
Log in with the demo accounts from the README (admin1, warden1, maint1, student1).
- [ ] TC-FEE-01/02: admin adds a fee, records a part payment, status shows Partially Paid, then Paid; student sees only own fees
- [ ] TC-COMP-01: student submits a complaint, it appears with status open
- [ ] TC-COMP-02: student sees own complaints only
- [ ] TC-MAINT-01: warden assigns it to maint1; maint1 sees it and marks In progress / Resolved
- [ ] TC-LEAVE-01: student submits leave; it appears in the warden queue
- [ ] TC-LEAVE-02: warden approves or rejects; a second decision on the same request is refused
- [ ] TC-LEAVE-03: student sees the decision
- [ ] TC-VIS-01: warden records a visitor and sees it in the list
- [ ] TC-ANN-01: warden publishes; student sees it; student cannot publish (403)
- [ ] TC-REPORT-01: admin report totals match the underlying tables

Only mark a requirement as Passed in the RTM after the test has actually been run.
