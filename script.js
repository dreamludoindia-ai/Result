// Market List
const markets = ["SRIDEVI", "MILAN DAY", "KALYAN", "SRIDEVI NIGHT", "MILAN NIGHT", "MAIN BAZAR"];
const whatsappNumber = "919113224019";

// Load markets
function loadMarkets() {
    const grid = document.getElementById('marketGrid');
    grid.innerHTML = '';
    
    markets.forEach(market => {
        const card = document.createElement('div');
        card.className = 'market-card';
        card.innerHTML = `
            <div class="market-name">${market}</div>
            <div class="market-price">💰 Entry: <span>₹999/-</span></div>
            <button class="btn-select" onclick="openPaymentModal('${market}')">Select Market</button>
        `;
        grid.appendChild(card);
    });
}

// Open payment modal
let currentMarket = '';

function openPaymentModal(market) {
    currentMarket = market;
    document.getElementById('selectedMarket').innerHTML = market;
    
    const message = `Payment Done for ${market} Market%0AAmount: ₹999%0AUPI Transaction Screenshot attached.%0APlease confirm payment and share result.`;
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;
    document.getElementById('whatsappLink').href = whatsappLink;
    
    document.getElementById('paymentModal').style.display = 'flex';
}

// Close modals
function closeModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function closeResultModal() {
    document.getElementById('resultModal').style.display = 'none';
}

// Check for pending results on page load
function checkPendingResults() {
    const pending = localStorage.getItem('pendingResult');
    if (pending) {
        const result = JSON.parse(pending);
        showResult(result.market, result.imageUrl, result.note);
        localStorage.removeItem('pendingResult');
    }
}

// Show result to user
function showResult(marketName, resultImageUrl, note = '✅ Payment confirmed! Here is your market result.') {
    document.getElementById('resultMarket').innerHTML = marketName;
    document.getElementById('resultPic').src = resultImageUrl;
    document.getElementById('resultNote').innerHTML = note;
    document.getElementById('resultModal').style.display = 'flex';
}

// Poll for result updates (checks every 30 seconds)
function startResultPolling(market, transactionId) {
    const interval = setInterval(() => {
        const results = JSON.parse(localStorage.getItem('publishedResults') || '[]');
        const result = results.find(r => r.market === market && r.status === 'active');
        if (result) {
            showResult(market, result.imageUrl, result.note);
            clearInterval(interval);
        }
    }, 30000);
}

// Close modal on outside click
window.onclick = function(event) {
    const paymentModal = document.getElementById('paymentModal');
    const resultModal = document.getElementById('resultModal');
    if (event.target === paymentModal) closeModal();
    if (event.target === resultModal) closeResultModal();
}

// Initialize
loadMarkets();
checkPendingResults();
