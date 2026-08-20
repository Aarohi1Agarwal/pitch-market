from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# SQLite database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///pitchmarket.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# ========================================
# TEAM ACCOUNT
# ========================================

class Team(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(100),
        nullable=False
    )

    team_name = db.Column(
        db.String(100),
        nullable=False
    )


# ========================================
# HOME
# ========================================

@app.route("/")
def home():

    return "PitchMarket Backend is running!"


# ========================================
# CREATE DATABASE
# ========================================

with app.app_context():

    db.create_all()


# ========================================
# RUN SERVER
# ========================================

if __name__ == "__main__":

    app.run(debug=True)