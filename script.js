// script.js

// DOM Elements
const textInput = document.getElementById('text-input');
const analyzeBtn = document.getElementById('analyze-btn');
const clearBtn = document.getElementById('clear-btn');
const sampleBtn = document.getElementById('sample-btn');
const charCount = document.getElementById('char-count');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const analyzedText = document.getElementById('analyzed-text');
const sentimentBadge = document.getElementById('sentiment-badge');
const sentimentIcon = document.getElementById('sentiment-icon');
const sentimentLabel = document.getElementById('sentiment-label');
const compoundScore = document.getElementById('compound-score');
const positiveScore = document.getElementById('positive-score');
const neutralScore = document.getElementById('neutral-score');
const negativeScore = document.getElementById('negative-score');
const historyList = document.getElementById('history-list');
const themeSwitch = document.getElementById('checkbox'); // Dark mode toggle

// Sample text for testing
const sampleText = "I love programming! It's so much fun.";

// Event Listeners
textInput.addEventListener('input', updateCharCount);
analyzeBtn.addEventListener('click', analyzeSentiment);
clearBtn.addEventListener('click', clearInput);
sampleBtn.addEventListener('click', loadSampleText);
document.addEventListener('keydown', handleShortcuts);
themeSwitch.addEventListener('change', toggleDarkMode); // Listen for dark mode toggle

// Functions
function updateCharCount() {
    charCount.textContent = textInput.value.length;
}

function analyzeSentiment() {
    const text = textInput.value.trim();
    if (text === "") {
        showToast("Please enter some text to analyze.");
        return;
    }

    loading.classList.remove('hidden');
    results.classList.add('hidden');

    // Simulate sentiment analysis (replace with actual API call)
    setTimeout(() => {
        const sentimentData = mockSentimentAnalysis(text);
        displayResults(sentimentData);
        loading.classList.add('hidden');
    }, 1000);
}

function clearInput() {
    textInput.value = '';
    charCount.textContent = '0';
    results.classList.add('hidden');
}

function loadSampleText() {
    textInput.value = sampleText;
    updateCharCount();
}

function handleShortcuts(event) {
    if (event.ctrlKey && event.key === 'Enter') {
        analyzeSentiment();
    } else if (event.key === 'Escape') {
        clearInput();
    }
}

function displayResults(data) {
    analyzedText.textContent = data.text;
    compoundScore.textContent = data.scores.compound;
    positiveScore.textContent = `${data.scores.positive}%`;
    neutralScore.textContent = `${data.scores.neutral}%`;
    negativeScore.textContent = `${data.scores.negative}%`;

    // Update sentiment badge
    sentimentBadge.classList.remove('positive', 'neutral', 'negative');
    if (data.sentiment === 'positive') {
        sentimentBadge.classList.add('positive');
        sentimentIcon.className = 'fas fa-smile';
        sentimentLabel.textContent = 'Positive';
    } else if (data.sentiment === 'neutral') {
        sentimentBadge.classList.add('neutral');
        sentimentIcon.className = 'fas fa-meh';
        sentimentLabel.textContent = 'Neutral';
    } else {
        sentimentBadge.classList.add('negative');
        sentimentIcon.className = 'fas fa-frown';
        sentimentLabel.textContent = 'Negative';
    }

    results.classList.remove('hidden');
    updateHistory(data.text);
}

function updateHistory(text) {
    const historyItem = document.createElement('div');
    historyItem.textContent = text;
    historyList.appendChild(historyItem);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Mock sentiment analysis function
function mockSentimentAnalysis(text) {
    // This is a placeholder for actual sentiment analysis logic
    return {
        text: text,
        sentiment: 'positive', // Change this based on analysis
        scores: {
            compound: 0.5,
            positive: 70,
            neutral: 20,
            negative: 10
        }
    };
}

// Dark mode toggle function
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}