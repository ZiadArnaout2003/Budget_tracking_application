from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager

# Create the SQLAlchemy object
db = SQLAlchemy()

DB_NAME = "database.db"  # Define the database name

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'mysecretkey'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    
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
    
    return app






def create_database(app):
    with app.app_context():  # Use the app context here
        if not path.exists('website/' + DB_NAME):
            db.create_all()  # This should work without passing 'app'
            print('Created database')


