from flask import Flask
from flask_cors import CORS

from routes.predict import predict_bp
from routes.auth import auth_bp
from routes.academic import academic_bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(predict_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(academic_bp)

    @app.get('/health')
    def health_check():
        return {'status': 'ok', 'service': 'interrisk-backend'}, 200

    return app


app = create_app()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
