from flask import Blueprint,render_template
views=Blueprint('views', __name__)
@views.route('/')
def index():
    return render_template('index.html')
@views.route('/Connect_Bank')
def connect_bank():
    return render_template('Connect_Bank.html')

@views.route('/My_Finances')
def my_finances():
    return render_template('My_Finances.html')
@views.route('/About')
def About():
    return render_template('About.html')

