from flask import Blueprint,render_template,request,flash,redirect,url_for
from werkzeug.security import generate_password_hash,check_password_hash
from . import db
from flask_login import login_user,login_required,logout_user,current_user

auth=Blueprint('auth',__name__)

@auth.route('/Login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        from .models import User
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            flash("Logged in successfully", category='success')
            login_user(user, remember=True)
            return redirect(url_for('views.index'))  # Assuming you have a view called 'index'
        else:
            flash("Invalid email or password", category='error')
    return render_template("Login.html",user=current_user)


@auth.route('/Signup',methods=['GET','POST'])
def signup():
    if request.method=='POST':
        first_name=request.form.get('first_name')
        last_name=request.form.get('last_name')
        email=request.form.get('email')
        password=request.form.get('password')
        confirm_password=request.form.get('confirm_password')
        from .models import User
        user=User.query.filter_by(email=email).first()
        if user:
            flash('Email already exists',category='error')
        elif len(email)<4:
            flash('Email must be greater than 3 characters',category='error')
        elif len(first_name)<2:
            flash('First name must be greater than 1 character',category='error')
        elif len(last_name)<2:
            flash('Last name must be greater than 1 character',category='error')
        elif password!=confirm_password:
            flash('Passwords do not match',category='error')
        else:  
            from .models import User
            hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
            new_user=User(first_name=first_name,last_name=last_name,email=email,password=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            flash('Account created',category='success')
            login_user(new_user, remember=True)
            return redirect(url_for('views.index'))
    return render_template("Signup.html",user=current_user)
@auth.route('/Logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))