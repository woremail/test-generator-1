-- PostgreSQL Schema for Test Generator System

-- User and Role Management Tables

CREATE TABLE "School" (
  "school_id" SERIAL PRIMARY KEY,
  "oup_admin_id" INT NOT NULL,
  "name" VARCHAR(255) NOT NULL
);

CREATE TABLE "Campus" (
  "campus_id" SERIAL PRIMARY KEY,
  "school_id" INT NOT NULL,
  "name" VARCHAR(100) NOT NULL
);

CREATE TABLE "User" (
  "user_id" SERIAL PRIMARY KEY,
  "school_id" INT,
  "campus_id" INT,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password_hash" VARCHAR(255) NOT NULL
);

CREATE TABLE "Role" (
  "role_id" SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL CHECK ("name" IN ('Admin', 'School Admin', 'Teacher', 'Content Manager', 'Student'))
);

CREATE TABLE "UserRole" (
  "user_role_id" SERIAL PRIMARY KEY,
  "user_id" INT NOT NULL,
  "role_id" INT NOT NULL,
  UNIQUE("user_id", "role_id")
);

-- Assignments and Grade Structure Tables

CREATE TABLE "Grade" (
  "grade_id" SERIAL PRIMARY KEY,
  "school_id" INT NOT NULL,
  "campus_id" INT NOT NULL,
  "name" VARCHAR(50) NOT NULL
);

CREATE TABLE "StudentGrade" (
  "student_grade_id" SERIAL PRIMARY KEY,
  "student_id" INT NOT NULL,
  "grade_id" INT NOT NULL
);

CREATE TABLE "TeacherAssignment" (
  "assignment_id" SERIAL PRIMARY KEY,
  "teacher_id" INT NOT NULL,
  "grade_id" INT NOT NULL,
  "subject_id" INT NOT NULL
);

-- Content Metadata and Question Banks Tables

CREATE TABLE "Subject" (
  "subject_id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL
);

CREATE TABLE "Book" (
  "book_id" SERIAL PRIMARY KEY,
  "subject_id" INT NOT NULL,
  "grade_id" INT NOT NULL,
  "is_oup_content" BOOLEAN NOT NULL
);

CREATE TABLE "Chapter" (
  "chapter_id" SERIAL PRIMARY KEY,
  "book_id" INT NOT NULL
);

CREATE TABLE "Topic" (
  "topic_id" SERIAL PRIMARY KEY,
  "chapter_id" INT NOT NULL
);

CREATE TABLE "SLO" (
  "slo_id" SERIAL PRIMARY KEY,
  "topic_id" INT NOT NULL
);

CREATE TABLE "Question" (
  "question_id" SERIAL PRIMARY KEY,
  "qb_source" VARCHAR(10) NOT NULL CHECK ("qb_source" IN ('Oxford', 'School')),
  "source_school_id" INT,
  "slo_id" INT NOT NULL,
  "creator_id" INT NOT NULL,
  "status" VARCHAR(15) NOT NULL CHECK ("status" IN ('Pending', 'Approved', 'Rejected'))
);

CREATE TABLE "QuestionOption" (
  "option_id" SERIAL PRIMARY KEY,
  "question_id" INT NOT NULL,
  "is_correct" BOOLEAN NOT NULL
);

-- Test Generation and Results Tables

CREATE TABLE "Quiz" (
  "quiz_id" SERIAL PRIMARY KEY,
  "creator_id" INT NOT NULL,
  "school_id" INT NOT NULL,
  "mode" VARCHAR(10) NOT NULL CHECK ("mode" IN ('Online', 'Offline'))
);

CREATE TABLE "QuizSource" (
  "quiz_source_id" SERIAL PRIMARY KEY,
  "quiz_id" INT NOT NULL,
  "source_type" VARCHAR(10) NOT NULL CHECK ("source_type" IN ('Oxford', 'School'))
);

CREATE TABLE "QuizQuestion" (
  "quiz_question_id" SERIAL PRIMARY KEY,
  "quiz_id" INT NOT NULL,
  "question_id" INT NOT NULL,
  "marks" DECIMAL(5, 2) NOT NULL
);

CREATE TABLE "Assignment" (
  "assignment_id" SERIAL PRIMARY KEY,
  "quiz_id" INT NOT NULL,
  "grade_id" INT NOT NULL
);

CREATE TABLE "StudentAttempt" (
  "attempt_id" SERIAL PRIMARY KEY,
  "assignment_id" INT NOT NULL,
  "student_id" INT NOT NULL,
  "raw_score" DECIMAL(5, 2)
);

CREATE TABLE "StudentAnswer" (
  "answer_id" SERIAL PRIMARY KEY,
  "attempt_id" INT NOT NULL,
  "quiz_question_id" INT NOT NULL
);

-- Foreign Key Constraints

ALTER TABLE "School" ADD FOREIGN KEY ("oup_admin_id") REFERENCES "User" ("user_id");
ALTER TABLE "Campus" ADD FOREIGN KEY ("school_id") REFERENCES "School" ("school_id");
ALTER TABLE "User" ADD FOREIGN KEY ("school_id") REFERENCES "School" ("school_id");
ALTER TABLE "User" ADD FOREIGN KEY ("campus_id") REFERENCES "Campus" ("campus_id");
ALTER TABLE "UserRole" ADD FOREIGN KEY ("user_id") REFERENCES "User" ("user_id");
ALTER TABLE "UserRole" ADD FOREIGN KEY ("role_id") REFERENCES "Role" ("role_id");
ALTER TABLE "Grade" ADD FOREIGN KEY ("school_id") REFERENCES "School" ("school_id");
ALTER TABLE "Grade" ADD FOREIGN KEY ("campus_id") REFERENCES "Campus" ("campus_id");
ALTER TABLE "StudentGrade" ADD FOREIGN KEY ("student_id") REFERENCES "User" ("user_id");
ALTER TABLE "StudentGrade" ADD FOREIGN KEY ("grade_id") REFERENCES "Grade" ("grade_id");
ALTER TABLE "TeacherAssignment" ADD FOREIGN KEY ("teacher_id") REFERENCES "User" ("user_id");
ALTER TABLE "TeacherAssignment" ADD FOREIGN KEY ("grade_id") REFERENCES "Grade" ("grade_id");
ALTER TABLE "TeacherAssignment" ADD FOREIGN KEY ("subject_id") REFERENCES "Subject" ("subject_id");
ALTER TABLE "Book" ADD FOREIGN KEY ("subject_id") REFERENCES "Subject" ("subject_id");
ALTER TABLE "Book" ADD FOREIGN KEY ("grade_id") REFERENCES "Grade" ("grade_id");
ALTER TABLE "Chapter" ADD FOREIGN KEY ("book_id") REFERENCES "Book" ("book_id");
ALTER TABLE "Topic" ADD FOREIGN KEY ("chapter_id") REFERENCES "Chapter" ("chapter_id");
ALTER TABLE "SLO" ADD FOREIGN KEY ("topic_id") REFERENCES "Topic" ("topic_id");
ALTER TABLE "Question" ADD FOREIGN KEY ("source_school_id") REFERENCES "School" ("school_id");
ALTER TABLE "Question" ADD FOREIGN KEY ("slo_id") REFERENCES "SLO" ("slo_id");
ALTER TABLE "Question" ADD FOREIGN KEY ("creator_id") REFERENCES "User" ("user_id");
ALTER TABLE "QuestionOption" ADD FOREIGN KEY ("question_id") REFERENCES "Question" ("question_id");
ALTER TABLE "Quiz" ADD FOREIGN KEY ("creator_id") REFERENCES "User" ("user_id");
ALTER TABLE "Quiz" ADD FOREIGN KEY ("school_id") REFERENCES "School" ("school_id");
ALTER TABLE "QuizSource" ADD FOREIGN KEY ("quiz_id") REFERENCES "Quiz" ("quiz_id");
ALTER TABLE "QuizQuestion" ADD FOREIGN KEY ("quiz_id") REFERENCES "Quiz" ("quiz_id");
ALTER TABLE "QuizQuestion" ADD FOREIGN KEY ("question_id") REFERENCES "Question" ("question_id");
ALTER TABLE "Assignment" ADD FOREIGN KEY ("quiz_id") REFERENCES "Quiz" ("quiz_id");
ALTER TABLE "Assignment" ADD FOREIGN KEY ("grade_id") REFERENCES "Grade" ("grade_id");
ALTER TABLE "StudentAttempt" ADD FOREIGN KEY ("assignment_id") REFERENCES "Assignment" ("assignment_id");
ALTER TABLE "StudentAttempt" ADD FOREIGN KEY ("student_id") REFERENCES "User" ("user_id");
ALTER TABLE "StudentAnswer" ADD FOREIGN KEY ("attempt_id") REFERENCES "StudentAttempt" ("attempt_id");
ALTER TABLE "StudentAnswer" ADD FOREIGN KEY ("quiz_question_id") REFERENCES "QuizQuestion" ("quiz_question_id");
