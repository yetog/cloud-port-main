
/**
 * Game Interface
 * 
 * This interface defines the structure that all games in the hub must follow.
 */
export interface Game {
  /** Name of the game to display in the menu */
  name: string;
  
  /** Icon or image to represent the game in the menu */
  icon: string;
  
  /** Description of the game */
  description: string;
  
  /** Function to start the game */
  start: () => void;
  
  /** Function to stop the game */
  stop: () => void;
}
