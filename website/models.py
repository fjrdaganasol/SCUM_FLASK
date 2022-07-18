from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func

class EventLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    uv = db.Column(db.String(100))
    air = db.Column(db.String(100))
    room = db.Column(db.String(100))
    time = db.Column(db.String(100))
    interval = db.Column(db.String(100))
    stat = db.Column(db.String(100))
    date = db.Column(db.String(100))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    first_name = db.Column(db.String(150))
    logs = db.relationship('EventLog')