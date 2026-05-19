from flask import Blueprint, jsonify, request
from services.auth_service import login_student, login_teacher

auth_bp = Blueprint('auth', __name__)


@auth_bp.post('/auth/login')
def login():
    payload = request.get_json(silent=True) or {}
    role = payload.get('role')
    username = str(payload.get('username', '')).strip()
    password = str(payload.get('password', '')).strip()

    if not role or not username or not password:
        return jsonify({'error': 'Credenciales incompletas'}), 400

    if role == 'student':
        user = login_student(username, password)
        if not user:
            return jsonify({'error': 'ID institucional o contraseña inválidos.'}), 401
        return jsonify({'user': user}), 200

    if role == 'teacher':
        teacher_login = login_teacher(username.lower(), password)
        if isinstance(teacher_login, dict) and teacher_login.get('error'):
            return jsonify({'error': teacher_login['error']}), 400
        if not teacher_login:
            return jsonify({'error': 'Correo institucional o contraseña inválidos.'}), 401
        return jsonify({'user': teacher_login}), 200

    return jsonify({'error': 'Rol no soportado'}), 400
