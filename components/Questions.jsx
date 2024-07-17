import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
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
    const [submitted, setSubmitted] = useState(false); // State to manage submission
    const [score, setScore] = useState(0); // State to manage score

    // Get window size for Confetti
    const { width, height } = useWindowSize();

    // Handle submission of answers
    const submitAnswers = () => {
        setSubmitted(true);
        let correctCount = 0;
        const selectedAnswersArray = questions.map((eachQuestion, index) => {
            const selectedAnswer = eachQuestion.incorrect_answers.concat(eachQuestion.correct_answer)[selectedAnswerIndices[index]];
            const correctAnswer = eachQuestion.correct_answer;
            if (selectedAnswer === correctAnswer) {
                correctCount++;
            }
            return {
                selectedAnswer,
                correctAnswer
            };
        });
        setScore(correctCount);
        console.log('Selected Answers:', selectedAnswersArray.map(answer => ({
            selectedAnswer: answer.selectedAnswer,
            correctAnswer: answer.correctAnswer
        })));
    };

    // Function to fetch questions from API
    const fetchQuestions = async () => {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=5');
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            const data = await response.json();
            console.log(data)
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
                        {eachQuestion.incorrect_answers.concat(eachQuestion.correct_answer).map((answer, answerIndex) => {
                            // Determine if the answer is correct or incorrect after submission
                            const isCorrect = answer === eachQuestion.correct_answer;
                            const isSelected = selectedAnswerIndices[index] === answerIndex;
                            let answerClass = '';
                            if (submitted) {
                                if (isSelected) {
                                    answerClass = isCorrect ? 'correct-answer' : 'incorrect-answer';
                                } else if (isCorrect) {
                                    answerClass = 'correct-answer';
                                }
                            } else {
                                answerClass = isSelected ? 'selected-answer' : '';
                            }
                            return (
                                <label className={`btn-radio ${answerClass}`} key={answerIndex}>
                                    <input
                                        type="radio"
                                        name={`answer-${index}`}
                                        value={answer}
                                        checked={isSelected}
                                        onChange={(event) => handleSelectionChange(event, index, answerIndex)}
                                        disabled={submitted} 
                                    />
                                    <span>{answer}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            ))}

            {!submitted && <button className='start-btn' onClick={submitAnswers} id='submit'>Submit answers</button>}
            
            {submitted && (
                <div className="result">
                    {score === questions.length && <Confetti width={width} height={height} />}
                    <h2>You have scored {score}/{questions.length}</h2>
                    <div className="btns">
                        <button className='restart-btn' id='restart' onClick={() => window.location.reload()}>Retry quiz</button>
                        <button className='restart-btn' id='restart' onClick={() => window.location.href = 'index.html'}>Main menu</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Questions;
