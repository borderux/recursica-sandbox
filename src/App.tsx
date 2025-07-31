import { useState, useEffect } from 'react'
import './App.css'

interface BuildInfo {
  name: string;
  path: string;
  date: string;
}

function App() {
  const [builds, setBuilds] = useState<BuildInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the builds list from the generated JSON file
    fetch('/builds.json')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to fetch builds list');
      })
      .then(data => {
        setBuilds(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading builds:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Recursica Sandbox</h1>
        <p>Storybook Builds</p>
      </header>
      
      <main className="app-main">
        {loading ? (
          <div className="loading">Loading builds...</div>
        ) : (
          <div className="builds-list">
            <h2>Available Builds</h2>
            {builds.length === 0 ? (
              <p>No builds available yet. Run <code>npm run build-storybook</code> to create a build.</p>
            ) : (
              <div className="builds-grid">
                {builds.map((build) => (
                  <div key={build.name} className="build-card">
                    <h3>{build.name}</h3>
                    <p className="build-date">{build.date}</p>
                    <a 
                      href={build.path} 
                      className="build-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Storybook
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>Built with React + Vite + Storybook</p>
      </footer>
    </div>
  )
}

export default App
