import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [stories, setStories] = useState([]);
  const [isViewing, setIsViewing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // NEW: Track which way the user is navigating
  const [direction, setDirection] = useState('next'); 

  useEffect(() => {
    fetch('/stories.json')
      .then(res => res.json())
      .then(data => setStories(data))
      .catch(err => console.error("Failed to load stories", err));
  }, []);

  useEffect(() => {
    let timer;
    if (isViewing && !isLoading) {
      timer = setTimeout(() => {
        handleNext();
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [currentIndex, isViewing, isLoading]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setDirection('next'); // Set direction to next
      setIsLoading(true);
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsViewing(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection('prev'); // Set direction to prev
      setIsLoading(true);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const openStory = (index) => {
    setDirection('none');
    setCurrentIndex(index);
    setIsLoading(true);
    setIsViewing(true);
  };

  return (
    <div className="mobile-container">
      <div className="story-list">
        {stories.map((story, index) => (
          <div key={story.id} className="story-thumbnail" onClick={() => openStory(index)}>
            <img src={story.avatar} alt={`${story.author}'s avatar`} />
            <p>{story.author}</p>
          </div>
        ))}
      </div>

      {isViewing && stories.length > 0 && (
        <div className="story-viewer">
          {isLoading && <div className="loader">Loading...</div>}
          
          <img 
            // THE MAGIC: Changing the key forces React to replay the animation
            key={currentIndex} 
            className={`story-image ${direction}`}
            src={stories[currentIndex].imageUrl} 
            alt="Story content"
            style={{ display: isLoading ? 'none' : 'block' }}
            onLoad={() => setIsLoading(false)} 
          />

          <div className="tap-zone left" onClick={handlePrev} />
          <div className="tap-zone right" onClick={handleNext} />
          
          <button className="close-btn" onClick={() => setIsViewing(false)}>✕</button>
        </div>
      )}
    </div>
  );
}