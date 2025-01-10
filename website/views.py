from flask import Blueprint,render_template,request
from flask_login import current_user

from . import db
views=Blueprint('views', __name__)
@views.route('/')
def index():
    return render_template('index.html',user=current_user)
@views.route('/Connect_Bank', methods=['GET', 'POST'])
def connect_bank():
    from .models import Transaction  # Import the model here

    new_transaction = None  # Default value to avoid errors

    if request.method == 'POST':
        store_name = request.form.get('store_name')
        category = request.form.get('category')
        amount = request.form.get('amount')

        # Add new transaction
        new_transaction = Transaction(
            store_name=store_name,
            category=category,
            amount=amount,
            user_id=current_user.id
        )
        db.session.add(new_transaction)
        db.session.commit()

    # Pass transactions, not just new_transaction, to render multiple rows
    transactions = Transaction.query.filter_by(user_id=current_user.id).all()
    return render_template('Connect_Bank.html', user=current_user,transactions=transactions,new_transaction=new_transaction)


@views.route('/My_Finances')
def my_finances():
    return render_template('My_Finances.html',user=current_user)
@views.route('/About')
def About():
    return render_template('About.html',user=current_user)

