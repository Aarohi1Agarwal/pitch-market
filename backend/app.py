from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# ========================================
# DATABASE CONFIGURATION
# ========================================

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///pitchmarket.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# ========================================
# TEAM ACCOUNT MODEL
# ========================================

class Team(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

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
# HOME ROUTE
# ========================================

@app.route("/")
def home():

    return "PitchMarket Backend is running!"


# ========================================
# CREATE DEMO TEAM ACCOUNTS
# ========================================

def create_demo_teams():

    demo_teams = [
        {
            "username": "teamalpha",
            "password": "alpha123",
            "team_name": "Team Alpha"
        },
        {
            "username": "greenlabs",
            "password": "green123",
            "team_name": "Green Labs"
        },
        {
            "username": "dormtech",
            "password": "dorm123",
            "team_name": "DormTech"
        },
        {
            "username": "agrivision",
            "password": "agri123",
            "team_name": "AgriVision"
        }
    ]

    for team_data in demo_teams:

        existing_team = Team.query.filter_by(
            username=team_data["username"]
        ).first()

        if not existing_team:

            team = Team(
                username=team_data["username"],
                password=team_data["password"],
                team_name=team_data["team_name"]
            )

            db.session.add(team)

    db.session.commit()


# ========================================
# CREATE DATABASE + DEMO TEAMS
# ========================================

with app.app_context():

    db.create_all()

    create_demo_teams()


# ========================================
# START SERVER
# ========================================

if __name__ == "__main__":

    app.run(debug=True)