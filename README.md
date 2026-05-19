# InterRisk Académico

Frontend React para el proyecto **“Predicción temprana de deserción académica mediante modelos de machine learning integrados en una plataforma web”**.

La fase actual refactoriza la experiencia hacia una plataforma institucional de detección temprana de riesgo académico con autenticación simulada por roles.

## Arquitectura frontend

```txt
src/
  App.jsx                         # Control de sesión mock y enrutamiento por rol
  main.jsx                        # Bootstrap React
  styles.css                      # Sistema visual responsive sin librerías externas
  components/
    auth/
      Login.jsx                   # Login principal estudiante/profesor
    dashboard/
      DashboardShell.jsx          # Layout común con header y sidebar
    shared/
      MetricCard.jsx              # Cards reutilizables de métricas
      RiskBadge.jsx               # Badge por nivel de riesgo
      Sidebar.jsx                 # Navegación lateral institucional
    student/
      StudentDashboard.jsx        # Panel de estudiante
    teacher/
      TeacherDashboard.jsx        # Panel de profesor
  data/
    mockData.js                   # Datos simulados de estructura académica y estudiantes
  utils/
    academicCalculations.js       # Promedio, asistencia y tendencia académica
```

## Funcionalidades incluidas

- Login inicial responsive con selector de rol:
  - Estudiante: ID institucional + contraseña.
  - Profesor: correo institucional + contraseña.
- Autenticación simulada sin backend.
- Dashboard estudiante con:
  - estado académico general,
  - historial por semestre,
  - tendencia académica,
  - materias problemáticas,
  - alertas preventivas sin mensajes deterministas de deserción.
- Dashboard profesor con:
  - búsqueda por ID,
  - filtros Facultad → Programa → Curso,
  - tabla de estudiantes del curso,
  - sección de alertas tempranas,
  - registro de notas y faltas con cálculo automático.
- Cálculo automático de asistencia:

```js
attendance_percentage = ((total_classes - absences) / total_classes) * 100
```

- Cálculo automático de promedio a partir de notas registradas.

## Ejecución local

Instala dependencias:

```bash
npm install
```

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

Genera build de producción:

```bash
npm run build
```

Ejecuta lint:

```bash
npm run lint
```

## Próximas integraciones previstas

- Backend Flask para autenticación real y endpoints académicos.
- PostgreSQL/Supabase para persistencia.
- Scikit-learn para inferencia de riesgo académico.
