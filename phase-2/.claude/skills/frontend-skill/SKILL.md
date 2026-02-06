---
name: frontend-skill
description: Build pages, reusable components, layouts, and modern styling with React/Next.js. Use when user needs frontend UI implementation.
---

# Frontend Development

## Instructions

Build frontend applications with these features:

1. **Page Structure**
   - Next.js App Router pages
   - React Router setup
   - SEO optimization
   - Meta tags and titles

2. **Reusable Components**
   - Props and state management
   - Component composition
   - Event handling
   - Conditional rendering

3. **Layout System**
   - Responsive grid layouts
   - Flexbox patterns
   - Navigation bars
   - Sidebars and footers

4. **Modern Styling**
   - Tailwind CSS utility classes
   - CSS modules
   - Responsive design
   - Dark mode support

## Example Code

### Next.js Page Structure
```jsx
// app/page.jsx
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Home - My App',
  description: 'Welcome to my application',
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Footer />
    </main>
  );
}
```

### Reusable Components
```jsx
// components/Button.jsx
export default function Button({ 
  children, 
  variant = 'primary', 
  onClick,
  disabled = false 
}) {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
}
```

```jsx
// components/Card.jsx
export default function Card({ title, description, image, children }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {image && (
        <img src={image} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {children}
      </div>
    </div>
  );
}
```

### Layout Components
```jsx
// components/Layout.jsx
export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">Logo</div>
          <ul className="flex gap-6">
            <li><a href="/" className="hover:text-blue-600">Home</a></li>
            <li><a href="/about" className="hover:text-blue-600">About</a></li>
            <li><a href="/contact" className="hover:text-blue-600">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 My App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
```

### Responsive Grid Layout
```jsx
// components/Grid.jsx
export default function Grid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}

// Usage
<Grid>
  <Card title="Card 1" description="Description 1" />
  <Card title="Card 2" description="Description 2" />
  <Card title="Card 3" description="Description 3" />
</Grid>
```

### Form Component
```jsx
// components/Form.jsx
'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
  );
}
```

### Dark Mode Support
```jsx
// components/ThemeToggle.jsx
'use client';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
    >
      {dark ? '🌞' : '🌙'}
    </button>
  );
}
```

## Best Practices

- Use semantic HTML elements
- Make components reusable and composable
- Implement responsive design (mobile-first)
- Optimize images and assets
- Use CSS utility classes (Tailwind)
- Handle loading and error states
- Add accessibility attributes (ARIA)
- Lazy load components when needed
- Keep components small and focused
- Use TypeScript for type safety