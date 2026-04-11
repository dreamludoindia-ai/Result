// Admin password
const ADMIN_PASSWORD = "admin123";

// Store data in localStorage
let paymentRequests = JSON.parse(localStorage.getItem('paymentRequests') || '[]');
let publishedResults = JSON.parse(localStorage.getItem('publishedResults') || '[]');

// Login check
function checkLogin() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadPaymentRequests();
        loadResultsHistory();
    } else {
        alert('Wrong password!');
    }
}

function logout() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminPassword').value = '';
}

// Show tab
function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (tab === 'payments') loadPaymentRequests();
    if (tab === 'history') loadResultsHistory();
}

// Load payment requests
function loadPaymentRequests() {
    const container = document.getElementById('paymentRequestsList');
    if (paymentRequests.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888;">No pending payments</p>';
        return;
    }
    
    container.innerHTML = paymentRequests.map((req, index) => `
        <div class="payment-card">
            <div class="payment-info">
                <strong>${req.market}</strong> - ₹${req.amount}<br>
                <small>User: ${req.userId || 'Anonymous'} | Time: ${req.time}</small>
            </div>
            <button class="btn-confirm" onclick="confirmPayment(${index})">✅ Confirm Payment</button>
        </div>
    `).join('');
}

// Add payment request (call this when user sends screenshot)
function addPaymentRequest(market, userId) {
    paymentRequests.push({
        market: market,
        amount: 999,
        userId: userId,
        time: new Date().toLocaleString(),
        status: 'pending'
    });
    localStorage.setItem('paymentRequests', JSON.stringify(paymentRequests));
}

// Confirm payment and show result to user
function confirmPayment(index) {
    const request = paymentRequests[index];
    
    // Find result for this market
    const result = publishedResults.find(r => r.market === request.market && r.status === 'active');
    
    if (result) {
        // Store result for user to see
        localStorage.setItem('pendingResult', JSON.stringify({
            market: request.market,
            imageUrl: result.imageUrl,
            note: result.note
        }));
        alert(`Payment confirmed! Result has been sent to user.`);
    } else {
        alert(`Payment confirmed! Please upload result for ${request.market} first.`);
    }
    
    // Remove from pending
    paymentRequests.splice(index, 1);
    localStorage.setItem('paymentRequests', JSON.stringify(paymentRequests));
    loadPaymentRequests();
}

// Upload result
function uploadResult() {
    const market = document.getElementById('resultMarket').value;
    const date = document.getElementById('resultDate').value;
    const number = document.getElementById('resultNumber').value;
    const note = document.getElementById('resultNote').value;
    const imageFile = document.getElementById('resultImageUpload').files[0];
    
    if (!market || !date || !number) {
        alert('Please fill market, date and result number!');
        return;
    }
    
    // Handle image
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            saveResult(market, date, number, e.target.result, note);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveResult(market, date, number, null, note);
    }
}

function saveResult(market, date, number, imageUrl, note) {
    const result = {
        id: Date.now(),
        market: market,
        date: date,
        number: number,
        imageUrl: imageUrl || `https://via.placeholder.com/300x200?text=${market}+Result`,
        note: note || `Result for ${market} on ${date}: ${number}`,
        status: 'active',
        time: new Date().toLocaleString()
    };
    
    // Deactivate old result for this market
    publishedResults = publishedResults.filter(r => r.market !== market);
    publishedResults.push(result);
    
    localStorage.setItem('publishedResults', JSON.stringify(publishedResults));
    
    alert('Result published successfully!');
    
    // Clear form
    document.getElementById('resultMarket').value = '';
    document.getElementById('resultDate').value = '';
    document.getElementById('resultNumber').value = '';
    document.getElementById('resultNote').value = '';
    document.getElementById('resultImageUpload').value = '';
    
    loadResultsHistory();
}

// Load results history
function loadResultsHistory() {
    const container = document.getElementById('resultsHistoryList');
    if (publishedResults.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888;">No results published yet</p>';
        return;
    }
    
    container.innerHTML = publishedResults.map(result => `
        <div class="result-item">
            <div>
                <strong>${result.market}</strong> - ${result.date}<br>
                Result: ${result.number}<br>
                <small>Published: ${result.time}</small>
            </div>
            <button class="btn-confirm" onclick="deleteResult(${result.id})" style="background: #dc3545;">🗑️ Delete</button>
        </div>
    `).join('');
}

function deleteResult(id) {
    if (confirm('Delete this result?')) {
        publishedResults = publishedResults.filter(r => r.id !== id);
        localStorage.setItem('publishedResults', JSON.stringify(publishedResults));
        loadResultsHistory();
    }
}

// Demo: Add sample payment request
function addDemoPayment() {
    addPaymentRequest('KALYAN', 'user_9876543210');
    loadPaymentRequests();
}
