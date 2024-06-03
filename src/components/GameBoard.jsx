import React, { useState } from 'react';
import Tube from './Tube';
import './GameBoard.scss';
import colors from './colors';

/**
 * Generates the initial state of the game board with tubes containing random colors.
 * @returns {Array} Array of tubes with colors and two empty tubes.
 */
const generateInitialTubes = () => {
  // Select 4 random colors
  const selectedColors = [];
  const colorsCopy = [...colors];
  
  while (selectedColors.length < 4) {
    const randomIndex = Math.floor(Math.random() * colorsCopy.length);
    selectedColors.push(colorsCopy.splice(randomIndex, 1)[0]);
  }

  // Initialize color count and tubes array
  const colorCount = selectedColors.reduce((acc, color) => {
    acc[color] = 0;
    return acc;
  }, {});

  const tubes = Array.from({ length: 4 }, () => []);

  // Populate each tube with 4 random colors
  tubes.forEach(tube => {
    const tubeColors = [];
    
    while (tubeColors.length < 4) {
      const randomColor = selectedColors[Math.floor(Math.random() * selectedColors.length)];
      if (tubeColors.includes(randomColor) || colorCount[randomColor] >= 4) continue;
      
      tubeColors.push(randomColor);
      colorCount[randomColor]++;
    }
    
    tubeColors.reverse(); // Reverse to simulate pouring from bottom
    tube.unshift(...tubeColors);
  });

  // Add two empty tubes
  tubes.push([], []);

  return tubes;
};

/**
 * GameBoard component represents the main game logic and UI.
 */
const GameBoard = () => {
  const [tubes, setTubes] = useState(generateInitialTubes());
  const [selectedTube, setSelectedTube] = useState(null);

  /**
   * Handles the click event on a tube.
   * @param {number} index - The index of the clicked tube.
   */
  const handleTubeClick = (index) => {
    if (selectedTube === null) {
      setSelectedTube(index);
    } else {
      if (selectedTube !== index) {
        const newTubes = [...tubes];
        const fromTube = newTubes[selectedTube];
        const toTube = newTubes[index];

        if (fromTube.length > 0) {
          const fromColor = fromTube[fromTube.length - 1];
          let count = 1;

          // Count contiguous same colors from the top
          for (let i = fromTube.length - 2; i >= 0; i--) {
            if (fromTube[i] === fromColor) {
              count++;
            } else {
              break;
            }
          }

          // Transfer colors if valid move
          if (toTube.length + count <= 4 && (toTube.length === 0 || toTube[toTube.length - 1] === fromColor)) {
            for (let i = 0; i < count; i++) {
              toTube.push(fromTube.pop());
            }
            setTubes(newTubes);
            checkVictory(newTubes);
          }
        }
      }
      setSelectedTube(null);
    }
  };

 /**
 * Checks if the victory condition is met.
 * @param {Array} tubes - The current state of the tubes.
 */
  const checkVictory = (tubes) => {
    const isVictory = tubes.every(tube => tube.length === 0 || (tube.length === 4 && new Set(tube).size === 1));
    if (isVictory) {
      setTimeout(() => {
        alert('Victory!');
        setTubes(generateInitialTubes()); // Reset the game
      }, 500); // Delay to allow animation to complete
    }
  };

  return (
    <div className="game-board">
      {tubes.map((tube, index) => (
        <Tube
          key={index}
          tube={tube}
          onClick={() => handleTubeClick(index)}
          isSelected={selectedTube === index}
        />
      ))}
    </div>
  );
};

export default GameBoard;
