import os
import joblib
import numpy as np
from flask import Blueprint, jsonify, request

predict_bp = Blueprint('predict', __name__)

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'model.pkl')


def history_to_semester_averages(academic_history):
    if not isinstance(academic_history, list) or len(academic_history) == 0:
        return [0.0, 0.0, 0.0]

    averages = [float(item.get('average', 0.0)) for item in academic_history if isinstance(item, dict)]
    averages = averages[-3:]

    if len(averages) == 1:
        averages = [averages[0], averages[0], averages[0]]
    elif len(averages) == 2:
        trend = averages[1] - averages[0]
        averages = [averages[0], averages[1], max(0.0, min(5.0, averages[1] + trend))]

    while len(averages) < 3:
        averages.insert(0, averages[0] if averages else 0.0)

    return [round(value, 2) for value in averages]


def risk_level_from_percentage(risk_percentage):
    if risk_percentage <= 29:
        return 'Bajo'
    if risk_percentage <= 69:
        return 'Medio'
    return 'Alto'


@predict_bp.post('/predict')
def predict():
    payload = request.get_json(silent=True) or {}

    required_fields = ['academic_history', 'attendance', 'failed_subjects', 'repeated_subjects']
    missing_fields = [field for field in required_fields if field not in payload]
    if missing_fields:
        return jsonify({'error': 'Faltan campos requeridos', 'missing_fields': missing_fields}), 400

    if not os.path.exists(MODEL_PATH):
        return jsonify({'error': 'Modelo no entrenado. Ejecuta backend/model/train_model.py'}), 500

    artifact = joblib.load(MODEL_PATH)
    model = artifact['model']

    sem1, sem2, sem3 = history_to_semester_averages(payload.get('academic_history', []))

    feature_row = np.array([
        [
            sem1,
            sem2,
            sem3,
            float(payload.get('attendance', 0)),
            float(payload.get('failed_subjects', 0)),
            float(payload.get('repeated_subjects', 0)),
        ]
    ])

    predicted_class = int(model.predict(feature_row)[0])
    probability = float(model.predict_proba(feature_row)[0][1])
    risk_percentage = int(round(probability * 100))

    if predicted_class == 0 and risk_percentage > 69:
        risk_percentage = 69

    return jsonify({'risk_percentage': risk_percentage, 'risk_level': risk_level_from_percentage(risk_percentage)}), 200
