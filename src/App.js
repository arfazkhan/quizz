import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import QuestionUpload from './components/QuestionUpload';
import QuizSolver from './components/QuizSolver';
import Navbar from './components/Navbar';
import Lenis from 'lenis'

const lenis = new Lenis()

lenis.on('scroll', (e) => {
  console.log(e)
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

function App() {
  const [quizData, setQuizData] = useState(null);

  return (

    <Router>
          <Navbar />
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Upload Question</Link></li>
            <li><Link to="/solve">Solve Quiz</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<QuestionUpload setQuizData={setQuizData} />} />
          <Route path="/solve" element={quizData ? <QuizSolver quizData={quizData} /> : <div>Please upload a question first</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;