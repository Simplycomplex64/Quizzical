import React from 'react';
import './mainPage.css';

function MainPage({ onStartQuiz }) {
  return (
    <div className='title-div'>
      <h1 className='title'>QUIZZICAL</h1>
      <button onClick={onStartQuiz} id='startBtn'>Start quiz</button>
    </div>
  );
}

export default MainPage;
