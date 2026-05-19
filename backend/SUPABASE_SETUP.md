# Configuración Supabase (PostgreSQL) paso a paso

1. Crea un proyecto en Supabase.
2. Ve a **Project Settings > API** y copia:
   - `SUPABASE_URL`
   - `service_role key`
3. En el repo, crea/edita `backend/.env`:
   ```env
   SUPABASE_URL=https://<project-id>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
   FLASK_ENV=development
   ```
4. Abre **SQL Editor** en Supabase y ejecuta `backend/db/schema.sql` completo.
5. Inserta datos iniciales mínimos en tablas `students`, `teachers`, `subjects`, `academic_history`.
6. Instala dependencias backend:
   ```bash
   pip install -r backend/requirements.txt
   ```
7. (Opcional pero recomendado) entrena modelo:
   ```bash
   python backend/model/train_model.py
   ```
8. Ejecuta Flask:
   ```bash
   python backend/app.py
   ```

## Endpoints disponibles
- `POST /auth/login`
- `GET /students/<student_id>`
- `GET /teachers/students?teacher_email=...&search_id=...`
- `POST /teachers/update-academic`
- `POST /predict`
- `GET /health`
