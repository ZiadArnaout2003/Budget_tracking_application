from flask import Flask,session
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager
from datetime import timedelta
import os


# Create the SQLAlchemy object
db = SQLAlchemy()

DB_NAME = "database.db"  # Define the database name

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'mysecretkey'
    uri = os.environ.get("DATABASE_URL")
    if uri and uri.startswith("postgres://"):
     uri = uri.replace("postgres://", "postgresql://", 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = uri 

    # Initialize the app with db
    db.init_app(app)
    # Register blueprints
    from .views import views
    from .auth import auth
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')
    from .views import Bar_chart_data
    
    # Import models here
    from .models import User,Transaction
   
    create_database(app)
    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))
    app.permanent_session_lifetime=timedelta(minutes=15)
    @app.before_request
    def make_session_permanent():
        session.permanent = True
    return app






def create_database(app):
    with app.app_context():  # Use the app context here
            db.create_all()  # This should work without passing 'app'
            print('Created database')


