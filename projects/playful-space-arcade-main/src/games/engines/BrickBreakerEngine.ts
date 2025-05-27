/**
 * Brick Breaker Game Engine
 * Controls the logic and rendering for a brick breaker style game
 */
export class BrickBreakerEngine {
  // Canvas references
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  
  // Game state
  private running: boolean = false;
  private gameOver: boolean = false;
  private win: boolean = false;
  private frameId: number | null = null;
  private score: number = 0;
  private lives: number = 3;
  private level: number = 1;
  
  // Callbacks
  private onScoreChange: (score: number) => void = () => {};
  private onLivesChange: (lives: number) => void = () => {};
  private onGameStateChange: (running: boolean) => void = () => {};
  
  // Ball properties
  private ballRadius: number = 8;
  private ballX: number = 0;
  private ballY: number = 0;
  private ballSpeedX: number = 5;
  private ballSpeedY: number = -5;
  private ballColor: string = 'white';
  
  // Paddle properties
  private paddleHeight: number = 15;
  private paddleWidth: number = 120;
  private paddleX: number = 0;
  private paddleY: number = 0;
  private paddleColor: string = 'white';
  
  // Brick properties
  private brickRowCount: number = 5;
  private brickColumnCount: number = 8;
  private brickWidth: number = 0;
  private brickHeight: number = 25;
  private brickPadding: number = 10;
  private brickOffsetTop: number = 60;
  private brickOffsetLeft: number = 30;
  private bricks: Array<Array<{ x: number, y: number, status: number, color: string }>> = [];
  
  // Colors
  private colors: string[] = [
    'rgb(250,130,130)', // Light Red
    'rgb(255,180,120)', // Light Orange
    'rgb(250,230,130)', // Light Yellow
    'rgb(180,255,140)', // Light Green
    'rgb(130,200,255)', // Light Blue
  ];
  
  // Particles for effects
  private particles: Array<{
    x: number;
    y: number;
    radius: number;
    color: string;
    speedX: number;
    speedY: number;
    ttl: number;
  }> = [];
  
  // Stars for background
  private stars: Array<{
    x: number;
    y: number;
    radius: number;
    opacity: number;
    speed: number;
  }> = [];
  
  /**
   * Initialize the game with canvas and callback functions
   */
  public init(
    canvas: HTMLCanvasElement,
    onScoreChange: (score: number) => void,
    onLivesChange: (lives: number) => void,
    onGameStateChange: (running: boolean) => void
  ): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    this.onScoreChange = onScoreChange;
    this.onLivesChange = onLivesChange;
    this.onGameStateChange = onGameStateChange;
    
    // Set initial positions
    this.resetBall();
    this.paddleX = (canvas.width - this.paddleWidth) / 2;
    this.paddleY = canvas.height - this.paddleHeight - 10;
    
    // Initialize bricks
    this.initBricks();
    
    // Initialize stars
    this.initStars();
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  /**
   * Reset game to initial state
   */
  public resetGame(): void {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.gameOver = false;
    this.win = false;
    this.resetBall();
    this.initBricks();
    this.onScoreChange(this.score);
    this.onLivesChange(this.lives);
  }
  
  /**
   * Start the game loop
   */
  public start(): void {
    if (!this.running) {
      this.running = true;
      this.onGameStateChange(true);
      this.gameLoop();
    }
  }
  
  /**
   * Pause the game
   */
  public pause(): void {
    this.running = false;
    this.onGameStateChange(false);
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }
  
  /**
   * Stop the game and clean up
   */
  public stop(): void {
    this.running = false;
    this.onGameStateChange(false);
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    this.removeEventListeners();
  }
  
  /**
   * Move the paddle to a specific position
   */
  public movePaddle(mouseX: number): void {
    if (!this.canvas) return;
    
    const relativeX = mouseX - this.canvas.getBoundingClientRect().left;
    
    if (relativeX > 0 && relativeX < this.canvas.width) {
      this.paddleX = relativeX - this.paddleWidth / 2;
      
      // Keep paddle within canvas boundaries
      if (this.paddleX < 0) {
        this.paddleX = 0;
      } else if (this.paddleX + this.paddleWidth > this.canvas.width) {
        this.paddleX = this.canvas.width - this.paddleWidth;
      }
    }
  }
  
  /**
   * Handle key press for keyboard controls
   */
  public handleKeyDown(e: KeyboardEvent): void {
    if (!this.canvas) return;
    
    if (e.key === 'ArrowRight' || e.key === 'd') {
      this.paddleX = Math.min(this.paddleX + 25, this.canvas.width - this.paddleWidth);
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
      this.paddleX = Math.max(this.paddleX - 25, 0);
    } else if (e.key === ' ' || e.key === 'Enter') {
      if (this.gameOver || this.win) {
        this.resetGame();
        this.start();
      } else if (!this.running) {
        this.start();
      }
    }
  }
  
  /**
   * Initialize the brick layout for a level
   */
  private initBricks(): void {
    if (!this.canvas) return;
    
    // Calculate brick width based on canvas size
    this.brickWidth = (this.canvas.width - 2 * this.brickOffsetLeft - (this.brickColumnCount - 1) * this.brickPadding) / this.brickColumnCount;
    
    // Create the brick grid
    this.bricks = [];
    for (let c = 0; c < this.brickColumnCount; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.brickRowCount; r++) {
        // Brick positions
        const brickX = c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
        const brickY = r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
        
        // Assign color based on row
        const color = this.colors[r % this.colors.length];
        
        this.bricks[c][r] = { x: brickX, y: brickY, status: 1, color };
      }
    }
  }
  
  /**
   * Initialize stars for the background
   */
  private initStars(): void {
    if (!this.canvas) return;
    
    this.stars = [];
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.1
      });
    }
  }
  
  /**
   * Reset the ball position
   */
  private resetBall(): void {
    if (!this.canvas) return;
    
    this.ballX = this.canvas.width / 2;
    this.ballY = this.canvas.height - this.paddleHeight - this.ballRadius - 20;
    
    // Randomize the ball trajectory slightly each reset
    const angle = Math.random() * Math.PI/4 - Math.PI/8; // -22.5 to +22.5 degrees
    const speed = Math.sqrt(this.ballSpeedX * this.ballSpeedX + this.ballSpeedY * this.ballSpeedY);
    this.ballSpeedX = Math.sin(angle) * speed;
    this.ballSpeedY = -Math.cos(angle) * speed;
  }
  
  /**
   * Add particles for visual effects
   */
  private addParticles(x: number, y: number, count: number, color: string): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      
      this.particles.push({
        x,
        y,
        radius: Math.random() * 3 + 1,
        color,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        ttl: 30 + Math.random() * 30
      });
    }
  }
  
  /**
   * Update all particles
   */
  private updateParticles(): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      p.x += p.speedX;
      p.y += p.speedY;
      p.ttl--;
      
      if (p.ttl <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  /**
   * Draw all particles
   */
  private drawParticles(): void {
    if (!this.ctx) return;
    
    for (const p of this.particles) {
      this.ctx.globalAlpha = p.ttl / 60;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  }
  
  /**
   * Draw the background stars
   */
  private drawStars(): void {
    if (!this.ctx || !this.canvas) return;
    
    // Update and draw stars
    for (const star of this.stars) {
      star.y += star.speed;
      
      // Wrap stars around when they reach the bottom
      if (star.y > this.canvas.height) {
        star.y = 0;
        star.x = Math.random() * this.canvas.width;
      }
      
      this.ctx.globalAlpha = star.opacity;
      this.ctx.fillStyle = 'white';
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  }
  
  /**
   * Draw the ball
   */
  private drawBall(): void {
    if (!this.ctx) return;
    
    // Ball shadow
    this.ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
    this.ctx.shadowBlur = 10;
    
    // Draw the ball
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.ballColor;
    this.ctx.fill();
    this.ctx.closePath();
    
    // Reset shadow
    this.ctx.shadowBlur = 0;
  }
  
  /**
   * Draw the paddle
   */
  private drawPaddle(): void {
    if (!this.ctx) return;
    
    // Paddle shadow
    this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    this.ctx.shadowBlur = 15;
    
    // Draw the paddle with gradient
    const gradient = this.ctx.createLinearGradient(
      this.paddleX, this.paddleY,
      this.paddleX, this.paddleY + this.paddleHeight
    );
    gradient.addColorStop(0, this.paddleColor);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
    
    this.ctx.beginPath();
    this.ctx.roundRect(
      this.paddleX, 
      this.paddleY, 
      this.paddleWidth, 
      this.paddleHeight,
      [5, 5, 0, 0]
    );
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.closePath();
    
    // Reset shadow
    this.ctx.shadowBlur = 0;
  }
  
  /**
   * Draw all the bricks
   */
  private drawBricks(): void {
    if (!this.ctx) return;
    
    for (let c = 0; c < this.brickColumnCount; c++) {
      for (let r = 0; r < this.brickRowCount; r++) {
        const brick = this.bricks[c][r];
        if (brick.status === 1) {
          // Brick shadow
          this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          this.ctx.shadowBlur = 4;
          this.ctx.shadowOffsetY = 2;
          
          // Draw the brick with gradient
          const gradient = this.ctx.createLinearGradient(
            brick.x, brick.y,
            brick.x, brick.y + this.brickHeight
          );
          gradient.addColorStop(0, brick.color);
          gradient.addColorStop(1, this.lightenColor(brick.color, 30));
          
          this.ctx.beginPath();
          this.ctx.roundRect(
            brick.x, 
            brick.y, 
            this.brickWidth, 
            this.brickHeight,
            4
          );
          this.ctx.fillStyle = gradient;
          this.ctx.fill();
          this.ctx.closePath();
          
          // Reset shadow
          this.ctx.shadowBlur = 0;
          this.ctx.shadowOffsetY = 0;
        }
      }
    }
  }
  
  /**
   * Helper to lighten a color
   */
  private lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('rgb(', '').replace(')', '').split(',')[0]);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, num + amt);
    return `rgba(${R}, ${R}, ${R}, 0.7)`;
  }
  
  /**
   * Draw game status texts
   */
  private drawStatusText(): void {
    if (!this.ctx || !this.canvas) return;
    
    // Game messages
    if (this.gameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.font = '48px "Segoe UI", sans-serif';
      this.ctx.fillStyle = 'white';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 24);
      
      this.ctx.font = '24px "Segoe UI", sans-serif';
      this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 24);
      this.ctx.fillText('Press Space to Play Again', this.canvas.width / 2, this.canvas.height / 2 + 60);
    } else if (this.win) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.font = '48px "Segoe UI", sans-serif';
      this.ctx.fillStyle = '#FFDD00';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('LEVEL COMPLETE!', this.canvas.width / 2, this.canvas.height / 2 - 24);
      
      this.ctx.font = '24px "Segoe UI", sans-serif';
      this.ctx.fillStyle = 'white';
      this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 24);
      this.ctx.fillText('Press Space to Continue', this.canvas.width / 2, this.canvas.height / 2 + 60);
    } else if (!this.running) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.font = '36px "Segoe UI", sans-serif';
      this.ctx.fillStyle = 'white';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Press Space to Start', this.canvas.width / 2, this.canvas.height / 2);
    }
  }
  
  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // We'll handle these events in the React component
    // and pass the data to the engine
  }
  
  /**
   * Remove event listeners
   */
  private removeEventListeners(): void {
    // We'll handle these in the React component
  }
  
  /**
   * Detect collisions and update ball physics
   */
  private detectCollisions(): void {
    if (!this.canvas) return;
    
    // Bounce off side walls
    if (this.ballX + this.ballRadius > this.canvas.width || this.ballX - this.ballRadius < 0) {
      this.ballSpeedX = -this.ballSpeedX;
      this.addParticles(this.ballX, this.ballY, 10, 'white');
    }
    
    // Bounce off ceiling
    if (this.ballY - this.ballRadius < 0) {
      this.ballSpeedY = -this.ballSpeedY;
      this.addParticles(this.ballX, this.ballY, 10, 'white');
    }
    
    // Detect paddle collision
    if (
      this.ballY + this.ballRadius > this.paddleY &&
      this.ballY + this.ballRadius < this.paddleY + this.paddleHeight &&
      this.ballX > this.paddleX &&
      this.ballX < this.paddleX + this.paddleWidth
    ) {
      // Calculate where the ball hit the paddle (from -1 to 1)
      const hitPosition = (this.ballX - (this.paddleX + this.paddleWidth / 2)) / (this.paddleWidth / 2);
      
      // Change angle based on where the ball hit the paddle
      const maxAngle = Math.PI / 3; // 60 degrees
      const angle = hitPosition * maxAngle;
      
      // Calculate new velocity
      const speed = Math.sqrt(this.ballSpeedX * this.ballSpeedX + this.ballSpeedY * this.ballSpeedY);
      this.ballSpeedX = Math.sin(angle) * speed;
      this.ballSpeedY = -Math.cos(angle) * Math.abs(speed);
      
      // Add particles for visual effect
      this.addParticles(this.ballX, this.ballY, 15, 'white');
    }
    
    // Detect if ball goes below paddle (lose life)
    if (this.ballY + this.ballRadius > this.canvas.height) {
      this.lives--;
      this.onLivesChange(this.lives);
      
      if (this.lives <= 0) {
        this.gameOver = true;
        this.running = false;
        this.onGameStateChange(false);
      } else {
        this.resetBall();
      }
    }
    
    // Detect brick collisions
    for (let c = 0; c < this.brickColumnCount; c++) {
      for (let r = 0; r < this.brickRowCount; r++) {
        const brick = this.bricks[c][r];
        
        if (brick.status === 1) {
          // Check if ball is inside brick bounds
          if (
            this.ballX > brick.x &&
            this.ballX < brick.x + this.brickWidth &&
            this.ballY > brick.y &&
            this.ballY < brick.y + this.brickHeight
          ) {
            // Collision detected, remove brick
            brick.status = 0;
            
            // Update score
            this.score += 10;
            this.onScoreChange(this.score);
            
            // Add particles at brick position for effect
            this.addParticles(
              brick.x + this.brickWidth / 2,
              brick.y + this.brickHeight / 2,
              20,
              brick.color
            );
            
            // Change ball direction based on which side was hit
            // Calculate the overlap from each side of the brick
            const overlapLeft = this.ballX - brick.x;
            const overlapRight = brick.x + this.brickWidth - this.ballX;
            const overlapTop = this.ballY - brick.y;
            const overlapBottom = brick.y + this.brickHeight - this.ballY;
            
            // Find the smallest overlap
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
            
            // Change direction based on smallest overlap
            if (minOverlap === overlapLeft || minOverlap === overlapRight) {
              this.ballSpeedX = -this.ballSpeedX;
            } else {
              this.ballSpeedY = -this.ballSpeedY;
            }
            
            // Slightly increase ball speed with each brick hit
            const factor = 1.01;
            this.ballSpeedX *= factor;
            this.ballSpeedY *= factor;
            
            // Check if all bricks are gone
            let bricksLeft = false;
            outerLoop: for (let i = 0; i < this.brickColumnCount; i++) {
              for (let j = 0; j < this.brickRowCount; j++) {
                if (this.bricks[i][j].status === 1) {
                  bricksLeft = true;
                  break outerLoop;
                }
              }
            }
            
            if (!bricksLeft) {
              this.win = true;
              this.running = false;
              this.onGameStateChange(false);
              
              // Prepare for next level
              this.level++;
              setTimeout(() => {
                if (this.running) return;
                this.initBricks();
                this.resetBall();
                this.win = false;
              }, 2000);
            }
            
            // Break to avoid multiple collisions in one frame
            break;
          }
        }
      }
    }
  }
  
  /**
   * Main game loop
   */
  private gameLoop(): void {
    if (!this.ctx || !this.canvas || !this.running) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background (gradient)
    const bgGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    bgGradient.addColorStop(0, '#161629');
    bgGradient.addColorStop(1, '#0c0c14');
    this.ctx.fillStyle = bgGradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw stars
    this.drawStars();
    
    // Draw game elements
    this.drawBricks();
    this.drawPaddle();
    this.drawBall();
    this.drawParticles();
    
    // Update particles
    this.updateParticles();
    
    // Detect collisions
    this.detectCollisions();
    
    // Update ball position
    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;
    
    // Draw status text if needed
    this.drawStatusText();
    
    // Continue the game loop
    this.frameId = requestAnimationFrame(() => this.gameLoop());
  }
  
  /**
   * Get the current level
   */
  public getLevel(): number {
    return this.level;
  }
  
  /**
   * Get whether the game is over
   */
  public isGameOver(): boolean {
    return this.gameOver;
  }
  
  /**
   * Get whether the player has won the level
   */
  public isWin(): boolean {
    return this.win;
  }
}
