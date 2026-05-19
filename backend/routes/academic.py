from flask import Blueprint, jsonify, request
from services.student_service import get_student_profile
from services.teacher_service import get_teacher_students, update_student_academic_record

academic_bp = Blueprint('academic', __name__)


@academic_bp.get('/students/<student_id>')
def student_profile(student_id):
    profile = get_student_profile(student_id)
    if not profile:
        return jsonify({'error': 'Estudiante no encontrado'}), 404
    return jsonify(profile), 200


@academic_bp.get('/teachers/students')
def teacher_students():
    teacher_email = request.args.get('teacher_email', '').strip().lower()
    search_id = request.args.get('search_id', '').strip()
    if not teacher_email:
        return jsonify({'error': 'teacher_email es requerido'}), 400

    students = get_teacher_students(teacher_email, search_id)
    return jsonify({'students': students}), 200


@academic_bp.post('/teachers/update-academic')
def update_academic():
    payload = request.get_json(silent=True) or {}
    required = ['student_id', 'semester', 'grades', 'total_classes', 'absences', 'risk_percentage', 'risk_level']
    missing = [item for item in required if item not in payload]
    if missing:
        return jsonify({'error': 'Faltan campos requeridos', 'missing_fields': missing}), 400

    data = update_student_academic_record(
        student_id=payload['student_id'],
        semester=payload['semester'],
        grades=payload['grades'],
        total_classes=int(payload['total_classes']),
        absences=int(payload['absences']),
        risk_percentage=float(payload['risk_percentage']),
        risk_level=str(payload['risk_level']),
    )
    return jsonify({'updated': data}), 200
