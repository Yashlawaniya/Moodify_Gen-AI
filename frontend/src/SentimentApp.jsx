import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import axios from 'axios';
import './App.css';

const emojiMap = {
    "💔": "heartbroken",
    "😂": "laughing",
    "😊": "happy",
    "😢": "crying",
    "❤️": "love",
    "😡": "angry",
    "👍": "thumbs up",
    "🙏": "thank you",
    "🔥": "fire",
    "💯": "perfect",
};

const slangMap = {
    idk: "I don't know",
    lol: "laughing out loud",
    brb: "be right back",
    omg: "oh my god",
    btw: "by the way",
    lmao: "laughing my ass off",
    wtf: "what the heck",
    imo: "in my opinion",
    ikr: "I know right",
    thx: "thanks",
};

const sentimentEmojiMap = {
    'very positive': '😄',
    'positive': '🙂',
    'neutral': '😐',
    'negative': '🙁',
    'very negative': '😠'
};

const preprocessText = (input) => {
    let output = input;
    Object.entries(emojiMap).forEach(([emoji, word]) => {
        output = output.split(emoji).join(` ${word} `);
    });
    Object.entries(slangMap).forEach(([slang, fullForm]) => {
        const regex = new RegExp(`\\b${slang}\\b`, 'gi');
        output = output.replace(regex, fullForm);
    });
    return output;
};

const getSentimentClass = (sentiment) => {
    switch (sentiment.toLowerCase()) {
        case 'very positive':
            return 'very-positive';
        case 'positive':
            return 'positive';
        case 'neutral':
            return 'neutral';
        case 'negative':
            return 'negative';
        case 'very negative':
            return 'very-negative';
        default:
            return '';
    }
};

const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
};

function LandingPage() {
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState("");
    const [result, setResult] = useState(null);
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const analyzeSentiment = async () => {
        try {
            const cleanedText = preprocessText(text);
            // const res = await axios.post('http://localhost:5000/api/sentiment', { text: cleanedText });
            const API_BASE = import.meta.env.VITE_API_URL || 'https://moodify-gen-ai.onrender.com';
            const res = await axios.post(`${API_BASE}/api/sentiment`, { text: cleanedText });
            const resultArray = res?.data?.result?.[0] || [];
               if (resultArray.length === 0) {
                   console.error("No sentiment data returned");
                return;
}

            const dataResult = resultArray.reduce((prev, current) => {
                return prev.score > current.score ? prev : current;
            });
            setResult(dataResult);
            speak(`The sentiment is ${dataResult.label} with ${(dataResult.score * 100).toFixed(2)} percent confidence.`);
        } catch (err) {
            console.error(err);
        }
    };

    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support the Web Speech API.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setText(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.start();
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container">
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="main-heading"
            >
                <Typewriter
                    words={[
                        'Moodify',
                        'Sentiment Analysis App',
                        'Built with HuggingFace',
                        'Explore the Power of AI!'
                    ]}
                    loop={false}
                    cursor
                    cursorStyle='|'
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={1000}
                />
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="subtext"
            >
                This web app allows you to analyze the sentiment of any text using advanced Natural Language Processing models powered by HuggingFace and LangChain.
            </motion.p>

            <div className="form-box">
                <textarea
                    className="input-box"
                    placeholder="Enter your text here..."
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    rows={5}
                ></textarea>
                <div className="button-group">
                    <button onClick={analyzeSentiment}>Analyze</button>
                    <button onClick={handleVoiceInput} disabled={isListening}>
                        {isListening ? 'Listening...' : '🎙️'}
                    </button>
                </div>
            </div>

            {result && (
                <motion.div
                    className={`result-box`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <p className={`sentiment-label ${getSentimentClass(result.label)}`}>
                        <strong>Label:</strong> {sentimentEmojiMap[result.label.toLowerCase()] || ''} {result.label}
                    </p>
                    <p className={`sentiment-label ${getSentimentClass(result.label)}`}>
                        <strong>Confidence:</strong> {(result.score * 100).toFixed(2)}%
                    </p>
                </motion.div>
            )}
        </div>
    );
}

export default LandingPage;