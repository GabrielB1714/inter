import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from sklearn.model_selection import train_test_split

BASE_DIR = os.path.dirname(__file__)
DATASET_PATH = os.path.join(BASE_DIR, 'dataset.csv')
MODEL_PATH = os.path.join(BASE_DIR, 'model.pkl')


def generate_synthetic_dataset(path: str, n_samples: int = 1000, seed: int = 42):
    rng = np.random.default_rng(seed)
    rows = []

    for i in range(1, n_samples + 1):
        profile = rng.choice(['low', 'medium', 'high'], p=[0.45, 0.3, 0.25])

        if profile == 'low':
            sem1 = rng.uniform(3.6, 5.0)
            sem2 = np.clip(sem1 + rng.uniform(-0.25, 0.25), 0, 5)
            sem3 = np.clip(sem2 + rng.uniform(-0.25, 0.25), 0, 5)
            attendance = rng.uniform(82, 100)
            failed_subjects = int(rng.integers(0, 2))
            repeated_subjects = int(rng.integers(0, 2))
            dropout = int(rng.choice([0, 1], p=[0.95, 0.05]))
        elif profile == 'medium':
            sem1 = rng.uniform(2.8, 4.2)
            sem2 = np.clip(sem1 + rng.uniform(-0.5, 0.2), 0, 5)
            sem3 = np.clip(sem2 + rng.uniform(-0.5, 0.2), 0, 5)
            attendance = rng.uniform(65, 90)
            failed_subjects = int(rng.integers(1, 4))
            repeated_subjects = int(rng.integers(0, 3))
            dropout = int(rng.choice([0, 1], p=[0.65, 0.35]))
        else:
            sem1 = rng.uniform(1.8, 3.5)
            sem2 = np.clip(sem1 - rng.uniform(0.1, 0.9), 0, 5)
            sem3 = np.clip(sem2 - rng.uniform(0.1, 1.0), 0, 5)
            attendance = rng.uniform(40, 78)
            failed_subjects = int(rng.integers(2, 7))
            repeated_subjects = int(rng.integers(1, 5))
            dropout = int(rng.choice([0, 1], p=[0.2, 0.8]))

        rows.append({
            'student_id': f'S{i:05d}',
            'average_sem1': round(float(sem1), 2),
            'average_sem2': round(float(sem2), 2),
            'average_sem3': round(float(sem3), 2),
            'attendance': round(float(attendance), 2),
            'failed_subjects': failed_subjects,
            'repeated_subjects': repeated_subjects,
            'dropout': dropout,
        })

    pd.DataFrame(rows).to_csv(path, index=False)


def train_model():
    if not os.path.exists(DATASET_PATH):
        generate_synthetic_dataset(DATASET_PATH)

    df = pd.read_csv(DATASET_PATH)
    features = ['average_sem1', 'average_sem2', 'average_sem3', 'attendance', 'failed_subjects', 'repeated_subjects']
    X = df[features]
    y = df['dropout']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    model = RandomForestClassifier(n_estimators=250, random_state=42, class_weight='balanced')
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    print('accuracy:', round(accuracy_score(y_test, y_pred), 4))
    print('precision:', round(precision_score(y_test, y_pred), 4))
    print('recall:', round(recall_score(y_test, y_pred), 4))
    print('f1-score:', round(f1_score(y_test, y_pred), 4))
    print('confusion matrix:\n', confusion_matrix(y_test, y_pred))

    artifact = {
        'model': model,
        'features': features,
    }
    joblib.dump(artifact, MODEL_PATH)
    print(f'Model saved at: {MODEL_PATH}')


if __name__ == '__main__':
    train_model()
