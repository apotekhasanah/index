const articles = ['article1.html', 'article2.html', 'article3.html'];

function goToNextArticle(current) {
  const index = articles.indexOf(current);
  const next = (index + 1) % articles.length;
  window.location.href = articles[next];
}

function goToPreviousArticle(current) {
  const index = articles.indexOf(current);
  const prev = (index - 1 + articles.length) % articles.length;
  window.location.href = articles[prev];
}
