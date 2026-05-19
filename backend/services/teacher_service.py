from db.supabase_client import supabase


def get_teacher_students(teacher_email: str, search_id: str = ''):
    teacher_result = supabase.table('teachers').select('*').eq('email', teacher_email).limit(1).execute()
    if not teacher_result.data:
        return []

    teacher = teacher_result.data[0]
    query = (
        supabase.table('students')
        .select('id, full_name, faculty, program, current_course')
        .eq('faculty', teacher['faculty'])
        .eq('program', teacher['program'])
    )
    if search_id:
        query = query.ilike('id', f'%{search_id}%')

    students = query.execute().data or []
    return [
        {
            'id': item['id'],
            'name': item['full_name'],
            'faculty': item['faculty'],
            'program': item['program'],
            'course': item['current_course'],
        }
        for item in students
    ]


def update_student_academic_record(student_id: str, semester: str, grades: list[float], total_classes: int, absences: int, risk_percentage: float, risk_level: str):
    average = round(sum(grades) / len(grades), 2) if grades else 0
    attendance = round(((max(total_classes - absences, 0) / total_classes) * 100), 2) if total_classes > 0 else 0
    failed_subjects = sum(1 for g in grades if g < 3.0)

    payload = {
        'student_id': student_id,
        'semester': semester,
        'average': average,
        'attendance': attendance,
        'failed_subjects': failed_subjects,
        'repeated_subjects': failed_subjects,
        'total_classes': total_classes,
        'absences': absences,
        'risk_percentage': risk_percentage,
        'risk_level': risk_level,
    }

    return supabase.table('academic_history').upsert(payload, on_conflict='student_id,semester').execute().data
