# app.py - Flask backend for sentiment analysis
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import nltk
import os

# Download VADER lexicon if not already present
try:
    nltk.data.find('vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon')

from nltk.sentiment.vader import SentimentIntensityAnalyzer

app = Flask(__name__, static_folder='static')
CORS(app)  # Enable Cross-Origin Resource Sharing

@app.route('/')
def index():
    """Serve the frontend HTML"""
    return send_from_directory('static', 'index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze_sentiment():
    """Analyze text sentiment using VADER and return results"""
    try:
        # Get text from request
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
            
        text = data['text']
        
        # Analyze sentiment
        sid = SentimentIntensityAnalyzer()
        sentiment_scores = sid.polarity_scores(text)
        
        # Determine overall sentiment from compound score
        if sentiment_scores['compound'] >= 0.05:
            overall_sentiment = "Positive"
        elif sentiment_scores['compound'] <= -0.05:
            overall_sentiment = "Negative"
        else:
            overall_sentiment = "Neutral"
            
        # Format percentages for display
        formatted_scores = {
            'compound': round(sentiment_scores['compound'], 4),
            'positive': round(sentiment_scores['pos'] * 100, 2),
            'neutral': round(sentiment_scores['neu'] * 100, 2),
            'negative': round(sentiment_scores['neg'] * 100, 2)
        }
        
        # Prepare and return result
        result = {
            'text': text,
            'sentiment': overall_sentiment,
            'scores': formatted_scores
        }
        
        return jsonify(result)
        
    except Exception as e:
        # Handle any unexpected errors
        return jsonify({'error': str(e)}), 500

# Make sure the static directory exists
if not os.path.exists('static'):
    os.makedirs('static')

if __name__ == '__main__':
    print("Starting Sentiment Analysis API...")
    print("Server running at http://localhost:5000")
    app.run(debug=True)