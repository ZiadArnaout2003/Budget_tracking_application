from flask import Blueprint,render_template,request,jsonify
from flask_login import current_user,login_required
from sqlalchemy.sql import func  # Add this import
from sqlalchemy.sql import func  # Add this import

from . import db
views=Blueprint('views', __name__)
@views.route('/')
def index():
    return render_template('index.html',user=current_user)
@views.route('/Connect_Bank', methods=['GET'])
def connect_bank():
    return render_template('Connect_Bank.html', user=current_user)


@views.route('/My_Finances', methods=['GET', 'POST'])
@login_required
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
                'time': new_transaction.date.strftime('%H:%M:%S')
            }
            current_user.balance -= new_transaction.amount
            db.session.commit()
            print(current_user.balance)
            return jsonify(response_data)

        elif action_type == 'balance':
            print("The action type is transaction")
            balance = request.form.get('balance')
            current_user.balance = balance
            from .models import Transaction
            Transaction.query.filter_by(user_id=current_user.id).delete()
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

@views.route('/bar-chart-data', methods=['GET'])
@login_required    
def Bar_chart_data():
    from .models import Transaction
    try:
        # Query the transactions table to count occurrences of store names
        store_counts = db.session.query(
            Transaction.store_name,          # Column to group by
            func.sum(Transaction.amount)
        ).group_by(Transaction.store_name).all()

   

        # Initialize lists for store names and counts
        STORE_NAME = []
        AMOUNT_SPENT = []

        # Populate the lists from query results
        for store,total_amount in store_counts:
            STORE_NAME.append(store)
            AMOUNT_SPENT.append(total_amount)
        # Prepare the data dictionary
        response_data = {"store_name": STORE_NAME, "amount": AMOUNT_SPENT}
        return jsonify(response_data)

    except Exception as e:
        # Print and return error details for debugging
        print("Error in /bar-chart-data route:", str(e))
        return jsonify({"error": "Internal Server Error"}), 500
    
@views.route('/pie-chart-data', methods=['GET'])
@login_required    
def Pie_chart_data():
    from .models import Transaction
    try:
        # Query the transactions table to count occurrences of store names
        category_percentage = db.session.query(
            Transaction.category,          # Column to group by
            func.sum(Transaction.amount)/current_user.balance*100
        ).group_by(Transaction.category).all()

     
        # Initialize lists for store names and counts
        CATEGORY = []
        PORTION = []
       
        # Populate the lists from query results
        for category,portion in category_percentage:
            CATEGORY.append(category)
            PORTION.append(portion)
        # Prepare the data dictionary
        response_data = {"category": CATEGORY, "portion": PORTION}
        return jsonify(response_data)

    except Exception as e:
        # Print and return error details for debugging
        print("Error in /bar-chart-data route:", str(e))
        return jsonify({"error": "Internal Server Error"}), 500
@views.route('/line-chart-data', methods=['GET'])
@login_required    
def Line_chart_data():  # money over days and month 
    try:
        from .models import Transaction
        # Query the transactions table to get date and sum of money for each day
        money_over_days = db.session.query(
            func.date(Transaction.date),          # Column to group by
            func.sum(Transaction.amount)
        ).group_by(func.date(Transaction.date)).all()

        # Initialize lists for storing date and money values
        DATE = []
        MONEY = []
        
        # Check if data exists in the database
        if not money_over_days:
            return jsonify({"error": "No transaction data available"}), 404
        
        # Populate the lists from query results
        for date, money in money_over_days:
            # Ensure date is in a suitable format (e.g., YYYY-MM-DD)
            DATE.append(date)  # Format date as string
            MONEY.append(money)

        # Prepare the data dictionary to send to the front-end
        response_data = {"date": DATE, "money": MONEY}
        return jsonify(response_data)

    except Exception as e:
        # Log the error for debugging and return a response
        print("Error in /line-chart-data route:", str(e))
        return jsonify({"error": "Internal Server Error"}), 500
    