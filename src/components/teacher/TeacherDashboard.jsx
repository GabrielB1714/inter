import { useEffect, useMemo, useState } from 'react';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import MetricCard from '../shared/MetricCard.jsx';
import { calculateAcademicPreview, getStudentsForTeacher, updateAcademicRecord } from '../../services/teacherService.js';
import { requestPrediction } from '../../services/predictionService.js';

function TeacherDashboard({ session, onLogout }) {
  const [searchId, setSearchId] = useState('');
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentsError, setStudentsError] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [academicUpdate, setAcademicUpdate] = useState({ semester: '2024-2', grades: '3.2, 3.8, 4.1', totalClasses: 32, absences: 4 });

  const preview = calculateAcademicPreview(academicUpdate.grades, academicUpdate.totalClasses, academicUpdate.absences);

  const loadStudents = async () => {
    setLoadingStudents(true);
    const result = await getStudentsForTeacher(session.email, searchId);
    setLoadingStudents(false);

    if (!result.ok) {
      setStudentsError(result.message);
      setStudents([]);
      return;
    }

    setStudentsError('');
    setStudents(result.data);
  };

  useEffect(() => {
    loadStudents();
  }, [session.email, searchId]);

  const highRiskStudents = useMemo(() => students.slice(0, 3), [students]);

  const handleAcademicUpdate = async () => {
    setUpdateMessage('Actualizando registro académico...');

    if (!students.length) {
      setUpdateMessage('No hay estudiantes para actualizar.');
      return;
    }

    const targetStudent = students[0];
    const predictionInput = {
      semesterHistory: [{ semester: academicUpdate.semester, average: preview.average, totalClasses: Number(academicUpdate.totalClasses), absences: Number(academicUpdate.absences), failed: preview.grades.filter((g) => g < 3).length }],
      attendance: preview.attendance,
      failedSubjects: preview.grades.filter((g) => g < 3).length,
      repeatedSubjects: preview.grades.filter((g) => g < 3).length,
    };

    let risk = { risk_percentage: 50, risk_level: 'Medio' };
    try {
      risk = await requestPrediction(predictionInput);
    } catch {
      // keep fallback
    }

    const updateResult = await updateAcademicRecord({
      student_id: targetStudent.id,
      semester: academicUpdate.semester,
      grades: preview.grades,
      total_classes: Number(academicUpdate.totalClasses),
      absences: Number(academicUpdate.absences),
      risk_percentage: risk.risk_percentage,
      risk_level: risk.risk_level,
    });

    if (!updateResult.ok) {
      setUpdateMessage(updateResult.message);
      return;
    }

    setUpdateMessage('Registro académico actualizado correctamente.');
    await loadStudents();
  };

  return (
    <DashboardShell role="Profesor" userName={session.name} onLogout={onLogout} items={['Curso', 'Alertas tempranas', 'Actualización']} title="Gestión preventiva por curso" subtitle="Visualiza únicamente estudiantes de tu área académica.">
      <section id="curso" className="panel-card filter-panel"><div className="section-heading"><span className="eyebrow">Área docente</span><h2>Contexto académico</h2></div><div className="filters-grid"><label>Buscar estudiante por ID<input type="search" value={searchId} onChange={(event) => setSearchId(event.target.value)} placeholder="Ej. 2024001" /></label><label>Correo institucional<input value={session.email || ''} readOnly /></label></div></section>
      {loadingStudents && <p>Cargando estudiantes...</p>}
      {studentsError && <p className="form-alert">{studentsError}</p>}
      {!loadingStudents && !studentsError && <section className="metrics-grid compact-metrics"><MetricCard label="Estudiantes visibles" value={students.length} detail="Desde Supabase" tone="blue" /><MetricCard label="Alertas tempranas" value={highRiskStudents.length} detail="Primeros estudiantes cargados" tone="red" /><MetricCard label="Curso seleccionado" value={students[0]?.course || 'N/A'} detail={students[0]?.program || 'Sin datos'} tone="green" /></section>}
      {!loadingStudents && !studentsError && <section className="content-grid two-columns"><article className="panel-card wide"><div className="section-heading"><span className="eyebrow">Estudiantes del curso</span><h2>Listado real desde backend</h2></div><div className="table-wrapper"><table><thead><tr><th>ID</th><th>Nombre</th><th>Facultad</th><th>Programa</th><th>Curso</th></tr></thead><tbody>{students.map((student) => (<tr key={student.id}><td>{student.id}</td><td>{student.name}</td><td>{student.faculty}</td><td>{student.program}</td><td>{student.course}</td></tr>))}</tbody></table></div></article>
      <article id="alertas-tempranas" className="panel-card alerts-list"><div className="section-heading"><span className="eyebrow">Alertas tempranas</span><h2>Seguimiento prioritario</h2></div>{highRiskStudents.map((student) => (<div className="critical-student" key={student.id}><strong>{student.name}</strong><p>ID: {student.id}</p><p>Programa: {student.program}</p></div>))}</article></section>}
      <section id="actualización" className="panel-card update-panel"><div className="section-heading"><span className="eyebrow">Actualización académica</span><h2>Registrar notas y faltas</h2></div><div className="filters-grid"><label>Semestre<input value={academicUpdate.semester} onChange={(event) => setAcademicUpdate({ ...academicUpdate, semester: event.target.value })} placeholder="2024-2" /></label><label>Notas separadas por coma<input value={academicUpdate.grades} onChange={(event) => setAcademicUpdate({ ...academicUpdate, grades: event.target.value })} /></label><label>Total de clases<input type="number" min="0" value={academicUpdate.totalClasses} onChange={(event) => setAcademicUpdate({ ...academicUpdate, totalClasses: event.target.value })} /></label><label>Faltas<input type="number" min="0" value={academicUpdate.absences} onChange={(event) => setAcademicUpdate({ ...academicUpdate, absences: event.target.value })} /></label></div><div className="calculation-preview"><MetricCard label="Promedio calculado" value={preview.average.toFixed(2)} detail="A partir de notas registradas" tone="blue" /><MetricCard label="Asistencia calculada" value={`${preview.attendance}%`} detail="((total - faltas) / total) * 100" tone="green" /></div><button className="primary-button" type="button" onClick={handleAcademicUpdate}>Actualizar en backend</button>{updateMessage && <p>{updateMessage}</p>}</section>
    </DashboardShell>
  );
}

export default TeacherDashboard;
