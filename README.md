I'd be happy to explain the folder structure and system thinking behind your website!

Folder Structure
The project follows a typical React application structure with some organizational choices for maintainability:

src/ - The source directory containing all the application code
components/ - Reusable UI components
ui/ - UI primitives from shadcn/ui (buttons, forms, etc.)
Other components like Sidebar.tsx, Projects.tsx, etc.
data/ - Data files that power the application
projects.ts - Project information
skills.ts - Skills and expertise data
apps.ts - Application showcase data
pages/ - Full page components
Index.tsx - The main landing page
ProjectDetail.tsx - Individual project page
NotFound.tsx - 404 page
hooks/ - Custom React hooks
lib/ - Utility functions and helpers
System Thinking
The architecture follows these key principles:

Component-Based Architecture: The site is built with reusable, focused components that combine to create the full experience.

Data-Driven Approach: Content is separated from presentation. The data/ folder contains structured information that feeds into components, making it easy to update content without touching UI code.

Responsive Design: Components are built to work across device sizes with a mobile-first approach.

Progressive Enhancement: Features like scroll animations only enhance the experience without breaking core functionality.

Section-Based Layout: The main page is divided into clear sections (Hero, About, Projects, etc.) that can be independently updated.

Performance Considerations:

Lazy loading images
Intersection Observer for animations
Optimized component rendering
Maintainability:

Clear separation of concerns between data, UI, and logic
Consistent styling patterns using Tailwind
Typed interfaces for data structures
This architecture makes it easy to:

Add new projects by simply updating the data files
Customize the appearance without changing the underlying structure
Extend with new sections or pages by following the established patterns

I'll explain how you can make these changes yourself:

For the "Skills & Expertise" area modifications:
Navigate to src/data/skills.ts
You can modify the following for each skill:
name: Change the skill name
level: Adjust the proficiency level (0-100)
category: Change the category ('technical', 'cloud', or 'soft')
Example:


{ 
  name: "Your New Skill", 
  level: 85, 
  category: "technical" 
}
For adding custom photos:
Place your images in the public folder of your project
Reference them in your code using the format: /your-image-name.png
You can modify image paths in:
src/data/projects.ts: Update the image property for each project
Other components that use images
Example usage:


{
  // ... other project properties
  image: '/your-custom-image.png',
  // ... other properties
}
Remember:

Supported image formats: .png, .jpg, .jpeg, .gif, .svg
Keep image sizes reasonable (recommend under 500KB per image)
Use descriptive filenames without spaces (use hyphens instead)
Make sure your images are in the correct aspect ratio for where they'll be used
Would you like me to explain anything specific about either of these areas in more detail?
