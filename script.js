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

async function analyzeSentiment() {
    const text = textInput.value.trim();
    if (text === "") {
        showToast("Please enter some text to analyze.");
        return;
    }

    loading.classList.remove('hidden');
    results.classList.add('hidden');

    try {
        const response = await fetch('http://localhost:5000/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text })
        });

        if (!response.ok) {
            const errorData = await response.json();
            showToast(errorData.error || "An error occurred");
            return;
        }

        const sentimentData = await response.json();
        displayResults(sentimentData);
    } catch (error) {
        showToast("An error occurred while analyzing sentiment.");
    } finally {
        loading.classList.add('hidden');
    }
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
    if (data.sentiment === 'Positive') {
        sentimentBadge.classList.add('positive');
        sentimentIcon.className = 'fas fa-smile';
        sentimentLabel.textContent = 'Positive';
    } else if (data.sentiment === 'Neutral') {
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
