import React, { useState, useEffect } from 'react';
import './quizPage.css'; // Import regular CSS file

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}


function Questions() {
    // State to store questions and selected answer indices
    const [questions, setQuestions] = useState([]);
    const [selectedAnswerIndices, setSelectedAnswerIndices] = useState([]); // Array to track selected answer indices

    // Handle submission of answers
const submitAnswers = () => {
    const selectedAnswersArray = questions.map((eachQuestion, index) => ({
        selectedAnswer: eachQuestion.incorrect_answers.concat(eachQuestion.correct_answer)[selectedAnswerIndices[index]]
    }));
    console.log('Selected Answers:', selectedAnswersArray);
};

    // Function to fetch questions from API
    const fetchQuestions = async () => {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=10');
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            const data = await response.json();
            // Decode HTML entities in questions    
            const decodedQuestions = data.results.map(question => ({
                ...question,
                question: decodeHtml(question.question),
                correct_answer: decodeHtml(question.correct_answer),
                incorrect_answers: question.incorrect_answers.map(answer => decodeHtml(answer))
            }));
            // Initialize selected answer indices for each question
            const initialSelectedIndices = decodedQuestions.map(() => -1);
            setSelectedAnswerIndices(initialSelectedIndices);
            setQuestions(decodedQuestions);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    // Fetch questions from API when component mounts
    useEffect(() => {
        fetchQuestions();
    }, []);

    // Handle radio button selection
    const handleSelectionChange = (event, questionIndex, answerIndex) => {
        // Create a copy of selectedAnswerIndices
        const updatedSelectedIndices = [...selectedAnswerIndices];
        // Update the selected index for the specific question
        updatedSelectedIndices[questionIndex] = answerIndex;
        setSelectedAnswerIndices(updatedSelectedIndices);
        console.log('Selected answer for question', questionIndex, ':', event.target.value);
    };

    return (
        <div className="main-container">
            {questions.map((eachQuestion, index) => (
                <div className="qContainer" key={index}>
                    <h2>{eachQuestion.question}</h2>
                    <div className="options">
                        {eachQuestion.incorrect_answers.concat(eachQuestion.correct_answer).map((answer, answerIndex) => (
                            <label className="btn-radio" key={answerIndex}>
                                <input
                                    type="radio"
                                    name={`answer-${index}`}
                                    value={answer}
                                    checked={selectedAnswerIndices[index] === answerIndex}
                                    onChange={(event) => handleSelectionChange(event, index, answerIndex)}
                                    className={selectedAnswerIndices[index] === answerIndex ? 'selected-answer' : ''}
                                />
                                <span>{answer}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            <button className='start-btn' onClick={submitAnswers} id='submit'>Submit answers</button>
        </div>
    );
}

export default Questions;
