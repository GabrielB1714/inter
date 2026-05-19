import { useMemo, useState } from 'react';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import MetricCard from '../shared/MetricCard.jsx';
import RiskBadge from '../shared/RiskBadge.jsx';
import { getTeacherByEmail, getFacultyStructure, getStudentsForTeacher, calculateAcademicPreview } from '../../services/teacherService.js';

function TeacherDashboard({ session, onLogout }) {
  const teacher = getTeacherByEmail(session.email);
  const [searchId, setSearchId] = useState('');
  const [academicUpdate, setAcademicUpdate] = useState({ grades: '3.2, 3.8, 4.1', totalClasses: 32, absences: 4 });
  const [updatesByStudent, setUpdatesByStudent] = useState({});

  const faculties = getFacultyStructure();
  const filteredStudents = useMemo(() => getStudentsForTeacher(teacher, searchId), [teacher, searchId]);
  const highRiskStudents = useMemo(() => filteredStudents.filter((student) => student.risk === 'Alto').slice(0, 3), [filteredStudents]);
  const preview = calculateAcademicPreview(academicUpdate.grades, academicUpdate.totalClasses, academicUpdate.absences);

  const registerTemporaryUpdate = (studentId) => {
    setUpdatesByStudent((current) => ({ ...current, [studentId]: { average: preview.average, attendance: preview.attendance } }));
  };

  if (!teacher) return <p>No se encontró la asignación docente.</p>;

  return (
    <DashboardShell role="Profesor" userName={teacher.name} onLogout={onLogout} items={['Curso', 'Alertas tempranas', 'Actualización']} title="Gestión preventiva por curso" subtitle="Visualiza únicamente estudiantes de tu área académica.">
      <section id="curso" className="panel-card filter-panel"><div className="section-heading"><span className="eyebrow">Facultad → Programa → Curso → Estudiante</span><h2>Contexto académico</h2></div><div className="filters-grid"><label>Buscar estudiante por ID<input type="search" value={searchId} onChange={(event) => setSearchId(event.target.value)} placeholder="Ej. 2024001" /></label><label>Facultad<input value={teacher.faculty} readOnly /></label><label>Programa<input value={teacher.program} readOnly /></label><label>Cursos asignados<input value={teacher.courses.join(', ')} readOnly /></label></div></section>
      <section className="metrics-grid compact-metrics"><MetricCard label="Estudiantes visibles" value={filteredStudents.length} detail="Según área docente" tone="blue" /><MetricCard label="Riesgo alto" value={highRiskStudents.length} detail="Alertas tempranas" tone="red" /><MetricCard label="Facultades mock" value={faculties.length} detail="Base de datos simulada" tone="green" /></section>
      <section className="content-grid two-columns"><article className="panel-card wide"><div className="section-heading"><span className="eyebrow">Estudiantes del curso</span><h2>Riesgo y estado preventivo</h2></div><div className="table-wrapper"><table><thead><tr><th>ID</th><th>Nombre</th><th>Riesgo</th><th>Estado</th><th>Actualización mock</th></tr></thead><tbody>{filteredStudents.map((student) => (<tr key={student.id}><td>{student.id}</td><td>{student.name}</td><td><RiskBadge risk={student.risk} /></td><td>{student.status}</td><td>{updatesByStudent[student.id] ? `Prom: ${updatesByStudent[student.id].average.toFixed(2)} | Asis: ${updatesByStudent[student.id].attendance}%` : 'Sin cambios'}</td></tr>))}</tbody></table></div></article>
      <article id="alertas-tempranas" className="panel-card alerts-list"><div className="section-heading"><span className="eyebrow">Alertas tempranas</span><h2>Estudiantes con mayor riesgo</h2></div>{highRiskStudents.map((student) => (<div className="critical-student" key={student.id}><strong>{student.name}</strong><RiskBadge risk={student.risk} /><p>Motivos:</p><ul>{student.attendance < 80 && <li>baja asistencia</li>}{student.repeatedSubjects > 0 && <li>repetición de materias</li>}{student.academicDrop && <li>descenso académico</li>}</ul></div>))}</article></section>
      <section id="actualización" className="panel-card update-panel"><div className="section-heading"><span className="eyebrow">Actualización académica</span><h2>Registrar notas y faltas</h2></div><div className="filters-grid"><label>Notas separadas por coma<input value={academicUpdate.grades} onChange={(event) => setAcademicUpdate({ ...academicUpdate, grades: event.target.value })} /></label><label>Total de clases<input type="number" min="0" value={academicUpdate.totalClasses} onChange={(event) => setAcademicUpdate({ ...academicUpdate, totalClasses: event.target.value })} /></label><label>Faltas<input type="number" min="0" value={academicUpdate.absences} onChange={(event) => setAcademicUpdate({ ...academicUpdate, absences: event.target.value })} /></label></div><div className="calculation-preview"><MetricCard label="Promedio calculado" value={preview.average.toFixed(2)} detail="A partir de notas registradas" tone="blue" /><MetricCard label="Asistencia calculada" value={`${preview.attendance}%`} detail="((total - faltas) / total) * 100" tone="green" /></div><button className="primary-button" type="button" onClick={() => filteredStudents[0] && registerTemporaryUpdate(filteredStudents[0].id)}>Aplicar actualización mock al primer estudiante filtrado</button></section>
    </DashboardShell>
  );
}

export default TeacherDashboard;
