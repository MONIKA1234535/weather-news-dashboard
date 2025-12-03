import React from 'react';

// Helper component for a single news article
const NewsArticle = ({ article }) => {
  // Destructure with default values
  const { title, url, source, publishedAt } = article;
  
  // Format date
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = new Date(publishedAt).toLocaleDateString(undefined, dateOptions);

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="news-article">
      <h4 className="news-title">{title}</h4>
      <div className="news-meta">
        <span className="news-source">{source?.name || 'Source Unknown'}</span>
        <span className="news-date">{formattedDate}</span>
      </div>
    </a>
  );
};

export default function NewsList({ news, loading }) {
  if (loading) {
    return <div className="news-list loading">Loading top headlines...</div>;
  }

  if (!news || news.length === 0) {
    return <div className="news-list empty-state">No news headlines found. Please check API key configuration or try again later.</div>;
  }

  // Display top 10 articles
  return (
    <div className="news-list">
      {news.slice(0, 10).map((article, index) => (
        <NewsArticle key={index} article={article} />
      ))}
    </div>
  );
}