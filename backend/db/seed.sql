-- Seed data compatible with backend/db/schema.sql

-- Teachers (3)
insert into teachers (id, email, password, full_name, faculty, program)
values
  ('11111111-1111-1111-1111-111111111111', 'carlos.mejia@universidad.edu.co', 'teacher123', 'Prof. Carlos Mejía', 'Ingeniería', 'Ingeniería de Sistemas'),
  ('22222222-2222-2222-2222-222222222222', 'elena.ruiz@universidad.edu.co', 'teacher123', 'Prof. Elena Ruiz', 'Ingeniería', 'Ingeniería Electrónica'),
  ('33333333-3333-3333-3333-333333333333', 'mateo.leon@universidad.edu.co', 'teacher123', 'Prof. Mateo León', 'Ciencias Básicas', 'Matemáticas')
on conflict (email) do nothing;

-- Subjects
insert into subjects (id, code, name, faculty, program, course_name, teacher_id)
values
  ('a1111111-1111-1111-1111-111111111111', 'SIS101', 'Programación I', 'Ingeniería', 'Ingeniería de Sistemas', 'Programación I', '11111111-1111-1111-1111-111111111111'),
  ('a2222222-2222-2222-2222-222222222222', 'SIS202', 'Bases de Datos', 'Ingeniería', 'Ingeniería de Sistemas', 'Bases de Datos', '11111111-1111-1111-1111-111111111111'),
  ('a3333333-3333-3333-3333-333333333333', 'ELE101', 'Física I', 'Ingeniería', 'Ingeniería Electrónica', 'Física I', '22222222-2222-2222-2222-222222222222'),
  ('a4444444-4444-4444-4444-444444444444', 'MAT101', 'Cálculo', 'Ciencias Básicas', 'Matemáticas', 'Cálculo', '33333333-3333-3333-3333-333333333333')
on conflict (code) do nothing;

-- Students (10)
insert into students (id, password, full_name, faculty, program, current_course)
values
  ('2024001', 'student123', 'Ana Rodríguez', 'Ingeniería', 'Ingeniería de Sistemas', 'Programación I'),
  ('2024002', 'student123', 'Juan Pérez', 'Ingeniería', 'Ingeniería de Sistemas', 'Bases de Datos'),
  ('2024003', 'student123', 'Laura Gómez', 'Ingeniería', 'Ingeniería Electrónica', 'Física I'),
  ('2024004', 'student123', 'Miguel Torres', 'Ciencias Básicas', 'Matemáticas', 'Cálculo'),
  ('2024005', 'student123', 'Camila Díaz', 'Ingeniería', 'Ingeniería de Sistemas', 'Programación I'),
  ('2024006', 'student123', 'Diego Rivas', 'Ciencias Básicas', 'Matemáticas', 'Cálculo'),
  ('2024007', 'student123', 'Sara Vélez', 'Ingeniería', 'Ingeniería Electrónica', 'Física I'),
  ('2024008', 'student123', 'Andrés Molina', 'Ciencias Básicas', 'Matemáticas', 'Cálculo'),
  ('2024009', 'student123', 'Paula Herrera', 'Ingeniería', 'Ingeniería de Sistemas', 'Bases de Datos'),
  ('2024010', 'student123', 'Nicolás Franco', 'Ingeniería', 'Ingeniería Electrónica', 'Física I')
on conflict (id) do nothing;

-- Academic history (20 rows) with mixed trajectories
insert into academic_history (
  student_id, subject_id, semester, average, attendance, failed_subjects, repeated_subjects,
  total_classes, absences, risk_percentage, risk_level
) values
  -- Good/low risk
  ('2024001','a1111111-1111-1111-1111-111111111111','2023-2',4.20,92,0,0,32,2,12,'Bajo'),
  ('2024001','a1111111-1111-1111-1111-111111111111','2024-1',4.10,90,0,0,32,3,15,'Bajo'),
  ('2024003','a3333333-3333-3333-3333-333333333333','2023-2',4.40,95,0,0,32,1,8,'Bajo'),
  ('2024003','a3333333-3333-3333-3333-333333333333','2024-1',4.30,93,0,0,32,2,10,'Bajo'),
  ('2024005','a1111111-1111-1111-1111-111111111111','2023-2',3.90,88,1,0,32,4,28,'Bajo'),
  ('2024005','a2222222-2222-2222-2222-222222222222','2024-1',3.80,87,1,1,32,4,32,'Medio'),
  ('2024009','a2222222-2222-2222-2222-222222222222','2023-2',4.00,89,0,0,32,3,20,'Bajo'),
  ('2024009','a2222222-2222-2222-2222-222222222222','2024-1',3.85,85,1,0,32,5,35,'Medio'),

  -- Medium risk
  ('2024007','a3333333-3333-3333-3333-333333333333','2023-2',3.70,82,1,1,32,6,45,'Medio'),
  ('2024007','a3333333-3333-3333-3333-333333333333','2024-1',3.50,80,1,1,32,6,52,'Medio'),
  ('2024010','a3333333-3333-3333-3333-333333333333','2023-2',3.60,79,1,1,32,7,55,'Medio'),
  ('2024010','a3333333-3333-3333-3333-333333333333','2024-1',3.20,75,2,1,32,8,64,'Medio'),

  -- High risk + descending averages + repeated subjects
  ('2024002','a2222222-2222-2222-2222-222222222222','2023-2',3.60,78,1,1,32,7,58,'Medio'),
  ('2024002','a2222222-2222-2222-2222-222222222222','2024-1',3.10,70,2,2,32,10,76,'Alto'),
  ('2024004','a4444444-4444-4444-4444-444444444444','2023-2',3.20,72,2,2,32,9,72,'Alto'),
  ('2024004','a4444444-4444-4444-4444-444444444444','2024-1',2.80,66,3,3,32,11,84,'Alto'),
  ('2024006','a4444444-4444-4444-4444-444444444444','2023-2',3.00,68,2,2,32,10,78,'Alto'),
  ('2024006','a4444444-4444-4444-4444-444444444444','2024-1',2.90,65,3,2,32,11,82,'Alto'),
  ('2024008','a4444444-4444-4444-4444-444444444444','2023-2',3.30,74,2,1,32,8,69,'Medio'),
  ('2024008','a4444444-4444-4444-4444-444444444444','2024-1',2.95,63,3,3,32,12,88,'Alto')
on conflict do nothing;

-- Optional alerts aligned to risk
insert into alerts (student_id, teacher_id, message, risk_percentage, risk_level)
values
  ('2024002','11111111-1111-1111-1111-111111111111','Descenso académico y baja asistencia detectados.',76,'Alto'),
  ('2024004','33333333-3333-3333-3333-333333333333','Repetición de materias en aumento.',84,'Alto'),
  ('2024008','33333333-3333-3333-3333-333333333333','Asistencia crítica y riesgo de deserción elevado.',88,'Alto')
on conflict do nothing;
