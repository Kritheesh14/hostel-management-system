# Final Demo and Feature Acceptance - Hostel Management System (Group 14)

**Product Owner:** Mancirat Singh (PES2UG24CS263)
**Issue:** #20
**Reference:** `docs/USER_STORIES.md` and SRS v1.0, Section 4
**Demo date:** ____________  **Environment:** ____________ (browser, OS, local/deployed)

Decision values: **Accepted**, **Rejected**, or **Pending** (not yet demonstrated). Only record Accepted after seeing the acceptance criteria met live in the demo. Rejected items need a reason so the team can fix them.

Demo accounts: admin1, warden1, maint1, student1 (see README / seed data).

## Feature acceptance

| Req | Feature | Priority | Demo steps (short) | Decision | Notes / reason if rejected |
|-----|---------|----------|--------------------|----------|----------------------------|
| FR-01 | User login | High | Log in as each role; try a wrong password | Pending | |
| FR-02 | Role-based access | High | As student, open admin endpoint / page; log out and retry | Pending | |
| FR-03 | Student records | High | Admin adds and updates a student | Pending | |
| FR-04 | Room availability | High | Open availability list; check available vs allocated | Pending | |
| FR-05 | Room/bed allocation | High | Allocate a bed to a student | Pending | |
| FR-06 | Allocation validation | High | Allocate the same bed again, expect 409 | Pending | |
| FR-07 | Fee records | High | Admin adds a fee and records a part payment | Pending | |
| FR-08 | Payment status | High | Status shows Pending, Partially Paid, then Paid; student sees only own | Pending | |
| FR-09 | Complaint submission | High | Student submits a complaint; appears as open | Pending | |
| FR-10 | Complaint tracking | Medium | Student sees only own complaints | Pending | |
| FR-11 | Maintenance assignment | High | Warden assigns to maint1; maint1 updates status | Pending | |
| FR-12 | Leave/outpass request | High | Student submits; appears in warden queue | Pending | |
| FR-13 | Leave approval | High | Warden approves/rejects; second decision refused | Pending | |
| FR-14 | Leave status | Medium | Student sees the decision | Pending | |
| FR-15 | Visitor records | Medium | Warden records and lists a visitor | Pending | |
| FR-16 | Announcements | Medium | Warden publishes; student sees it; student cannot publish (403) | Pending | |
| FR-17 | Administrative reports | Medium | Admin report totals match underlying data | Pending | |

## Non-functional and security acceptance (based on the tester's results)

| Req | Area | Decision | Basis (test result reference) |
|-----|------|----------|-------------------------------|
| SEC-01 to SEC-06 | Security | Pending | `docs/TEST_REPORT.md` (TC-SEC-01 to 06) |
| NFR-01 | Performance | Pending | TC-PERF-01 |
| NFR-02 | Usability | Pending | TC-UX-01 |
| NFR-03 | Reliability | Pending | TC-REL-01 |
| NFR-04 | Maintainability | Pending | TC-MAINT-02 |
| NFR-05 | Compatibility | Pending | TC-COMPAT-01 |
| NFR-06 | Data integrity | Pending | TC-DATA-01 |

## Summary

- Accepted: __ / 17 functional requirements
- Rejected: __ (list IDs and what must change)
- Pending: __

**Overall decision:** ____________

**Follow-up actions:**
1. ____________

*Signed (Product Owner):* Mancirat Singh  Date: ____________
