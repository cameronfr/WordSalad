from flask import Flask, send_from_directory, request
from .VectorTosser import WordVectorUtility
import logging
from collections import OrderedDict
import os
from flask import jsonify, abort
import numpy as np

#On production server, nginx will serve /static. Be careful with trailing / for folder specification -- don't use.
app = Flask(__name__, static_folder="../static", static_url_path="/static")
if app.debug:
    from flask_cors import CORS
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
# don't chdir or flask will falter
# os.chdir(dname)
app.logger.info("Loading word vectors")
vectorUtil = WordVectorUtility(dname + "/../data/glove.6B.300d.txt")
app.logger.info("Word vectors loaded")

# #for debugging
# def crossdomain(origin=None, methods=None, headers=None, max_age=21600, attach_to_all=True, automatic_options=True):
#     if methods is not None:
#         methods = ', '.join(sorted(x.upper() for x in methods))
#     if headers is not None and not isinstance(headers, str):
#         headers = ', '.join(x.upper() for x in headers)
#     if not isinstance(origin, str):
#         origin = ', '.join(origin)
#     if isinstance(max_age, timedelta):
#         max_age = max_age.total_seconds()
#
#     def get_methods():
#         if methods is not None:
#             return methods
#
#         options_resp = current_app.make_default_options_response()
#         return options_resp.headers['allow']
#
#     def decorator(f):
#         def wrapped_function(*args, **kwargs):
#             if automatic_options and request.method == 'OPTIONS':
#                 resp = current_app.make_default_options_response()
#             else:
#                 resp = make_response(f(*args, **kwargs))
#             if not attach_to_all and request.method != 'OPTIONS':
#                 return resp
#
#             h = resp.headers
#
#             h['Access-Control-Allow-Origin'] = origin
#             h['Access-Control-Allow-Methods'] = get_methods()
#             h['Access-Control-Max-Age'] = str(max_age)
#             if headers is not None:
#                 h['Access-Control-Allow-Headers'] = headers
#             return resp
#
#         f.provide_automatic_options = False
#         return update_wrapper(wrapped_function, f)
#     return decorator
#

@app.route("/")
def index():
    return send_from_directory("../public/", "index.html")

@app.route("/api/words")
def getSimilarWords():
    query = request.args.get("query")

    try:
        paramNov = float(request.args.get("nov"))
        paramNum = int(request.args.get("num"))
    except ValueError:
        abort(400)
    if query == None or paramNov == None or paramNum == None:
        abort(400)
    if len(query.split()) > 25 or len(query.split()) == 0:
        abort(400)
    if paramNov < 0 or paramNov > 1:
        abort(400)
    if paramNum > 50:
        abort(400)

    tokens = [x for x in query.split()]
    responseList = []
    searchLength = int(paramNum + 5 * paramNov * paramNum)
    for token in tokens:
        if vectorUtil.inWordDict(token.lower()):
            arr = vectorUtil.closestWords([token.lower()], searchLength)
            idx = np.sort(np.random.choice(searchLength, paramNum, replace=False))
            #possibly sort these indexes so results are in order of most similar?
            responseList.append({"word": token, "list":list(arr[idx])})
        else:
            responseList.append({"word": token, "list":["word unavailable!"]})

    return jsonify(responseList)


# this apparently causes issues with hot reloading 123
# if __name__ == "__main__":
#     app.run(host='0.0.0.0', debug=True, port=8080)
