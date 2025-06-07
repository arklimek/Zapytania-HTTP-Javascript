import './style.css';
import { format } from 'date-fns';

const fetchArticles = async () => {
  try {
    const response = await fetch(
      'https://dfftnbcuahivfnlwtdzr.supabase.co/rest/v1/article?select=*',
      {
        headers: {
          apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZnRuYmN1YWhpdmZubHd0ZHpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzY5MzAsImV4cCI6MjA2NDY1MjkzMH0.zjcxG3NTHpZGj1n26iLcSloa7DhHSgQUJMPnSMa7irE',
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const displayArticles = async () => {
  const articles = await fetchArticles();
  const container = document.getElementById('articles');

  // Usunięcie wcześniej dodanych artykułów
  container.innerHTML = '';

  articles.forEach((article) => {
    const articleEl = document.createElement('div');
    articleEl.classList.add('article');

    const formattedDate = format(new Date(article.created_at).toLocaleDateString(), 'dd-MM-yyyy');

    articleEl.innerHTML = `
      <h1>${article.title ?? '(Brak tytułu)'}</h1>
      <p><strong>Podtytuł:</strong> ${article.subtitle ?? ''}</p>
      <p><strong>Autor:</strong> ${article.author}</p>
      <p><strong>Data:</strong> ${formattedDate}</p>
      <p><strong>Treść:</strong> ${article.content}</p>
    `;

    container.appendChild(articleEl);
  });
};


window.addEventListener('DOMContentLoaded', () => {
  displayArticles();
});

const form = document.getElementById('article-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const newArticle = {
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    author: formData.get('author'),
    content: formData.get('content'),
    created_at: new Date().toISOString(),
  };

  try {
    const response = await fetch(
      'https://dfftnbcuahivfnlwtdzr.supabase.co/rest/v1/article',
      {
        method: 'POST',
        headers: {
          apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZnRuYmN1YWhpdmZubHd0ZHpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzY5MzAsImV4cCI6MjA2NDY1MjkzMH0.zjcxG3NTHpZGj1n26iLcSloa7DhHSgQUJMPnSMa7irE',
          'Content-Type': 'application/json',
          Prefer: 'return=representation'
        },
        body: JSON.stringify(newArticle),
      }
    );

    if (!response.ok) {
      throw new Error('Błąd przy dodawaniu artykułu');
    }

    const created = await response.json();
    console.log('Dodano artykuł:', created);

    form.reset();
    displayArticles();

  } catch (error) {
    console.error('Błąd zapisu:', error);
  }
});
