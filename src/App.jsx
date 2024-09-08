import React, { useState } from 'react';
import MainPage from '../components/MainPage';
import Questions from '../components/Questions';

function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function App() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Function to handle starting the quiz
  const startQuiz = () => {
    fetchQuestions();
    setShowQuiz(true);
  };

  // Function to fetch questions
  const fetchQuestions = async () => {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10&difficulty=easy');
      // https://opentdb.com/api.php?amount=5
      const data = await response.json();
      
      // Decode HTML entities in questions and answers
      const decodedQuestions = data.results.map(question => ({
        ...question,
        question: decodeHtml(question.question),
        correct_answer: decodeHtml(question.correct_answer),
        incorrect_answers: question.incorrect_answers.map(answer => decodeHtml(answer))
      }));
      
      setQuestions(decodedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // Function to handle restarting the quiz
  const restartQuiz = () => {
    fetchQuestions();
  };

  return (
    <div className="app-container">
      {!showQuiz && <MainPage onStartQuiz={startQuiz} />} {/* Render MainPage if showQuiz is false */}
      {showQuiz && <Questions questions={questions} onRestartQuiz={restartQuiz} />} {/* Render Questions if showQuiz is true */}
    </div>
  );
}

export default App;
