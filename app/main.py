from flask import Flask, send_from_directory
app = Flask(__name__, static_folder="../static", static_url_path="/static")
from .VectorTosser import WordVectorUtility
import logging
#On production server, nginx will serve /static. Be careful with trailing / for folder specification.


@app.route("/")
def index():
    return send_from_directory("../public/", "index.html")

# On production server, nginx will serve this.
# For debugging server
if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=80)
