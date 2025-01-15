from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func  # Add this import
from datetime import datetime
import pytz

tz = pytz.timezone('America/Montreal')
datetime.now(tz)
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Add primary key
    store_name = db.Column(db.String(100))
    category = db.Column(db.String(100))
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime(timezone=True),default=datetime.now(pytz.timezone('US/Eastern'))) # func.now() requires import of func
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    first_name = db.Column(db.String(150))
    last_name = db.Column(db.String(150))
    balance=db.Column(db.Float, default=0.0)
    transactions = db.relationship('Transaction')  # 'Transaction' is the correct model name
