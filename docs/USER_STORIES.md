# User Stories and Acceptance Criteria - Hostel Management System (Group 14)

**Author:** Mancirat Singh (Product Owner), PES2UG24CS263
**Reference:** SRS v1.0 (`Hostel_Management_System_SRS_v1.docx`), Section 4 and Section 5
**Issue:** #19

Each story follows the form *As a [role], I want [goal] so that [benefit]*. Acceptance criteria are written as Given / When / Then so the tester (#23, #24) and the final demo (#20) can check them directly. Priority follows the SRS (High / Medium) and is ordered into a backlog at the end.

---

## 1. Authentication and Access Control

### US-01 (FR-01) User login - High - TC-AUTH-01
**As a** registered user (student, warden, administrator or maintenance staff), **I want** to log in with my credentials **so that** I reach the dashboard for my role.

- Given a valid username and password, when I submit the login form, then I land on the dashboard for my role.
- Given a wrong password or unknown username, when I submit, then I see a clear error message and no session is created.
- Given empty fields, when I submit, then the form tells me which fields are required.

### US-02 (FR-02) Role-based access - High - TC-AUTH-02
**As an** administrator, **I want** each role to see and do only what it is permitted to **so that** private records stay protected.

- Given I am a student, when I call an admin-only endpoint such as `/api/students`, then I receive 403.
- Given I am not logged in, when I call any protected endpoint, then I receive 401.
- Given I am logged in, when I open a page not meant for my role, then access is denied.

## 2. Student and Room Management

### US-03 (FR-03) Student record management - High - TC-STU-01
**As an** administrator, **I want** to create, view and update student records **so that** hostel data stays current.

- Given valid student details, when I add a student, then the student appears in the list.
- Given an existing student, when I update their details, then the new values are saved and displayed.
- Given I am not an administrator, when I try to change a student record, then the change is denied.

### US-04 (FR-04) Room availability - High - TC-ROOM-01
**As a** warden or administrator, **I want** to see which rooms and beds are available **so that** I can allocate efficiently.

- Given stored room and bed data, when I open the availability view, then available and allocated beds are clearly distinguished.
- Given an allocation was just made, when I reload the view, then that bed shows as allocated.

### US-05 (FR-05) Room/bed allocation - High - TC-ROOM-02
**As a** warden or administrator, **I want** to allocate an available bed to a student **so that** the student has a room.

- Given an available bed and a student, when I allocate, then the allocation is saved and linked to that student and bed.
- Given I am a student, when I try to allocate a bed, then the request is refused.

### US-06 (FR-06) Allocation validation - High - TC-ROOM-03
**As a** warden, **I want** the system to block double allocation **so that** two students never share one bed.

- Given a bed already allocated, when I try to allocate it again, then the system returns 409 and the existing allocation is unchanged.

## 3. Fees, Complaints and Maintenance

### US-07 (FR-07) Fee records - High - TC-FEE-01
**As an** administrator, **I want** to record and update fee amount, due date and payments **so that** fee data is accurate and retrievable.

- Given valid fee details, when I add a fee for a student, then amount and due date are saved.
- Given an existing fee, when I record a payment, then the payment details are saved and can be retrieved later.

### US-08 (FR-08) Payment status - High - TC-FEE-02
**As a** student, **I want** to see whether my fee is Paid, Pending or Partially Paid **so that** I know what I owe.

- Given a part payment, when I view my fees, then status shows Partially Paid; after full payment it shows Paid.
- Given no payment, when I view my fees, then status shows Pending.
- Given I am a student, when I view fees, then I see only my own records.

### US-09 (FR-09) Complaint submission - High - TC-COMP-01
**As a** student, **I want** to submit a complaint with category and description **so that** hostel staff can act on it.

- Given a category and description, when I submit, then the complaint is saved with a unique ID, the submission date and an initial status of open.
- Given a missing category or description, when I submit, then a validation message is shown.

### US-10 (FR-10) Complaint tracking - Medium - TC-COMP-02
**As a** student, **I want** to see the status of my complaints **so that** I know progress without asking staff.

- Given I submitted complaints, when I open my complaints, then I see each with its current status.
- Given other students have complaints, when I view mine, then I never see theirs.

### US-11 (FR-11) Maintenance assignment - High - TC-MAINT-01
**As a** warden, **I want** to assign a request to a maintenance staff member who can update its status **so that** issues get fixed and tracked.

- Given an open complaint, when I assign it to a staff member such as maint1, then it appears in that person's list.
- Given an assigned request, when the staff member marks it In progress or Resolved, then the new status is saved and visible to permitted users.

## 4. Leave, Visitors, Announcements and Reports

### US-12 (FR-12) Leave/outpass request - High - TC-LEAVE-01
**As a** student, **I want** to submit a leave or outpass request with dates and reason **so that** I get permission to leave.

- Given complete details, when I submit, then the request is saved and appears in the warden's review queue.
- Given missing or invalid dates, when I submit, then it is rejected with a message.

### US-13 (FR-13) Leave approval - High - TC-LEAVE-02
**As a** warden, **I want** to approve or reject requests **so that** hostel exits are controlled.

- Given a pending request, when I approve or reject it, then the decision and my name as reviewer are recorded and the status changes.
- Given a request already decided, when I try to decide again, then the system refuses.

### US-14 (FR-14) Leave status - Medium - TC-LEAVE-03
**As a** student, **I want** to see the status of my leave requests **so that** I know whether I can leave.

- Given a decision was made, when I view my requests, then I see the latest status and decision.
- Given other students' requests, when I view mine, then I see only my own.

### US-15 (FR-15) Visitor records - Medium - TC-VIS-01
**As a** warden, **I want** to record visitor name, purpose, date/time and the student visited **so that** there is a visit log.

- Given valid visitor details, when I save, then the entry appears in the visitor list and can be retrieved.
- Given I am a student, when I try to record or list visitors, then access is denied.

### US-16 (FR-16) Announcements - Medium - TC-ANN-01
**As a** warden or administrator, **I want** to publish announcements **so that** residents are informed.

- Given a title and message, when I publish, then students can see it.
- Given I am a student, when I try to publish, then I receive 403.

### US-17 (FR-17) Administrative reports - Medium - TC-REPORT-01
**As an** administrator, **I want** summaries of occupancy, fee status and complaint status **so that** I can oversee the hostel.

- Given data in the system, when I open the report, then totals match the underlying tables.
- Given I am not an administrator, when I request the report, then access is denied.

## 5. Quality and Security Stories

| ID | SRS Ref | Story | Priority | Acceptance criteria | Test |
|----|---------|-------|----------|---------------------|------|
| US-18 | SEC-01 | As an admin, I want passwords stored hashed so that a database leak does not expose them. | High | No plaintext passwords in the database; salted hashing (bcrypt) used. | TC-SEC-01 |
| US-19 | SEC-02 | As an admin, I want the backend to enforce roles so that hiding a button is not the only protection. | High | Direct requests by a disallowed role are rejected. | TC-SEC-02 |
| US-20 | SEC-03 | As an admin, I want inputs validated and queries parameterised so that injection fails. | High | Invalid input rejected; injection strings do not change query structure. | TC-SEC-03 |
| US-21 | SEC-04 | As an admin, I want HTTPS when deployed so that traffic is protected. | High | Deployment config redirects or blocks insecure access. | TC-SEC-04 |
| US-22 | SEC-05 | As a user, I want logout to end my session so that nobody can reuse it. | High | After logout, `/api/auth/me` returns 401 until a new login. | TC-SEC-05 |
| US-23 | SEC-06 | As an admin, I want logs and errors free of passwords and tokens. | Medium | Logs and error responses reviewed after failures contain no secrets. | TC-SEC-06 |
| US-24 | NFR-01 | As a user, I want pages to respond quickly under load. | High | With 25 concurrent users, 95% of requests finish within 3 seconds. | TC-PERF-01 |
| US-25 | NFR-02 | As a user, I want clear labels, validation messages and confirmations on login, complaints and leave. | High | A reviewer completes each task without undocumented steps. | TC-UX-01 |
| US-26 | NFR-03 | As a user, I want saved records to survive reload. | High | Records created, then page reloaded, stay consistent. | TC-REL-01 |
| US-27 | NFR-04 | As a developer, I want a modular code structure. | Medium | Routes, controllers and config are separate modules. | TC-MAINT-02 |
| US-28 | NFR-05 | As a user, I want core workflows to work in Chrome, Edge and Firefox. | Medium | Core checklist passes in each browser. | TC-COMPAT-01 |
| US-29 | NFR-06 | As an admin, I want invalid or duplicate data rejected. | High | Invalid or duplicate entries rejected and existing records unchanged. | TC-DATA-01 |

---

## Prioritised Backlog

**Must have (High):** FR-01, FR-02, FR-03, FR-04, FR-05, FR-06, FR-07, FR-08, FR-09, FR-11, FR-12, FR-13, plus SEC-01 to SEC-05, NFR-01, NFR-02, NFR-03, NFR-06.

**Should have (Medium):** FR-10, FR-14, FR-15, FR-16, FR-17, SEC-06, NFR-04, NFR-05.

**Out of scope for this release:** online payment gateway and SMS notifications (SRS 1.2 and 2.5).

**Order of delivery:** Sprint 1 covered FR-01 to FR-06 and the foundation security items. Sprint 2 covers FR-07 to FR-17, and the final testing round covers the remaining security and non-functional items.
