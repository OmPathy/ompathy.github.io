import unittest
from sentiment_analyzer import SentimentAnalyzer
import json

class TestSentimentAnalyzer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        print("Loading model for testing...")
        cls.analyzer = SentimentAnalyzer()

    def test_short_messages(self):
        print("\nTesting short messages...")
        short_msgs = ["Hi", "OK", "ok"]
        for msg in short_msgs:
            result = self.analyzer.analyze_message(msg)
            print(f"Message: '{msg}' -> {result}")
            self.assertEqual(result['sentiment'], 'Neutral')
            self.assertEqual(result['score'], 0.5)

    def test_positive_sentiment(self):
        print("\nTesting positive sentiment...")
        msg = "I am so excited about this project! It's amazing."
        result = self.analyzer.analyze_message(msg)
        print(f"Message: '{msg}' -> {result}")
        self.assertEqual(result['sentiment'], 'Positive')
        self.assertEqual(result['engagement_level'], 'high')

    def test_negative_sentiment(self):
        print("\nTesting negative sentiment...")
        msg = "I am completely burned out and tired of this."
        result = self.analyzer.analyze_message(msg)
        print(f"Message: '{msg}' -> {result}")
        self.assertEqual(result['sentiment'], 'Negative')
        self.assertEqual(result['engagement_level'], 'low')

    def test_multilingual_korean(self):
        print("\nTesting Korean sentiment...")
        # "This is really great!"
        msg = "이거 정말 좋아요!" 
        result = self.analyzer.analyze_message(msg)
        print(f"Message: (Korean text) -> {result}")
        self.assertEqual(result['sentiment'], 'Positive')

    def test_bulk_analysis(self):
        print("\nTesting bulk analysis format...")
        logs = [
            {"user_id": "u1", "timestamp": "2023-01-01T10:00:00", "message_content": "Hi"},
            {"user_id": "u2", "timestamp": "2023-01-01T10:05:00", "message_content": "I hate this bug, it's so stressful."}
        ]
        result = self.analyzer.analyze_logs(logs)
        print(json.dumps(result, indent=2))
        
        self.assertIn('analysis_result', result)
        self.assertEqual(len(result['analysis_result']), 2)
        self.assertEqual(result['analysis_result'][0]['sentiment'], 'Neutral')
        self.assertEqual(result['analysis_result'][1]['sentiment'], 'Negative')
        self.assertEqual(result['analysis_result'][1]['engagement_level'], 'low')

if __name__ == '__main__':
    unittest.main()
