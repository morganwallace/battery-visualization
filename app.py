from flask import session, request, make_response, jsonify, flash, url_for, redirect,g,render_template,Flask, abort ,g
import os,time, datetime, csv, json, re
from urlparse import urlparse, urljoin

app = Flask(__name__)

# Loads configuration from `config.py`
app.config.from_object('config')


@app.route('/')
def home():
    return render_template('index.html')



if __name__ == '__main__':
    app.debug=True
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
