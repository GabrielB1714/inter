import { useMemo, useState } from 'react';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import MetricCard from '../shared/MetricCard.jsx';
import RiskBadge from '../shared/RiskBadge.jsx';
import { academicStructure, courseStudents } from '../../data/mockData.js';
import { calculateAttendance, calculateAverage } from '../../utils/academicCalculations.js';

const getInitialSelection = () => ({
  faculty: academicStructure[0].faculty,
  program: academicStructure[0].programs[0].name,
  course: academicStructure[0].programs[0].courses[0],
});

function TeacherDashboard({ onLogout }) {
  const [selection, setSelection] = useState(getInitialSelection);
  const [searchId, setSearchId] = useState('');
  const [academicUpdate, setAcademicUpdate] = useState({ grades: '3.2, 3.8, 4.1', totalClasses: 32, absences: 4 });

  const selectedFaculty = academicStructure.find((faculty) => faculty.faculty === selection.faculty);
  const availablePrograms = selectedFaculty?.programs ?? [];
  const selectedProgram = availablePrograms.find((program) => program.name === selection.program);
  const availableCourses = selectedProgram?.courses ?? [];

  const filteredStudents = useMemo(() => {
    return courseStudents.filter((student) => {
      const matchesStructure =
        student.faculty === selection.faculty &&
        student.program === selection.program &&
        student.course === selection.course;
      const matchesSearch = !searchId || student.id.includes(searchId.trim());
      return matchesStructure && matchesSearch;
    });
  }, [selection, searchId]);

  const highRiskStudents = useMemo(
    () => courseStudents.filter((student) => student.risk === 'Alto').slice(0, 3),
    [],
  );

  const parsedGrades = academicUpdate.grades
    .split(',')
    .map((grade) => Number(grade.trim()))
    .filter((grade) => !Number.isNaN(grade));
  const previewAverage = calculateAverage(parsedGrades);
  const previewAttendance = calculateAttendance(
    Number(academicUpdate.totalClasses),
    Number(academicUpdate.absences),
  );

  const handleFacultyChange = (facultyName) => {
    const faculty = academicStructure.find((item) => item.faculty === facultyName);
    const program = faculty.programs[0];
    setSelection({ faculty: facultyName, program: program.name, course: program.courses[0] });
  };

  const handleProgramChange = (programName) => {
    const program = availablePrograms.find((item) => item.name === programName);
    setSelection((current) => ({ ...current, program: programName, course: program.courses[0] }));
  };

  return (
    <DashboardShell
      role="Profesor"
      userName="Docente institucional"
      onLogout={onLogout}
      items={['Curso', 'Alertas tempranas', 'Actualización']}
      title="Gestión preventiva por curso"
      subtitle="Filtra la estructura académica, revisa riesgos y registra datos para cálculos automáticos."
    >
      <section id="curso" className="panel-card filter-panel">
        <div className="section-heading">
          <span className="eyebrow">Facultad → Programa → Curso → Estudiante</span>
          <h2>Contexto académico</h2>
        </div>
        <div className="filters-grid">
          <label>
            Buscar estudiante por ID
            <input
              type="search"
              value={searchId}
              onChange={(event) => setSearchId(event.target.value)}
              placeholder="Ej. 202410045"
            />
          </label>
          <label>
            Facultad
            <select value={selection.faculty} onChange={(event) => handleFacultyChange(event.target.value)}>
              {academicStructure.map((faculty) => (
                <option key={faculty.faculty}>{faculty.faculty}</option>
              ))}
            </select>
          </label>
          <label>
            Programa
            <select value={selection.program} onChange={(event) => handleProgramChange(event.target.value)}>
              {availablePrograms.map((program) => (
                <option key={program.name}>{program.name}</option>
              ))}
            </select>
          </label>
          <label>
            Curso
            <select
              value={selection.course}
              onChange={(event) => setSelection((current) => ({ ...current, course: event.target.value }))}
            >
              {availableCourses.map((course) => (
                <option key={course}>{course}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="metrics-grid compact-metrics">
        <MetricCard label="Estudiantes visibles" value={filteredStudents.length} detail="Según filtros activos" tone="blue" />
        <MetricCard label="Riesgo alto" value={highRiskStudents.length} detail="Alertas tempranas" tone="red" />
        <MetricCard label="Curso seleccionado" value={selection.course} detail={selection.program} tone="green" />
      </section>

      <section className="content-grid two-columns">
        <article className="panel-card wide">
          <div className="section-heading">
            <span className="eyebrow">Estudiantes del curso</span>
            <h2>Riesgo y estado preventivo</h2>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Riesgo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td><RiskBadge risk={student.risk} /></td>
                    <td>{student.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article id="alertas-tempranas" className="panel-card alerts-list">
          <div className="section-heading">
            <span className="eyebrow">Alertas tempranas</span>
            <h2>Estudiantes con mayor riesgo</h2>
          </div>
          {highRiskStudents.map((student) => (
            <div className="critical-student" key={student.id}>
              <strong>{student.name}</strong>
              <RiskBadge risk={student.risk} />
              <p>Motivos:</p>
              <ul>
                {student.absences > 8 && <li>baja asistencia</li>}
                {student.repeatedSubjects > 0 && <li>repetición de materias</li>}
                {student.academicDrop && <li>descenso académico</li>}
              </ul>
            </div>
          ))}
        </article>
      </section>

      <section id="actualización" className="panel-card update-panel">
        <div className="section-heading">
          <span className="eyebrow">Actualización académica</span>
          <h2>Registrar notas y faltas</h2>
          <p>El sistema calcula automáticamente promedio académico y asistencia; no se ingresa porcentaje manual.</p>
        </div>
        <div className="filters-grid">
          <label>
            Notas separadas por coma
            <input
              value={academicUpdate.grades}
              onChange={(event) => setAcademicUpdate({ ...academicUpdate, grades: event.target.value })}
              placeholder="3.5, 4.0, 2.9"
            />
          </label>
          <label>
            Total de clases
            <input
              type="number"
              min="0"
              value={academicUpdate.totalClasses}
              onChange={(event) => setAcademicUpdate({ ...academicUpdate, totalClasses: event.target.value })}
            />
          </label>
          <label>
            Faltas
            <input
              type="number"
              min="0"
              value={academicUpdate.absences}
              onChange={(event) => setAcademicUpdate({ ...academicUpdate, absences: event.target.value })}
            />
          </label>
        </div>
        <div className="calculation-preview">
          <MetricCard label="Promedio calculado" value={previewAverage.toFixed(2)} detail="A partir de notas registradas" tone="blue" />
          <MetricCard label="Asistencia calculada" value={`${previewAttendance}%`} detail="((total - faltas) / total) * 100" tone="green" />
        </div>
      </section>
    </DashboardShell>
  );
}

export default TeacherDashboard;
