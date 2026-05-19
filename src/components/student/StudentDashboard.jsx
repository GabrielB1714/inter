import DashboardShell from '../dashboard/DashboardShell.jsx';
import MetricCard from '../shared/MetricCard.jsx';
import { getStudentById } from '../../services/studentService.js';
import { calculateAttendance, getAcademicTrend } from '../../utils/academicCalculations.js';

function StudentDashboard({ session, onLogout }) {
  const studentProfile = getStudentById(session.id);

  if (!studentProfile) {
    return <p>No se encontró información académica para este estudiante.</p>;
  }

  const attendance = calculateAttendance(studentProfile.totalClasses, studentProfile.absences);
  const trend = getAcademicTrend(studentProfile.semesterHistory);

  return (
    <DashboardShell role="Estudiante" userName={studentProfile.name} onLogout={onLogout} items={['Resumen', 'Historial', 'Alertas preventivas']} title="Panel de seguimiento académico" subtitle="Visualiza señales tempranas para tomar acciones preventivas sobre tu permanencia académica.">
      <section id="resumen" className="metrics-grid">
        <MetricCard label="Promedio general" value={studentProfile.generalAverage.toFixed(2)} detail="Escala 0.0 a 5.0" tone="blue" />
        <MetricCard label="Asistencia" value={`${attendance}%`} detail={`${studentProfile.absences} faltas registradas`} tone="green" />
        <MetricCard label="Materias perdidas" value={studentProfile.failedSubjects} detail="Último semestre" tone="orange" />
        <MetricCard label="Materias repetidas" value={studentProfile.repeatedSubjects} detail="Historial académico" tone="red" />
      </section>
      <section className="content-grid two-columns"><article id="historial" className="panel-card wide"><div className="section-heading"><span className="eyebrow">Historial académico</span><h2>Desempeño por semestre</h2></div><div className="table-wrapper"><table><thead><tr><th>Semestre</th><th>Promedio</th><th>Asistencia</th><th>Perdidas</th></tr></thead><tbody>{studentProfile.semesterHistory.map((semester) => (<tr key={semester.semester}><td>{semester.semester}</td><td>{semester.average.toFixed(2)}</td><td>{calculateAttendance(semester.totalClasses, semester.absences)}%</td><td>{semester.failed}</td></tr>))}</tbody></table></div></article>
      <article className={`panel-card trend-card ${trend.tone}`}><span className="eyebrow">Tendencia académica</span><h2>{trend.status}</h2><p>{trend.label}</p></article></section>
      <section id="alertas-preventivas" className="content-grid two-columns"><article className="panel-card"><div className="section-heading"><span className="eyebrow">Materias problemáticas</span><h2>Materias que podrían representar dificultad</h2></div><ul className="subject-list">{studentProfile.problematicSubjects.map((subject) => (<li key={subject}>{subject}</li>))}</ul></article>
      <article className="panel-card alert-card"><span className="alert-icon">⚠</span><div><span className="eyebrow">Alerta preventiva</span><h2>Se detectaron dificultades académicas recientes.</h2><p>Se recomienda reforzar:</p><ul>{studentProfile.problematicSubjects.slice(0, 2).map((subject) => (<li key={subject}>{subject}</li>))}</ul></div></article></section>
    </DashboardShell>
  );
}

export default StudentDashboard;
