-- HMS remaining modules (FR-07 to FR-17). Run after schema.sql
USE hms;

CREATE TABLE IF NOT EXISTS fees (
  fee_id      INT AUTO_INCREMENT PRIMARY KEY,
  student_id  INT NOT NULL,
  description VARCHAR(100) NOT NULL DEFAULT 'Hostel fee',
  amount      DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
  due_date    DATE NOT NULL,
  updated_by  INT NOT NULL,
  updated_on  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (updated_by) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS complaints (
  complaint_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id   INT NOT NULL,
  category     VARCHAR(30) NOT NULL,
  description  VARCHAR(500) NOT NULL,
  status       ENUM('open','assigned','in_progress','resolved') NOT NULL DEFAULT 'open',
  assigned_to  INT NULL,
  created_on   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_on   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (assigned_to) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS leave_requests (
  leave_id    INT AUTO_INCREMENT PRIMARY KEY,
  student_id  INT NOT NULL,
  from_date   DATE NOT NULL,
  to_date     DATE NOT NULL,
  reason      VARCHAR(300) NOT NULL,
  destination VARCHAR(150),
  status      ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  reviewed_by INT NULL,
  reviewed_on TIMESTAMP NULL,
  created_on  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (reviewed_by) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS visitors (
  visitor_id   INT AUTO_INCREMENT PRIMARY KEY,
  visitor_name VARCHAR(100) NOT NULL,
  purpose      VARCHAR(200) NOT NULL,
  visit_time   DATETIME NOT NULL,
  student_id   INT NULL,
  recorded_by  INT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (recorded_by) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS announcements (
  announcement_id INT AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(150) NOT NULL,
  body       VARCHAR(1000) NOT NULL,
  audience   ENUM('all','students','staff') NOT NULL DEFAULT 'all',
  posted_by  INT NOT NULL,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(user_id)
);
