from flask import Blueprint,render_template,request,jsonify
from flask_login import current_user,login_required

from . import db
views=Blueprint('views', __name__)
@views.route('/')
def index():
    return render_template('index.html',user=current_user)
@views.route('/Connect_Bank', methods=['GET'])
def connect_bank():

    return render_template('Connect_Bank.html', user=current_user)


@views.route('/My_Finances', methods=['GET', 'POST'])
def My_Finances():
    if request.method == 'POST':
        action_type = request.form.get('actionType')
        print("The action type is",action_type)
        if action_type == 'transaction':
            print("The action type is transaction")
            store_name = request.form.get('store_name')
            category = request.form.get('category')
            amount = request.form.get('amount')
            
            from .models import Transaction
            new_transaction = Transaction(
                store_name=store_name,
                category=category,
                amount=float(amount),
                user_id=current_user.id
            )
            db.session.add(new_transaction)
            db.session.commit()
            response_data = {
                'id': new_transaction.id,
                'store_name': new_transaction.store_name,
                'category': new_transaction.category,
                'amount': new_transaction.amount,
                'date': new_transaction.date.strftime('%Y-%m-%d'),  # Formatting the datection.date
            }
            current_user.balance -= new_transaction.amount
            db.session.commit()
            print(current_user.balance)
            return jsonify(response_data)

        elif action_type == 'balance':
            print("The action type is transaction")
            balance = request.form.get('balance')
            current_user.balance = balance
            db.session.commit()
            return jsonify({'balance': balance})
        
    return render_template('My_Finances.html', user=current_user)
@views.route('/About')
def About():
    return render_template('About.html',user=current_user)
@views.route('/get_balance', methods=['GET'])
def get_balance():
    if current_user.is_authenticated:
        return jsonify({'current_balance': current_user.balance})
    return jsonify({'error': 'User not authenticated'}), 401

@views.route('/delete-transaction/<int:target_id>', methods=['DELETE'])
@login_required
def delete_transaction(target_id):
    try:
        from .models import Transaction
        # Fetch the target transaction for the current user
        target_transaction = Transaction.query.filter_by(user_id=current_user.id, id=target_id).first()

        if not target_transaction:
            return jsonify({'error': 'No transaction found'}), 404

        # Revert the balance
        current_user.balance += target_transaction.amount

        # Delete the transaction
        db.session.delete(target_transaction)
        db.session.commit()

        # Return the updated balance
        return jsonify({'balance': current_user.balance}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500