
/**
 * Flappy Bird Game Engine
 * 
 * Controls the game logic for the Flappy Bird game
 */
export class FlappyBirdEngine {
  // Canvas elements
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  
  // Game state
  private gameState: 'start' | 'play' | 'end' = 'start';
  private score: number = 0;
  private highScore: number = 0;
  private gravity: number = 0.5;
  private speed: number = 3;
  private animationId: number | null = null;
  
  // Bird properties
  private birdX: number = 0;
  private birdY: number = 0;
  private birdWidth: number = 40;
  private birdHeight: number = 30;
  private birdDY: number = 0;
  
  // Pipes
  private pipes: {
    x: number;
    topHeight: number;
    bottomY: number;
    counted: boolean;
  }[] = [];
  private pipeWidth: number = 60;
  private pipeGap: number = 160;
  private pipeSpawnInterval: number = 90;
  private frameCount: number = 0;
  
  // Callbacks
  private setScoreCallback: (score: number) => void = () => {};
  private setIsRunningCallback: (isRunning: boolean) => void = () => {};

  /**
   * Initialize the game with the canvas and callbacks
   */
  init(
    canvas: HTMLCanvasElement, 
    setScore: (score: number) => void,
    setIsRunning: (isRunning: boolean) => void
  ): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    this.setScoreCallback = setScore;
    this.setIsRunningCallback = setIsRunning;
    
    // Initialize bird position
    this.birdX = canvas.width / 3;
    this.birdY = canvas.height / 2;
    
    // Set up keyboard event listeners
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('touchstart', this.handleTouchStart);
    
    // Initial game state
    this.resetGame();
  }
  
  /**
   * Start the game
   */
  start(): void {
    if (this.gameState === 'end') {
      this.resetGame();
    }
    
    this.gameState = 'play';
    this.setIsRunningCallback(true);
    this.gameLoop();
  }
  
  /**
   * Stop the game and clean up event listeners
   */
  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('touchstart', this.handleTouchStart);
    
    this.setIsRunningCallback(false);
  }
  
  /**
   * Reset the game state for a new game
   */
  resetGame(): void {
    this.gameState = 'start';
    this.score = 0;
    this.setScoreCallback(this.score);
    this.birdY = this.canvas ? this.canvas.height / 2 : 0;
    this.birdDY = 0;
    this.pipes = [];
    this.frameCount = 0;
  }
  
  /**
   * Handle keyboard events
   */
  private handleKeyDown = (e: KeyboardEvent): void => {
    // Start game on Enter key if not already playing
    if ((e.key === 'Enter' || e.key === ' ') && this.gameState === 'start') {
      this.start();
      e.preventDefault();
      return;
    }
    
    // Restart game on Enter key if game over
    if (e.key === 'Enter' && this.gameState === 'end') {
      this.resetGame();
      this.start();
      e.preventDefault();
      return;
    }
    
    // Jump on space or arrow up
    if ((e.key === 'ArrowUp' || e.key === ' ') && this.gameState === 'play') {
      this.jump();
      e.preventDefault();
    }
  };
  
  /**
   * Handle touch events for mobile
   */
  private handleTouchStart = (e: TouchEvent): void => {
    if (this.gameState === 'start') {
      this.start();
    } else if (this.gameState === 'end') {
      this.resetGame();
      this.start();
    } else if (this.gameState === 'play') {
      this.jump();
    }
    e.preventDefault();
  };
  
  /**
   * Make the bird jump
   */
  private jump(): void {
    this.birdDY = -8;
  }
  
  /**
   * Main game loop
   */
  private gameLoop = (): void => {
    this.update();
    this.draw();
    
    if (this.gameState === 'play') {
      this.animationId = requestAnimationFrame(this.gameLoop);
    } else {
      this.setIsRunningCallback(false);
    }
  };
  
  /**
   * Update game state
   */
  private update(): void {
    if (this.gameState !== 'play' || !this.canvas) return;
    
    // Update bird position with gravity
    this.birdDY += this.gravity;
    this.birdY += this.birdDY;
    
    // Check if bird hit the ground or ceiling
    if (this.birdY + this.birdHeight >= this.canvas.height || this.birdY <= 0) {
      this.gameOver();
      return;
    }
    
    // Spawn new pipes
    this.frameCount++;
    if (this.frameCount >= this.pipeSpawnInterval) {
      this.spawnPipe();
      this.frameCount = 0;
    }
    
    // Update pipes position
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipe = this.pipes[i];
      pipe.x -= this.speed;
      
      // Remove pipes that are off-screen
      if (pipe.x + this.pipeWidth < 0) {
        this.pipes.splice(i, 1);
        continue;
      }
      
      // Check for collisions with pipes
      if (
        this.birdX + this.birdWidth > pipe.x && 
        this.birdX < pipe.x + this.pipeWidth && 
        (this.birdY < pipe.topHeight || this.birdY + this.birdHeight > pipe.bottomY)
      ) {
        this.gameOver();
        return;
      }
      
      // Increment score when bird passes a pipe
      if (!pipe.counted && this.birdX > pipe.x + this.pipeWidth) {
        pipe.counted = true;
        this.score++;
        this.setScoreCallback(this.score);
        
        // Update high score
        if (this.score > this.highScore) {
          this.highScore = this.score;
        }
      }
    }
  }
  
  /**
   * Spawn a new pipe
   */
  private spawnPipe(): void {
    if (!this.canvas) return;
    
    const minHeight = 50; // Minimum pipe height
    const maxHeight = this.canvas.height - this.pipeGap - minHeight;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
    const bottomY = topHeight + this.pipeGap;
    
    this.pipes.push({
      x: this.canvas.width,
      topHeight,
      bottomY,
      counted: false
    });
  }
  
  /**
   * End the game
   */
  private gameOver(): void {
    this.gameState = 'end';
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  /**
   * Draw the game
   */
  private draw(): void {
    if (!this.canvas || !this.ctx) return;
    
    // Clear canvas
    this.ctx.fillStyle = '#87CEEB'; // Sky blue background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw ground
    this.ctx.fillStyle = '#654321'; // Brown color
    this.ctx.fillRect(0, this.canvas.height - 20, this.canvas.width, 20);
    this.ctx.fillStyle = '#7CFC00'; // Lawn green
    this.ctx.fillRect(0, this.canvas.height - 20, this.canvas.width, 5);
    
    // Draw pipes
    this.ctx.fillStyle = '#32CD32'; // Lime green
    for (const pipe of this.pipes) {
      // Top pipe
      this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);
      // Bottom pipe
      this.ctx.fillRect(pipe.x, pipe.bottomY, this.pipeWidth, this.canvas.height - pipe.bottomY);
      
      // Pipe caps
      this.ctx.fillStyle = '#228B22'; // Forest green
      this.ctx.fillRect(pipe.x - 3, pipe.topHeight - 15, this.pipeWidth + 6, 15);
      this.ctx.fillRect(pipe.x - 3, pipe.bottomY, this.pipeWidth + 6, 15);
      this.ctx.fillStyle = '#32CD32'; // Reset to lime green
    }
    
    // Draw bird
    this.drawBird();
    
    // Draw score
    this.ctx.fillStyle = 'white';
    this.ctx.font = '24px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    
    // Draw high score
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`High Score: ${this.highScore}`, this.canvas.width - 10, 30);
    
    // Draw game state messages
    if (this.gameState === 'start') {
      this.drawCenteredText('Press Enter or Tap to Start', 30);
    } else if (this.gameState === 'end') {
      this.drawCenteredText('Game Over', 40);
      this.drawCenteredText(`Score: ${this.score}`, 28, 50);
      this.drawCenteredText('Press Enter or Tap to Restart', 24, 90);
    }
  }
  
  /**
   * Draw the bird with rotation based on velocity
   */
  private drawBird(): void {
    if (!this.ctx) return;
    
    const rotation = Math.min(Math.max(-25, this.birdDY * 3), 50) * Math.PI / 180;
    
    this.ctx.save();
    this.ctx.translate(this.birdX + this.birdWidth / 2, this.birdY + this.birdHeight / 2);
    this.ctx.rotate(rotation);
    
    // Bird body
    this.ctx.fillStyle = '#FFD700'; // Gold
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, this.birdWidth / 2, this.birdHeight / 2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Wings
    this.ctx.fillStyle = '#FFA500'; // Orange
    this.ctx.beginPath();
    this.ctx.ellipse(-5, 0, this.birdWidth / 3, this.birdHeight / 4, Math.PI / 4, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Eye
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(this.birdWidth / 4, -this.birdHeight / 6, 5, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = 'black';
    this.ctx.beginPath();
    this.ctx.arc(this.birdWidth / 4, -this.birdHeight / 6, 2, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Beak
    this.ctx.fillStyle = '#FF6347'; // Tomato color
    this.ctx.beginPath();
    this.ctx.moveTo(this.birdWidth / 2, -2);
    this.ctx.lineTo(this.birdWidth / 2 + 10, 0);
    this.ctx.lineTo(this.birdWidth / 2, 2);
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.restore();
  }
  
  /**
   * Draw centered text
   */
  private drawCenteredText(text: string, fontSize: number, yOffset: number = 0): void {
    if (!this.canvas || !this.ctx) return;
    
    this.ctx.font = `${fontSize}px sans-serif`;
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 3;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2 + yOffset;
    
    this.ctx.strokeText(text, x, y);
    this.ctx.fillText(text, x, y);
  }
}
