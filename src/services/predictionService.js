/* global fetch, AbortController */
const PREDICTION_API_URL = 'http://localhost:5000/predict';
const REQUEST_TIMEOUT_MS = 8000;

function buildPayload(studentProfile) {
  return {
    academic_history: studentProfile.semesterHistory.map((semester) => ({
      semester: semester.semester,
      average: semester.average,
      total_classes: semester.totalClasses,
      absences: semester.absences,
      failed: semester.failed,
    })),
    attendance: studentProfile.attendance,
    failed_subjects: studentProfile.failedSubjects,
    repeated_subjects: studentProfile.repeatedSubjects,
  };
}

export async function requestPrediction(studentProfile) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(PREDICTION_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(studentProfile)),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Prediction request failed: ${response.status}`);
    }

    const data = await response.json();
    const isValid =
      typeof data?.risk_percentage === 'number' &&
      typeof data?.risk_level === 'string';

    if (!isValid) {
      throw new Error('Invalid prediction response format');
    }

    return data;
  } catch (error) {
    throw new Error(error?.name === 'AbortError' ? 'timeout' : 'prediction_failed');
  } finally {
    clearTimeout(timeoutId);
  }
}
