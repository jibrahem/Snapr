from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User



def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')

def minumum_age(form, field):
    age = field.data
    if age < 13:
        raise ValidationError('You must be 13 to use this site.')

class SignUpForm(FlaskForm):
    username = StringField(
        'username', validators=[DataRequired(), username_exists, Length(max=40)])
    email = StringField('email', validators=[DataRequired(), user_exists,Length(max=50)])
    password = StringField('password', validators=[DataRequired(), Length(max=40)])
    age = IntegerField('age', validators=[DataRequired(), minumum_age])
    first_name = StringField('first_name', validators=[DataRequired(),Length(max=50)])
    last_name = StringField('last_name', validators=[DataRequired(),Length(max=50)])
    submit = SubmitField('submit')
