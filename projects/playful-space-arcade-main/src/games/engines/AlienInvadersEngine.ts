
// Class implementation of the Alien Invaders game logic
export class AlienInvadersEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;
  
  // Game settings
  private readonly ALIEN_ROWS: number = 5;
  private readonly ALIEN_COLS: number = 10;
  private readonly ALIEN_WIDTH: number = 35;
  private readonly ALIEN_HEIGHT: number = 35;
  private readonly ALIEN_PADDING: number = 20;
  
  // Game state
  private player = { 
    x: 400, 
    y: 550, 
    width: 50, 
    height: 20, 
    speed: 8 
  };
  private projectiles: { x: number, y: number, width: number, height: number, speed: number }[] = [];
  private aliens: { x: number, y: number, width: number, height: number, alive: boolean }[] = [];
  private alienDirection: number = 1;
  private alienSpeed: number = 1;
  private alienProjectiles: { x: number, y: number, width: number, height: number, speed: number }[] = [];
  private keysPressed: { [key: string]: boolean } = {};
  private lastShot: number = 0;
  private shotCooldown: number = 300; // ms
  private score: number = 0;
  private lives: number = 3;
  private level: number = 1;
  private gameOver: boolean = false;
  
  // Callback functions
  private onScoreChange: (score: number) => void = () => {};
  private onLivesChange: (lives: number) => void = () => {};
  private onGameStateChange: (isRunning: boolean) => void = () => {};
  
  constructor() {
    // Initialize key bindings
    this.keysPressed = { ArrowLeft: false, ArrowRight: false, " ": false };
  }
  
  // Initialize the game
  public init(
    canvas: HTMLCanvasElement, 
    onScoreChange: (score: number) => void,
    onLivesChange: (lives: number) => void,
    onGameStateChange: (isRunning: boolean) => void
  ): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onScoreChange = onScoreChange;
    this.onLivesChange = onLivesChange;
    this.onGameStateChange = onGameStateChange;
    
    // Set up event listeners
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    
    this.resetGame();
  }
  
  // Reset game state
  public resetGame(): void {
    if (!this.canvas) return;
    
    // Reset player
    this.player = { 
      x: this.canvas.width / 2 - 25, 
      y: 550, 
      width: 50, 
      height: 20, 
      speed: 8 
    };
    
    // Reset projectiles
    this.projectiles = [];
    this.alienProjectiles = [];
    
    // Initialize aliens
    this.aliens = [];
    for (let row = 0; row < this.ALIEN_ROWS; row++) {
      for (let col = 0; col < this.ALIEN_COLS; col++) {
        this.aliens.push({
          x: col * (this.ALIEN_WIDTH + this.ALIEN_PADDING) + 50,
          y: row * (this.ALIEN_HEIGHT + this.ALIEN_PADDING) + 50,
          width: this.ALIEN_WIDTH,
          height: this.ALIEN_HEIGHT,
          alive: true
        });
      }
    }
    
    // Reset game state
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.alienDirection = 1;
    this.alienSpeed = 1;
    this.gameOver = false;
    
    // Update UI
    this.onScoreChange(this.score);
    this.onLivesChange(this.lives);
    this.onGameStateChange(true);
  }
  
  // Start the game loop
  public start(): void {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.gameLoop();
  }
  
  // Stop the game
  public stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
  
  // Key event handlers
  private handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      this.keysPressed[e.key] = true;
    }
    
    // Restart on game over
    if (this.gameOver && e.key === ' ') {
      this.resetGame();
    }
    
    // Exit on Escape
    if (e.key === 'Escape') {
      this.stop();
    }
  };
  
  private handleKeyUp = (e: KeyboardEvent): void => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ') {
      this.keysPressed[e.key] = false;
    }
  };
  
  // Main game loop
  private gameLoop = (): void => {
    this.update();
    this.draw();
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };
  
  // Update game state
  private update(): void {
    if (!this.canvas || this.gameOver) return;
    
    // Update player position based on keys pressed
    if (this.keysPressed.ArrowLeft) {
      this.player.x = Math.max(0, this.player.x - this.player.speed);
    }
    if (this.keysPressed.ArrowRight) {
      this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + this.player.speed);
    }
    
    // Handle player shooting
    const now = Date.now();
    if (this.keysPressed[" "] && now - this.lastShot > this.shotCooldown) {
      this.projectiles.push({
        x: this.player.x + this.player.width / 2 - 2,
        y: this.player.y,
        width: 4,
        height: 15,
        speed: 7
      });
      this.lastShot = now;
    }
    
    // Update projectiles
    this.projectiles = this.projectiles.filter(projectile => {
      projectile.y -= projectile.speed;
      
      // Remove projectiles that go off screen
      if (projectile.y < 0) return false;
      
      // Check for collisions with aliens
      for (const alien of this.aliens) {
        if (alien.alive && this.checkCollision(projectile, alien)) {
          alien.alive = false;
          this.score += 10;
          this.onScoreChange(this.score);
          return false;
        }
      }
      
      return true;
    });
    
    // Update alien projectiles
    this.alienProjectiles = this.alienProjectiles.filter(projectile => {
      projectile.y += projectile.speed;
      
      // Remove projectiles that go off screen
      if (projectile.y > this.canvas.height) return false;
      
      // Check for collision with player
      if (this.checkCollision(projectile, this.player)) {
        this.lives -= 1;
        this.onLivesChange(this.lives);
        if (this.lives <= 0) {
          this.gameOver = true;
          this.onGameStateChange(false);
        }
        return false;
      }
      
      return true;
    });
    
    // Alien shooting logic - random alien shoots
    if (Math.random() < 0.01 && this.aliens.some(alien => alien.alive)) {
      const livingAliens = this.aliens.filter(alien => alien.alive);
      const randomAlien = livingAliens[Math.floor(Math.random() * livingAliens.length)];
      
      this.alienProjectiles.push({
        x: randomAlien.x + randomAlien.width / 2 - 2,
        y: randomAlien.y + randomAlien.height,
        width: 4,
        height: 15,
        speed: 5
      });
    }
    
    // Update aliens position
    let shouldChangeDirection = false;
    let aliensAlive = false;
    
    // Check if aliens hit the edge of the canvas
    for (const alien of this.aliens) {
      if (!alien.alive) continue;
      
      aliensAlive = true;
      alien.x += this.alienSpeed * this.alienDirection;
      
      // Check if aliens hit the edge
      if (alien.x < 0 || alien.x + alien.width > this.canvas.width) {
        shouldChangeDirection = true;
      }
      
      // Check if aliens reached the bottom
      if (alien.y + alien.height > this.player.y) {
        // Game over if aliens reach the bottom
        this.lives = 0;
        this.onLivesChange(this.lives);
        this.gameOver = true;
        this.onGameStateChange(false);
      }
    }
    
    // Change alien direction and move them down if they hit the edge
    if (shouldChangeDirection) {
      for (const alien of this.aliens) {
        if (alien.alive) {
          alien.y += 30;
        }
      }
      this.alienDirection *= -1;
    }
    
    // Next level when all aliens are destroyed
    if (!aliensAlive) {
      this.level += 1;
      this.alienSpeed += 0.5;
      
      // Reset alien positions for next level
      this.aliens = [];
      for (let row = 0; row < this.ALIEN_ROWS; row++) {
        for (let col = 0; col < this.ALIEN_COLS; col++) {
          this.aliens.push({
            x: col * (this.ALIEN_WIDTH + this.ALIEN_PADDING) + 50,
            y: row * (this.ALIEN_HEIGHT + this.ALIEN_PADDING) + 50,
            width: this.ALIEN_WIDTH,
            height: this.ALIEN_HEIGHT,
            alive: true
          });
        }
      }
    }
  }
  
  // Collision detection
  private checkCollision(a: { x: number, y: number, width: number, height: number }, 
                        b: { x: number, y: number, width: number, height: number }): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
  
  // Draw game elements
  private draw(): void {
    if (!this.canvas || !this.ctx) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background (dark space)
    this.ctx.fillStyle = '#121212';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw stars in background
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const size = Math.random() * 2;
      this.ctx.fillRect(x, y, size, size);
    }
    
    // Draw player spaceship (triangular shape)
    this.ctx.fillStyle = '#FFD700'; // Gold color
    this.ctx.beginPath();
    this.ctx.moveTo(this.player.x + this.player.width / 2, this.player.y);
    this.ctx.lineTo(this.player.x, this.player.y + this.player.height);
    this.ctx.lineTo(this.player.x + this.player.width, this.player.y + this.player.height);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Add engine glow effect
    this.ctx.fillStyle = 'rgba(255, 100, 0, 0.7)';
    this.ctx.beginPath();
    this.ctx.moveTo(this.player.x + this.player.width * 0.3, this.player.y + this.player.height);
    this.ctx.lineTo(this.player.x + this.player.width * 0.4, this.player.y + this.player.height + 5);
    this.ctx.lineTo(this.player.x + this.player.width * 0.6, this.player.y + this.player.height + 5);
    this.ctx.lineTo(this.player.x + this.player.width * 0.7, this.player.y + this.player.height);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Draw aliens with more detail
    for (const alien of this.aliens) {
      if (!alien.alive) continue;
      
      // Alien body (green)
      this.ctx.fillStyle = '#50C878'; // Emerald green
      this.ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
      
      // Alien eyes (black)
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(alien.x + alien.width * 0.2, alien.y + alien.height * 0.25, alien.width * 0.15, alien.height * 0.15);
      this.ctx.fillRect(alien.x + alien.width * 0.65, alien.y + alien.height * 0.25, alien.width * 0.15, alien.height * 0.15);
      
      // Alien mouth (black)
      this.ctx.fillRect(alien.x + alien.width * 0.3, alien.y + alien.height * 0.6, alien.width * 0.4, alien.height * 0.15);
      
      // Alien antennas
      this.ctx.strokeStyle = '#50C878';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(alien.x + alien.width * 0.25, alien.y);
      this.ctx.lineTo(alien.x + alien.width * 0.2, alien.y - alien.height * 0.2);
      this.ctx.stroke();
      
      this.ctx.beginPath();
      this.ctx.moveTo(alien.x + alien.width * 0.75, alien.y);
      this.ctx.lineTo(alien.x + alien.width * 0.8, alien.y - alien.height * 0.2);
      this.ctx.stroke();
    }
    
    // Draw player projectiles with glow effect
    this.ctx.shadowColor = '#FFD700';
    this.ctx.shadowBlur = 10;
    this.ctx.fillStyle = '#FFD700';
    
    for (const projectile of this.projectiles) {
      this.ctx.fillRect(
        projectile.x, 
        projectile.y, 
        projectile.width, 
        projectile.height
      );
    }
    
    // Draw alien projectiles with red glow
    this.ctx.shadowColor = '#FF0000';
    this.ctx.shadowBlur = 10;
    this.ctx.fillStyle = '#FF0000';
    
    for (const projectile of this.alienProjectiles) {
      this.ctx.fillRect(
        projectile.x, 
        projectile.y, 
        projectile.width, 
        projectile.height
      );
    }
    
    // Reset shadow effect
    this.ctx.shadowBlur = 0;
    
    // Draw game over screen
    if (this.gameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = '#FFD700';
      this.ctx.font = '48px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 40);
      
      this.ctx.font = '24px sans-serif';
      this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
      this.ctx.fillText('Press SPACE to Restart', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
  }
}
