from db.supabase_client import supabase


def login_student(student_id: str, password: str):
    result = (
        supabase.table('students')
        .select('id, full_name')
        .eq('id', student_id)
        .eq('password', password)
        .limit(1)
        .execute()
    )
    if not result.data:
        return None
    student = result.data[0]
    return {'id': student['id'], 'name': student['full_name'], 'role': 'student'}


def login_teacher(email: str, password: str):
    if not email.endswith('@universidad.edu.co'):
        return {'error': 'Debe ingresar un correo institucional válido'}

    result = (
        supabase.table('teachers')
        .select('id, full_name, email')
        .eq('email', email.lower())
        .eq('password', password)
        .limit(1)
        .execute()
    )
    if not result.data:
        return None

    teacher = result.data[0]
    return {
        'id': teacher['id'],
        'name': teacher['full_name'],
        'email': teacher['email'],
        'role': 'teacher',
    }
