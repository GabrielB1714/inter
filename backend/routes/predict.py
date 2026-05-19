from flask import Blueprint, jsonify, request

predict_bp = Blueprint('predict', __name__)


@predict_bp.post('/predict')
def predict():
    payload = request.get_json(silent=True) or {}

    required_fields = [
        'academic_history',
        'attendance',
        'failed_subjects',
        'repeated_subjects',
    ]
    missing_fields = [field for field in required_fields if field not in payload]

    if missing_fields:
        return jsonify({
            'error': 'Faltan campos requeridos',
            'missing_fields': missing_fields,
        }), 400

    return jsonify({
        'risk_percentage': 75,
        'risk_level': 'Alto',
    }), 200
