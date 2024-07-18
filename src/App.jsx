import { useState } from 'react'

function App() {

  function execute() {
    window.location.href = "quizPage.html";
}


  return (
    <>
      <div className='title-div'>
        <h1 className='title'>QUIZZICAL</h1>
        <button onClick={execute} id='startBtn'>Start quiz</button>
      </div>
  </>
  )
}

export default App
