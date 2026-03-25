const quizData = {
    DBMS: [
        { q: "Which key uniquely identifies a record in a table?", a: ["Primary Key", "Foreign Key", "Super Key", "Candidate Key"], correct: 0 },
        { q: "What does SQL stand for?", a: ["Simple Query Language", "Structured Query Language", "Strong Query List", "None"], correct: 1 },
        { q: "Which command removes all records but keeps the structure?", a: ["DELETE", "DROP", "TRUNCATE", "REMOVE"], correct: 2 },
        { q: "In an ER diagram, an entity is shown as a:", a: ["Circle", "Rectangle", "Diamond", "Ellipse"], correct: 1 },
        { q: "3NF deals with which type of dependency?", a: ["Partial", "Multi-valued", "Transitive", "Join"], correct: 2 }
    ],
    OS: [
        { q: "What is the core of an Operating System?", a: ["Shell", "Kernel", "Command Prompt", "Scheduler"], correct: 1 },
        { q: "Which is NOT a valid process state?", a: ["Running", "Ready", "Finished", "Waiting"], correct: 2 },
        { q: "Infinite waiting for resources is called:", a: ["Starvation", "Deadlock", "Paging", "Spooling"], correct: 1 },
        { q: "Round Robin is a type of:", a: ["CPU Scheduling", "Disk Management", "Memory Allocation", "File System"], correct: 0 },
        { q: "Virtual memory uses which technique?", a: ["Segmentation", "Paging", "Caching", "Fragmentation"], correct: 1 }
    ],
    CN: [
        { q: "How many layers are in the OSI model?", a: ["5", "6", "7", "8"], correct: 2 },
        { q: "Which protocol is used to browse the web?", a: ["FTP", "SMTP", "HTTP", "SNMP"], correct: 2 },
        { q: "Size of an IPv4 address is:", a: ["16 bits", "32 bits", "64 bits", "128 bits"], correct: 1 },
        { q: "Which device works at the Data Link Layer?", a: ["Hub", "Router", "Switch", "Repeater"], correct: 2 },
        { q: "Which layer is responsible for end-to-end delivery?", a: ["Network", "Transport", "Session", "Physical"], correct: 1 }
    ],
    DSA: [
        { q: "Which data structure uses LIFO?", a: ["Queue", "Stack", "Linked List", "Tree"], correct: 1 },
        { q: "Binary Search time complexity is:", a: ["O(n)", "O(n^2)", "O(log n)", "O(1)"], correct: 2 },
        { q: "A node with no children is a:", a: ["Root", "Branch", "Leaf", "Parent"], correct: 2 },
        { q: "Quick Sort is based on which strategy?", a: ["Greedy", "Backtracking", "Divide & Conquer", "Dynamic"], correct: 2 },
        { q: "Which is a linear data structure?", a: ["Tree", "Graph", "Array", "Heap"], correct: 2 }
    ],
    AI: [
        { q: "Father of Artificial Intelligence is:", a: ["Alan Turing", "John McCarthy", "Elon Musk", "Ada Lovelace"], correct: 1 },
        { q: "Which is a type of Machine Learning?", a: ["Supervised", "Unsupervised", "Reinforcement", "All of these"], correct: 3 },
        { q: "Python is popular for AI because of:", a: ["Libraries", "Slow speed", "Complexity", "Old age"], correct: 0 },
        { q: "NLP stands for:", a: ["Natural Language Processing", "Neural Link Protocol", "Node List Process", "None"], correct: 0 },
        { q: "A software that mimics human behavior is:", a: ["Virus", "AI Agent", "Browser", "Compiler"], correct: 1 }
    ]
};

let currentUser = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

// --- UPDATED CREDENTIALS VALIDATION ---
function handleAuth() {
    const email = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // 1. Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return alert("Please enter a valid email address (e.g., user@gmail.com)");
    }

    // 2. Password Complexity Validation
    // Requirements: 8+ chars, 1 Uppercase, 1 Lowercase, 1 Number
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passRegex.test(pass)) {
        return alert("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.");
    }

    currentUser = email;
    showDashboard();
}

function showDashboard() {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById('dashboard-section').classList.remove('hidden');
    document.getElementById('welcome-msg').innerText = `Welcome, ${currentUser}`;
    renderDashboardResults();
}

function renderDashboardResults() {
    const resBody = document.getElementById('dashboard-res-body');
    const history = JSON.parse(localStorage.getItem(currentUser + '_hist')) || [];
    document.getElementById('total-attempts').innerText = `${history.length} Attempts`;

    resBody.innerHTML = history.length ? '' : '<tr><td colspan="4" style="text-align:center">No attempts yet.</td></tr>';
    [...history].reverse().forEach(h => {
        const pass = h.sc >= 3;
        resBody.innerHTML += `<tr>
            <td>${h.sub}</td>
            <td>${h.sc}/5</td>
            <td class="${pass ? 'status-pass' : 'status-fail'}">${pass ? 'PASS' : 'FAIL'}</td>
            <td>${h.date}</td>
        </tr>`;
    });
}

function startQuiz(subject) {
    currentQuestions = quizData[subject];
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    document.getElementById('current-subject').innerText = subject;
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById('quiz-section').classList.remove('hidden');
    loadQuestion();
}

function loadQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    document.getElementById('question-text').innerText = q.q;
    document.getElementById('question-counter').innerText = `${currentQuestionIndex + 1}/${currentQuestions.length}`;
    document.getElementById('progress').style.width = ((currentQuestionIndex + 1) / currentQuestions.length) * 100 + "%";

    const container = document.getElementById('options-container');
    container.innerHTML = '';
    q.a.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(idx, btn);
        container.appendChild(btn);
    });
}

function checkAnswer(selected, btn) {
    const q = currentQuestions[currentQuestionIndex];
    userAnswers.push({ q: q.q, user: q.a[selected], correct: q.a[q.correct], isCorrect: selected === q.correct });

    document.querySelectorAll('.option-btn').forEach(b => b.style.pointerEvents = 'none');
    if(selected === q.correct) { btn.classList.add('correct'); score++; }
    else { btn.classList.add('wrong'); document.querySelectorAll('.option-btn')[q.correct].classList.add('correct'); }

    setTimeout(() => {
        currentQuestionIndex++;
        if(currentQuestionIndex < currentQuestions.length) loadQuestion();
        else showResult();
    }, 1000);
}

function showResult() {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById('result-section').classList.remove('hidden');
    const pass = score >= 3;
    document.getElementById('result-status').innerText = pass ? "Congratulations!" : "Try Again!";
    document.getElementById('result-emoji').innerText = pass ? "🎉" : "📚";
    document.getElementById('result-score').innerText = `${score}/5`;

    const tbody = document.getElementById('review-body');
    tbody.innerHTML = '';
    userAnswers.forEach(ans => {
        tbody.innerHTML += `<tr><td>${ans.q}</td><td style="color:${ans.isCorrect ? '#10b981' : '#f87171'}">${ans.user}</td><td style="color:#10b981">${ans.correct}</td></tr>`;
    });

    saveHistory(document.getElementById('current-subject').innerText, score);
}

function saveHistory(sub, sc) {
    let history = JSON.parse(localStorage.getItem(currentUser + '_hist')) || [];
    const date = new Date().toLocaleDateString();
    history.push({ sub, sc, date });
    localStorage.setItem(currentUser + '_hist', JSON.stringify(history));
}

function logout() { location.reload(); }
