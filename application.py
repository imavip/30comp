import os
import re
from flask import Flask, jsonify, render_template, request, url_for
from flask_jsglue import JSGlue

from cs50 import SQL

# configure application
app = Flask(__name__)
JSGlue(app)

# configure CS50 Library to use SQLite database
db = SQL("sqlite:///30companies.db")

@app.route("/")
def index():
    return render_template("index.html")
    
@app.route("/stocks")
def stocks():
    stocks = db.execute('SELECT * FROM "maxdata2016" ORDER BY date ASC')
    return jsonify(stocks)

