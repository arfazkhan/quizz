import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/QuestionUpload.css';

const colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#FF5733", "#57FF33", "transparent"];

function QuestionUpload({ setQuizData }) {
    const [instruction, setInstruction] = useState('');
    const [question, setQuestion] = useState('');
    const [sentences, setSentences] = useState([{ text: '', color: '' }, { text: '', color: '' }]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [dynamicPoints, setDynamicPoints] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        calculateDynamicPoints();
    }, [sentences]);

    const handleSentenceChange = (index, value) => {
        const newSentences = [...sentences];
        newSentences[index].text = value;
        setSentences(newSentences);
        calculateDynamicPoints();
    };

    const handleColorChange = (index, color) => {
        const newSentences = [...sentences];
        newSentences[index].color = color;
        setSentences(newSentences);
    };

    const addSentenceField = () => {
        setSentences([...sentences, { text: '', color: '' }]);
    };

    const calculateDynamicPoints = () => {
        let points = 0;
        setError('');

        for (let i = 1; i < sentences.length; i++) {
            const prevSentence = sentences[i - 1].text.trim();
            const currentSentence = sentences[i].text.trim();

            if (prevSentence && currentSentence) {
                const difference = i - (i - 1);
                if (difference === 1) {
                    points += 10;
                } else if (difference > 1) {
                    points += 5;
                } else {
                    points -= 2;
                }
            }
        }

        setDynamicPoints(points);
        setTotalPoints(points);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (error) {
            alert('Please fix the errors before submitting.');
            return;
        }

        // Filter out empty sentences
        const nonEmptySentences = sentences.filter(sentence => sentence.text.trim() !== '');

        if (nonEmptySentences.length < 2) {
            setError('Please add at least two sentences.');
            return;
        }

        const quizData = {
            instruction,
            question,
            sentences: nonEmptySentences,
            totalPoints,
            dynamicPoints
        };
        setQuizData(quizData);
        navigate('/solve');
    };

    return (
        <form onSubmit={handleSubmit} className="question-upload-form">
            <h2>Sentence Reordering</h2>
            <div className="points-container">
                <label>Total Points: {totalPoints}</label>
                <label>Question Points: {dynamicPoints}</label>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="input-container">
                <label htmlFor="instruction">Instruction:</label>
                <textarea 
                    id="instruction" 
                    value={instruction} 
                    onChange={(e) => setInstruction(e.target.value)}
                    rows="1"
                    cols="50"
                />
            </div>
            <div className="input-container">
                <label htmlFor="question">Question:</label>
                <textarea 
                    id="question" 
                    value={question} 
                    onChange={(e) => setQuestion(e.target.value)}
                    rows="1"
                    cols="50"
                />
            </div>
            <div className="sentences-container">
                <label>Sentences:</label>
                {sentences.map((sentence, index) => (
                    <div key={index} className="sentence-row">
                        <span>{index + 1}. </span>
                        <textarea 
                            value={sentence.text} 
                            onChange={(e) => handleSentenceChange(index, e.target.value)}
                            rows="0"
                            cols="100"
                            className="sentence-textarea"
                            style={{ backgroundColor: sentence.color }}
                        />
                        <div className="color-options">
                            {colors.map((color, colorIndex) => (
                                <div 
                                    key={colorIndex} 
                                    onClick={() => handleColorChange(index, color)} 
                                    className="color-option"
                                    style={{
                                        backgroundColor: color, 
                                        border: sentence.color === color ? '2px solid black' : '1px solid gray'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
                <button className='add-sentence-button' type="button" onClick={addSentenceField} cols="80">+ Add Sentence</button>
            </div>
            <button type="submit" className="submit-button">Create Quiz</button>
        </form>
    );
}

export default QuestionUpload;