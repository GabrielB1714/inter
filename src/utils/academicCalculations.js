export const calculateAverage = (grades = []) => {
  if (!grades.length) return 0;
  const total = grades.reduce((sum, grade) => sum + Number(grade || 0), 0);
  return Number((total / grades.length).toFixed(2));
};

export const calculateAttendance = (totalClasses = 0, absences = 0) => {
  if (!totalClasses || totalClasses <= 0) return 0;
  const attendedClasses = Math.max(totalClasses - absences, 0);
  return Number(((attendedClasses / totalClasses) * 100).toFixed(1));
};

export const getAcademicTrend = (history = []) => {
  if (history.length < 2) {
    return {
      status: 'estable',
      label: 'Aún no hay suficientes semestres para detectar tendencia.',
      tone: 'neutral',
    };
  }

  const recent = history.slice(-3).map((item) => item.average);
  const first = recent[0];
  const last = recent[recent.length - 1];
  const difference = Number((last - first).toFixed(2));

  if (difference <= -0.25) {
    return {
      status: 'empeora',
      label: 'Tu rendimiento ha disminuido en los últimos 2 semestres.',
      tone: 'danger',
    };
  }

  if (difference >= 0.25) {
    return {
      status: 'mejora',
      label: 'Tu rendimiento muestra una mejora académica reciente.',
      tone: 'success',
    };
  }

  return {
    status: 'estable',
    label: 'Tu rendimiento se mantiene estable; continúa con seguimiento preventivo.',
    tone: 'warning',
  };
};

export const getRiskClassName = (risk) => {
  const normalizedRisk = risk?.toLowerCase();
  if (normalizedRisk === 'alto') return 'risk-high';
  if (normalizedRisk === 'medio') return 'risk-medium';
  return 'risk-low';
};
