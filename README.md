# Snake Game - Modern Retro Edition

A modern retro-styled snake game built with vanilla JavaScript, featuring smooth animations, neon aesthetics, and a polished user experience.

## Features

- **Classic Snake Gameplay**: Navigate your snake around the grid, eat food to grow and score points
- **Modern Retro Aesthetics**: Neon colors, pixelated art, glassmorphism effects with smooth animations
- **Difficulty Levels**: Choose between Easy, Medium, and Hard difficulty settings with varying game speeds
- **Score Persistence**: High scores are saved to localStorage and persist across sessions
- **Smooth Controls**: Responsive keyboard controls (arrow keys or WASD)
- **Game States**: Menu, Playing, Paused, and Game Over screens with smooth transitions
- **Particle Effects**: Visual feedback with particle explosions on collisions and food consumption
- **Responsive Design**: Fully responsive on desktop and mobile devices
- **Accessible**: Clean UI with clear instructions and intuitive controls

## How to Play

1. **Start the Game**: Click "Start Game" from the main menu
2. **Select Difficulty**: Choose your preferred difficulty level before starting
3. **Control the Snake**: Use arrow keys or WASD to move your snake:
   - **Arrow Keys**: ↑ ↓ ← →
   - **WASD**: W (up), S (down), A (left), D (right)
4. **Eat Food**: Move the snake's head to the food items (magenta squares) to score points
5. **Grow and Score**: Each food consumed makes your snake longer and adds points to your score
6. **Avoid Collision**: Don't hit the walls or run into yourself
7. **Pause**: Click the "Pause" button to pause the game
8. **Game Over**: When you collide, your final stats will be displayed

## Game Mechanics

- **Grid-Based Movement**: The snake moves on a 20x20 grid
- **Score System**: 
  - Easy: 5 points per food
  - Medium: 10 points per food
  - Hard: 12 points per food
- **Food Spawning**: New food appears randomly on the grid after each piece is eaten
- **Collision Detection**: Game ends on wall collision or self-collision
- **High Score Tracking**: Best score is saved in browser localStorage

## Technical Details

- **Language**: Vanilla JavaScript (ES6+)
- **Rendering**: HTML5 Canvas API
- **Styling**: CSS3 with animations and transitions
- **Storage**: Browser localStorage for high score persistence
- **No Dependencies**: Pure vanilla implementation, no frameworks or build tools required

## File Structure

- `index.html` - Main HTML file with game structure and UI elements
- `styles.css` - Complete styling with neon theme and responsive design
- `game.js` - Game logic, collision detection, and rendering
- `README.md` - This file

## Browser Compatibility

Works on all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript
- CSS3 with backdrop-filter
- localStorage API

## Getting Started

Simply open `index.html` in your web browser. No installation or build process required!

```bash
# Open in your default browser
open index.html

# Or run a local server for best results
python -m http.server 8000
# Then visit http://localhost:8000
```

## Controls

| Action | Keys |
|--------|------|
| Move Up | `↑` or `W` |
| Move Down | `↓` or `S` |
| Move Left | `←` or `A` |
| Move Right | `→` or `D` |
| Pause | `Pause Button` |

## Features Highlights

### Modern Retro Aesthetics
- Neon green, cyan, and magenta color scheme
- Pixelated canvas rendering with smooth animations
- Glassmorphism effects in UI elements
- Animated glowing text effects
- Particle system for visual feedback

### Game States
- **Menu Screen**: Difficulty selection, high score display, and game instructions
- **Playing Screen**: Active game with score tracking
- **Pause Screen**: Temporary game pause with resume option
- **Game Over Screen**: Final statistics, new high score indicator, restart options

### Responsive Design
- Desktop-optimized layout with 400x400px game board
- Mobile-friendly responsive design that adapts to smaller screens
- Touch-friendly button sizes and spacing
- Scales properly on tablets and phones

### Particle Effects
- Food consumption particles (magenta)
- Collision explosion particles (red)
- New high score celebration particles (green/cyan)

## Difficulty Scaling

The game speed and point rewards scale with difficulty:
- **Easy**: Speed 5 (slowest), 5 points per food
- **Medium**: Speed 8 (normal), 10 points per food
- **Hard**: Speed 12 (fastest), 12 points per food

## localStorage Data

The game stores one key in localStorage:
- `snakeHighScore`: Your best score (integer value)

You can clear this data from your browser's developer console with:
```javascript
localStorage.removeItem('snakeHighScore');
```

## Future Enhancement Ideas

- Sound effects
- Leaderboard system
- Different game modes (time attack, endless, etc.)
- Mobile touch controls
- Replay system
- Achievements/badges
- Theme selector (different color schemes)
- Network multiplayer

---

Enjoy the game! 🎮
