from flask import Blueprint,render_template

auth=Blueprint('auth',__name__)

@auth.route('/Login')
def login():
    return render_template("Login.html")

@auth.route('/Signup')
def signup():
    return render_template("Signup.html")