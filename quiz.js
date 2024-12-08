const correctAnswers = {
    question1: "processeur",
    question2: "ram",
    question3: "ssd",
    question4: "carte graphique",
    question5: "disque dur", // Corrected to match the `correctAnswer` in the questions array
    question6: "fournir de l'énergie à tous les composants", 
    question7: "carte wi-fi", // Corrected to match the `correctAnswer` in the questions array
    question8: "contrôleur mémoire",
    question9: "ventilateur",
    question10: "clavier"
};

const questions = [
    {
        id: "question1",
        questionText: "Quel composant est responsable de l'exécution des instructions dans un ordinateur ?",
        options: ["Processeur", "Carte mère", "Alimentation"],
        correctAnswer: "processeur"
    },
    {
        id: "question2",
        questionText: "Quel composant est responsable du stockage temporaire des données pendant que le processeur les traite ?",
        options: ["RAM", "Disque dur", "Carte graphique"],
        correctAnswer: "ram"
    },
    {
        id: "question3",
        questionText: "Quel type de disque dur est plus rapide que les disques durs traditionnels ?",
        options: ["SSD", "HDD", "CD-ROM"],
        correctAnswer: "ssd"
    },
    {
        id: "question4",
        questionText: "Quel composant est responsable de l'affichage des images sur l'écran de l'ordinateur ?",
        options: ["Carte graphique", "Carte mère", "Processeur"],
        correctAnswer: "carte graphique"
    },
    {
        id: "question5",
        questionText: "Quel composant stocke les données de manière permanente dans un ordinateur ?",
        options: ["Disque dur (HDD)", "RAM", "Carte graphique"],
        correctAnswer: "disque dur" // Corrected to match `correctAnswers`
    },
    {
        id: "question6",
        questionText: "Quel est le rôle de l'alimentation dans un ordinateur ?",
        options: ["Fournir de l'énergie à tous les composants", "Gérer la connexion Internet", "Refroidir les composants"],
        correctAnswer: "fournir de l'énergie à tous les composants"
    },
    {
        id: "question7",
        questionText: "Quel est le composant principal pour connecter un ordinateur à un réseau sans fil ?",
        options: ["Carte Wi-Fi", "Carte réseau Ethernet", "Carte son"],
        correctAnswer: "carte wi-fi" // Corrected to match `correctAnswers`
    },
    {
        id: "question8",
        questionText: "Quel composant permet de gérer la communication entre le processeur et la mémoire vive ?",
        options: ["Contrôleur mémoire", "Carte graphique", "Carte mère"],
        correctAnswer: "contrôleur mémoire"
    },
    {
        id: "question9",
        questionText: "Quel composant est principalement responsable du refroidissement d'un ordinateur ?",
        options: ["Ventilateur", "Carte mère", "Disque dur"],
        correctAnswer: "ventilateur"
    },
    {
        id: "question10",
        questionText: "Quel composant permet à un utilisateur de saisir des informations dans un ordinateur ?",
        options: ["Clavier", "Carte graphique", "Disque SSD"],
        correctAnswer: "clavier"
    }
];


    let currentQuestionIndex = 0;
    let score = 0;
    let correctAnswersCount = 0; // Counter for correct answers
    let timer;
    let timeLeft = 10; // Time for each question (10 seconds)

    // Function to display a question
    function displayQuestion(question) {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question", "mb-4");
        questionDiv.id = question.id;

        let questionHTML = `<label for="${question.id}">${question.questionText}</label>`;
        question.options.forEach(option => {
            questionHTML += `
                    <div class="form-check">
                        <button type="button" class="btn btn-outline-primary w-100" onclick="selectAnswer('${question.id}', '${option.toLowerCase()}')">
                            ${option}
                        </button>
                    </div>
                `;
        });

        questionDiv.innerHTML = questionHTML;
        document.getElementById("quiz-container").appendChild(questionDiv);
        resetTimer(); // Reset the timer each time a question is displayed
    }

    // Function to reset and start the countdown timer
    function resetTimer() {
        timeLeft = 10; // Reset the timer to 10 seconds
        document.getElementById("time-left").textContent = timeLeft; // Update the timer display
        clearInterval(timer); // Clear any previous timer
        timer = setInterval(() => {
            timeLeft--;
            document.getElementById("time-left").textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                nextQuestion(); // Automatically go to the next question when time is up
            }
        }, 1000);
    }

    // Function to select an answer and move to the next question
    function selectAnswer(questionId, selectedAnswer) {
        const answerLabel = document.querySelector(`button[onclick="selectAnswer('${questionId}', '${selectedAnswer}')"]`);

        // Add classes or style based on correctness
        if (selectedAnswer === correctAnswers[questionId]) {
            score++;
            correctAnswersCount++; // Increment correct answers count
            answerLabel.classList.add('correct-answer'); // Add green color to correct answer
            answerLabel.classList.remove('incorrect-answer'); // Ensure incorrect color is removed
            answerLabel.style.backgroundColor = "#28a745"; // Green color for correct answer
            answerLabel.style.fontWeight = "bold"; // Bold text for emphasis
        } else {
            answerLabel.classList.add('incorrect-answer'); // Add red color to incorrect answer
            answerLabel.classList.remove('correct-answer'); // Ensure correct color is removed
            answerLabel.style.backgroundColor = "#dc3545"; // Red color for incorrect answer
            answerLabel.style.fontWeight = "bold"; // Bold text for emphasis
        }

        // Update the score display
        document.getElementById('correct-count').textContent = correctAnswersCount;

        // Wait for 2 seconds before showing the next question
        setTimeout(() => {
            // Move to the next question
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                document.getElementById("quiz-container").innerHTML = ''; // Clear previous question
                displayQuestion(questions[currentQuestionIndex]);
            } else {
                clearInterval(timer); // Stop the timer when all questions are displayed
                setTimeout(submitQuiz, 1000); // Submit quiz after 1 second
            }
        }, 2500); // 2 seconds delay
    }

    // Function to submit the quiz and calculate the score
    function submitQuiz() {
        document.getElementById('result').innerHTML = `Vous avez ${correctAnswersCount} sur 10 bonnes réponses.`;
    }

    // Start the quiz by displaying the first question
    displayQuestion(questions[currentQuestionIndex]);
