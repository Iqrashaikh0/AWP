// Example database and user information
        let userDatabase = {};
        let currentUser = null;
        let votes = {
            'Congress Party': 0,
            'BJP': 0,
            'CPI': 0
        };

        // Function to save the current section
        function saveCurrentSection(sectionId) {
            localStorage.setItem('currentSection', sectionId);
        }

        // Function to load the saved section
        function loadSavedSection() {
            const savedSection = localStorage.getItem('currentSection');
            if (savedSection) {
                showSection(savedSection);
            } else {
                showSection('home');
            }
        }

        // Function to show the section and save it
        function showSection(sectionId) {
            const sections = ['home', 'register', 'login', 'voting', 'result', 'contact'];
            sections.forEach(id => {
                document.getElementById(id).style.display = id === sectionId ? 'block' : 'none';
            });
            saveCurrentSection(sectionId);
        }

        // Toggle sidebar function
        function toggleSidebar() {
            document.querySelector('.sidebar').classList.toggle('collapsed');
            document.querySelector('.content').classList.toggle('collapsed');
        }

        // Redirect to login function
        function redirectToLogin() {
            showSection('login');
        }

        // Redirect to voting function
        function redirectToVoting() {
            showSection('voting');
            if (userDatabase[currentUser].hasVoted) {
                document.getElementById('voteStatus').innerText = 'You have already voted.';
                document.getElementById('voteStatus').style.display = 'block';
                document.getElementById('votingForm').style.display = 'none';
            } else {
                document.getElementById('voteStatus').style.display = 'none';
                document.getElementById('votingForm').style.display = 'block';
            }
        }

        // Redirect to results function
        function redirectToResults() {
            showSection('result');
            updateChart();
        }

        // Update chart function
        function updateChart() {
            const ctx = document.getElementById('resultsChart').getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Object.keys(votes),
                    datasets: [{
                        label: 'Votes',
                        data: Object.values(votes),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 5
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Register form submission event listener
        document.getElementById('registerForm').addEventListener('submit', function (event) {
            event.preventDefault();
            const name = document.getElementById('registerName').value;
            const voterId = document.getElementById('registerVoterId').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            if (!userDatabase[voterId]) {
                userDatabase[voterId] = {
                    name: name,
                    email: email,
                    password: password,
                    hasVoted: false
                };
                alert('Registration successful!');
                redirectToLogin();
            } else {
                alert('Voter ID already registered.');
            }
        });

        // Login form submission event listener
        document.getElementById('loginForm').addEventListener('submit', function (event) {
            event.preventDefault();
            const voterId = document.getElementById('loginVoterId').value;
            const password = document.getElementById('loginPassword').value;

            if (userDatabase[voterId] && userDatabase[voterId].password === password) {
                currentUser = voterId;
                alert('Login successful!');
                redirectToVoting();
            } else {
                alert('Invalid Voter ID or password.');
            }
        });

        // Voting form submission event listener
        document.getElementById('votingForm').addEventListener('submit', function (event) {
            event.preventDefault();
            const candidate = document.getElementById('candidate').value;

            if (userDatabase[currentUser]) {
                if (userDatabase[currentUser].hasVoted) {
                    alert('You have already voted.');
                } else {
                    votes[candidate]++;
                    userDatabase[currentUser].hasVoted = true;
                    alert('Vote submitted successfully!');
                    redirectToResults();
                }
            }
        });

        // Contact form submission event listener
        document.getElementById('contactForm').addEventListener('submit', function (event) {
            event.preventDefault();
            alert('Message sent successfully!');
            document.getElementById('contactForm').reset();
        });

        // Initialize the page by loading the saved section
        window.onload = function () {
            loadSavedSection();
        };


