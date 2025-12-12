from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Song(db.Model):

  __tablename__ = 'songs'

  id = db.Column(db.Integer, primary_key=True)
  snapshot_id = db.Column(db.Integer, db.ForeignKey("snapshots.id"))
  
  filename = db.Column(db.String(200), nullable=False)
  pathname = db.Column(db.String(200), nullable=False)
  hash = db.Column(db.String(200), index=True)
  duration = db.Column(db.String(200), nullable=True)
  bitrate = db.Column(db.String(200), nullable=True)
  title = db.Column(db.String(200), nullable=True)
  artist = db.Column(db.String(200), nullable=True)
  status = db.Column(db.String(50), default="Mapped")
  created_at = db.Column(db.DateTime, default=datetime.now())

  def __repr__(self):
    return '<Song %r>' % self.id
  
class Snapshot(db.Model):
  
  __tablename__ = 'snapshots'
  
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(200), nullable=False)
  created_at = db.Column(db.DateTime, default=datetime.now())

  songs = db.relationship("Song", backref='snapshot', lazy=True)

  def __repr__(self):
    return '<Snapshot %r>' % self.id