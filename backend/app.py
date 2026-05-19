from flask import Flask
from flask_cors import CORS

from routes.predict import predict_bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(predict_bp)

    @app.get('/health')
    def health_check():
        return {'status': 'ok', 'service': 'interrisk-backend'}, 200

    return app


app = create_app()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
