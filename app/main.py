from flask import Flask, send_from_directory, request
# from .VectorTosser import WordVectorUtility
import logging
from collections import OrderedDict
import os
from flask import jsonify, abort
import numpy as np
from pymagnitude import Magnitude

#On production server, nginx will serve /static. Be careful with trailing / for folder specification -- don't use.
app = Flask(__name__, static_folder="../static", static_url_path="/static")
if app.debug:
    app.logger.info("Debug detected, enabling CORS for * origins")
    from flask_cors import CORS
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
# don't chdir or flask will falter
# os.chdir(dname)
print("Loading word vectors")
vectorUtil = Magnitude(dname + "/../data/glove.6B.300d.magnitude")
vectorUtil.most_similar("memory", topn=10) #to trigger initialization
print("Word vectors loaded")

@app.route("/")
def index():
    return send_from_directory("../public/", "index.html")

@app.route("/api/words")
def getSimilarWords():
    query = request.args.get("query")
    print("Received query: " + query)

    try:
        paramNov = float(request.args.get("nov"))
        paramNum = int(request.args.get("num"))
    except ValueError:
        abort(400)
    if query == None or paramNov == None or paramNum == None:
        abort(400)
    if len(query.split()) == 0:
        abort(400)
    if paramNov < 0 or paramNov > 1:
        abort(400)
    if paramNum > 50:
        abort(400)

    tokens = [x for x in query.split()[:40]]

    responseList = []
    searchLength = int(paramNum + 5 * paramNov * paramNum)
    for token in tokens:
        if token.lower() in vectorUtil:
            arr = vectorUtil.most_similar(token.lower(), topn=searchLength)
            idx = np.sort(np.random.choice(searchLength, paramNum, replace=False))
            responseList.append({"word": token, "list":[arr[i][0] for i in idx]})
        else:
            responseList.append({"word": token, "list":["word unavailable!"]})

    return jsonify(responseList)


# this apparently causes issues with hot reloading
# if __name__ == "__main__":
#     app.run(host='0.0.0.0', debug=True, port=8080)
