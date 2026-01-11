import logging
from transformers import pipeline
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SentimentAnalyzer:
    def __init__(self, model_name="tabularisai/multilingual-sentiment-analysis"):
        """
        Initialize the SentimentAnalyzer with the specified model.
        """
        self.model_name = model_name
        self.pipeline = None
        self._load_model()

    def _load_model(self):
        """
        Load the sentiment analysis model.
        """
        try:
            logger.info(f"Loading model: {self.model_name}")
            self.pipeline = pipeline("sentiment-analysis", model=self.model_name)
            logger.info("Model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load model {self.model_name}: {e}")
            # Fallback or leave as None to handle gracefully during analysis
            self.pipeline = None

    def analyze_message(self, message):
        """
        Analyze a single message for sentiment.
        Returns a dictionary with sentiment, score, and engagement_level.
        """
        if not message or not isinstance(message, str):
            return {
                "sentiment": "Neutral",
                "score": 0.0,
                "engagement_level": "medium"
            }

        # Constraint: Handle short messages
        if len(message.strip()) < 4 and message.strip().lower() in ["hi", "ok", "yes", "no", "good"]:
             return {
                "sentiment": "Neutral",
                "score": 0.5, # Low confidence/neutral score
                "engagement_level": "medium"
            }

        if not self.pipeline:
             return {
                "sentiment": "Neutral",
                "score": 0.0,
                "engagement_level": "medium",
                "error": "Model not loaded"
            }

        try:
            # Truncate to 512 tokens (approx chars for simplicity here, real tokenization is better but this is a safeguard)
            result = self.pipeline(message[:512])[0]
            
            # Map model labels to standard Positive/Neutral/Negative if needed
            # tabularisai model usually returns labels like '5 stars', '4 stars', etc. or 'Positive' depending on the specific fine-tuning.
            # Let's assume standard labels or map them. 
            # If the model is a star-based model (common for multilingual), we map stars to sentiment.
            # However, the user request implies "Positive, Neutral, Negative".
            # Let's inspect the output in verification. For now, we use the label directly but normalize it.
            
            label = result['label']
            score = result['score']
            
            # Normalization logic (assuming star rating or standard labels)
            sentiment = self._normalize_label(label)
            
            engagement = self._calculate_engagement(sentiment, score, message)

            return {
                "sentiment": sentiment,
                "score": score,
                "engagement_level": engagement
            }

        except Exception as e:
            logger.error(f"Error analyzing message: {e}")
            return {
                "sentiment": "Neutral",
                "score": 0.0,
                "engagement_level": "medium",
                "error": str(e)
            }

    def _normalize_label(self, label):
        """
        Normalize model labels to Positive, Neutral, Negative.
        """
        label = label.lower()
        if '5 star' in label or '4 star' in label or 'positive' in label:
            return 'Positive'
        elif '1 star' in label or '2 star' in label or 'negative' in label:
            return 'Negative'
        else:
            return 'Neutral'

    def _calculate_engagement(self, sentiment, score, message):
        """
        Infer engagement level based on sentiment, score, and keywords.
        """
        msg_lower = message.lower()
        
        # High engagement indicators
        if sentiment == 'Positive' and score > 0.8:
            return 'high'
        if any(word in msg_lower for word in ['excited', 'amazing', 'great', 'love', 'fantastic']):
            return 'high'
            
        # Low engagement / Burnout indicators
        if sentiment == 'Negative' and score > 0.8:
            return 'low' # Interpreted as potential burnout/fatigue
        if any(word in msg_lower for word in ['tired', 'exhausted', 'burnout', 'stress', 'hate']):
            return 'low'
            
        return 'medium'

    def analyze_logs(self, logs):
        """
        Process a list of chat logs and return the structured result.
        """
        results = []
        for log in logs:
            user_id = log.get('user_id', 'unknown')
            message = log.get('message_content', '')
            timestamp = log.get('timestamp', datetime.now().isoformat())
            
            analysis = self.analyze_message(message)
            
            result_entry = {
                "user_id": user_id,
                "sentiment": analysis['sentiment'],
                "score": analysis['score'],
                "engagement_level": analysis['engagement_level'],
                "detected_at": timestamp
            }
            results.append(result_entry)
            
        return {"analysis_result": results}
