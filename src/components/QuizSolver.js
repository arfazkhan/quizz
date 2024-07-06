import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function QuizSolver({ quizData }) {
  const [sentences, setSentences] = useState([]);
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (quizData) {
      const shuffledSentences = shuffleWithoutPerfectSequence(quizData.sentences);
      setSentences(shuffledSentences);
    }
  }, [quizData]);

  const shuffleWithoutPerfectSequence = (arr) => {
    let shuffled;
    do {
      shuffled = [...arr].sort(() => Math.random() - 0.5);
    } while (isInPerfectSequence(shuffled, arr));
    return shuffled;
  };

  const isInPerfectSequence = (shuffled, original) => {
    for (let i = 0; i < shuffled.length; i++) {
      if (shuffled[i].text !== original[i].text) {
        return false;
      }
    }
    return true;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(sentences);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSentences(items);
    calculateScore(items);
  };

  const calculateScore = (currentSentences) => {
    let totalScore = 0;
    let perfectOrder = true;
    const originalLength = quizData.sentences.length;
  
    for (let i = 1; i < originalLength; i++) {
      const currentSentence = currentSentences[i]?.text.trim() || '';
      const prevSentence = currentSentences[i-1]?.text.trim() || '';
  
      const currentIndex = quizData.sentences.findIndex(s => s.text.trim() === currentSentence);
      const prevIndex = quizData.sentences.findIndex(s => s.text.trim() === prevSentence);
      
      if (currentIndex !== -1 && prevIndex !== -1) {
        const difference = currentIndex - prevIndex;
        console.log(`Difference for sentence ${i}: ${currentSentence} - ${prevSentence} = ${difference}`);
  
        if (difference === 1) {
          totalScore += 10;
        } else if (difference > 1) {
          totalScore += 5;
          perfectOrder = false;
        } else {
          totalScore -= 2;
          perfectOrder = false;
        }
      } else {
        console.log(`Sentence ${i} or its predecessor not found in original order`);
        perfectOrder = false;
        totalScore -= 2; // Penalize for missing or unmatched sentences
      }
  
      console.log(`Score after checking pair ${i}:`, totalScore);
    }
  
    if (perfectOrder) {
      totalScore = quizData.dynamicPoints + 20; // Perfect score with fixed bonus
      console.log('Perfect score with bonus:', totalScore);
    } else {
      totalScore = Math.max(0, totalScore); // Ensure score doesn't go below 0
    }
  
    setScore(totalScore);
    console.log('Final calculated score:', totalScore);
  };
  const handleSubmit = () => {
    calculateScore(sentences);
  };

  const getSentenceColor = (sentence) => {
    return sentence.color || 'transparent';
  };

  return (
    <div>
      <h2>Sentence Reordering</h2>
      <div>
        <h3>Instruction</h3>
        <p>{quizData.instruction}</p>
      </div>
      <div>
        <h3>Question</h3>
        <p>{quizData.question}</p>
      </div>
      <div>
        <label>Max Points: {quizData.dynamicPoints + 20}</label>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sentences">
          {(provided) => (
            <ol {...provided.droppableProps} ref={provided.innerRef} style={{ listStyleType: 'none', padding: 0 }}>
              {sentences.map((sentence, index) => (
                <Draggable key={index} draggableId={`sentence-${index}`} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        marginBottom: '10px',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: getSentenceColor(sentence),
                        opacity: snapshot.isDragging ? 0.5 : 1,
                        listStyleType: 'decimal',
                        listStylePosition: 'inside',
                      }}
                    >
                      {sentence.text}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ol>
          )}
        </Droppable>
      </DragDropContext>
      <button onClick={handleSubmit} style={{ marginTop: '20px', padding: '10px 20px' }}>Submit Answer</button>
      {score !== null && <div style={{ marginTop: '20px', fontSize: '18px' }}>Your score: {score} out of {quizData.dynamicPoints + 20}</div>}
    </div>
  );
}

export default QuizSolver;