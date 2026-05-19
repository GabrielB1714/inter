from db.supabase_client import supabase


def get_student_profile(student_id: str):
    student_result = supabase.table('students').select('*').eq('id', student_id).limit(1).execute()
    history_result = (
        supabase.table('academic_history')
        .select('semester, average, attendance, failed_subjects, repeated_subjects, total_classes, absences')
        .eq('student_id', student_id)
        .order('semester')
        .execute()
    )

    if not student_result.data:
        return None

    student = student_result.data[0]
    history = history_result.data or []
    latest = history[-1] if history else {}

    return {
        'id': student['id'],
        'name': student['full_name'],
        'faculty': student['faculty'],
        'program': student['program'],
        'course': student['current_course'],
        'semesterHistory': history,
        'generalAverage': latest.get('average', 0),
        'attendance': latest.get('attendance', 0),
        'failedSubjects': latest.get('failed_subjects', 0),
        'repeatedSubjects': latest.get('repeated_subjects', 0),
        'totalClasses': latest.get('total_classes', 0),
        'absences': latest.get('absences', 0),
    }
