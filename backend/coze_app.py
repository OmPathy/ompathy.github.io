from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

COZE_API_KEY = os.environ.get("COZE_API_KEY")
COZE_API_URL = "https://api.coze.com/v3/chat"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message")
    if not user_message:
        return jsonify({"error": "메시지가 없어요"}), 400

    headers = {
        "Authorization": f"Bearer {COZE_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {"message": user_message}

    response = requests.post(COZE_API_URL, json=payload, headers=headers)
    bot_message = response.json().get("response")
    return jsonify({
        "user_message": user_message,
        "bot_message": bot_message
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
