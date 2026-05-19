-- Supabase PostgreSQL schema for InterRisk Académico

create table if not exists students (
  id text primary key,
  password text not null,
  full_name text not null,
  faculty text not null,
  program text not null,
  current_course text not null,
  created_at timestamptz default now()
);

create table if not exists teachers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null check (email like '%@universidad.edu.co'),
  password text not null,
  full_name text not null,
  faculty text not null,
  program text not null,
  created_at timestamptz default now()
);

create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  faculty text not null,
  program text not null,
  course_name text not null,
  teacher_id uuid references teachers(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists academic_history (
  id uuid primary key default gen_random_uuid(),
  student_id text not null references students(id) on delete cascade,
  subject_id uuid references subjects(id) on delete set null,
  semester text not null,
  average numeric(4,2) not null check (average >= 0 and average <= 5),
  attendance numeric(5,2) not null check (attendance >= 0 and attendance <= 100),
  failed_subjects integer not null default 0,
  repeated_subjects integer not null default 0,
  total_classes integer not null default 0,
  absences integer not null default 0,
  risk_percentage numeric(5,2) default 0,
  risk_level text default 'Bajo',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  student_id text not null references students(id) on delete cascade,
  teacher_id uuid references teachers(id) on delete set null,
  message text not null,
  risk_percentage numeric(5,2) not null,
  risk_level text not null,
  created_at timestamptz default now()
);

create index if not exists idx_history_student on academic_history(student_id);
create index if not exists idx_alerts_student on alerts(student_id);
