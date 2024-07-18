import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import './quizPage.css'; // Import regular CSS file

function Questions({ questions, onRestartQuiz }) {
    // State to store selected answer indices
    const [selectedAnswerIndices, setSelectedAnswerIndices] = useState([]); // Array to track selected answer indices
    const [submitted, setSubmitted] = useState(false); // State to manage submission
    const [score, setScore] = useState(0); // State to manage score

    // Get window size for Confetti
    const { width, height } = useWindowSize();

    // Initialize selected answer indices when questions change
    useEffect(() => {
        const initialSelectedIndices = questions.map(() => -1);
        setSelectedAnswerIndices(initialSelectedIndices);
        setSubmitted(false);
        setScore(0);
    }, [questions]);

    // Handle submission of answers
    const submitAnswers = () => {
        setSubmitted(true);
        let correctCount = 0;
        questions.forEach((eachQuestion, index) => {
            const selectedAnswer = eachQuestion.incorrect_answers.concat(eachQuestion.correct_answer)[selectedAnswerIndices[index]];
            if (selectedAnswer === eachQuestion.correct_answer) {
                correctCount++;
            }
        });
        setScore(correctCount);
    };

    // Handle radio button selection
    const handleSelectionChange = (event, questionIndex, answerIndex) => {
        // Create a copy of selectedAnswerIndices
        const updatedSelectedIndices = [...selectedAnswerIndices];
        // Update the selected index for the specific question
        updatedSelectedIndices[questionIndex] = answerIndex;
        setSelectedAnswerIndices(updatedSelectedIndices);
    };

    return (
        <div id='main-div'>
            <h1 className='title'>QUIZZICAL</h1>
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
            </div>
            <div className='btn-container'>
                {!submitted && <button className='start-btn' onClick={submitAnswers} id='submit'>Submit answers</button>}
                {submitted && (
                    <div className="result">
                        {score === questions.length && <Confetti width={width} height={height} />}
                        <h2>You have scored {score}/{questions.length}</h2>
                            <button className='restart-btn' id='restart' onClick={onRestartQuiz}>Retry quiz</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Questions;
