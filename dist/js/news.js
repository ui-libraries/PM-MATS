(() => {
  const listEl = document.getElementById('news-list');
  if (!listEl) return;

  const NEWS_INDEX_URL = 'data/news.json';
  const STORY_BASE = 'data/news/';

  const fmtDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return iso || '';
    }
  };

  const renderStory = async (story) => {
    const article = document.createElement('article');
    article.className = 'pb-4 border-bottom';

    const heading = document.createElement('h4');
    heading.textContent = story.title || 'Untitled';
    heading.className = 'mb-2';

    const meta = document.createElement('div');
    meta.className = 'text-muted mb-3';
    const pieces = [];
    if (story.author) pieces.push(story.author);
    if (story.date) pieces.push(fmtDate(story.date));
    meta.textContent = pieces.join(' • ');

    const content = document.createElement('div');

    article.appendChild(heading);
    article.appendChild(meta);
    article.appendChild(content);

    // Fetch HTML body for the story
    if (story.slug) {
      const url = STORY_BASE + story.slug + '.html';
      try {
        const res = await fetch(url, { credentials: 'omit' });
        if (!res.ok) throw new Error(res.statusText || 'Failed to load story');
        const html = await res.text();
        content.innerHTML = html;
      } catch (e) {
        content.innerHTML = `<div class="text-danger">Unable to load story content.</div>`;
        // eslint-disable-next-line no-console
        console.error('Error loading story', story.slug, e);
      }
    } else if (story.html) {
      content.innerHTML = story.html;
    } else if (story.text) {
      const p = document.createElement('p');
      p.textContent = story.text;
      content.appendChild(p);
    } else {
      content.innerHTML = '<em>No content.</em>';
    }

    return article;
  };

  const renderList = async (stories) => {
    listEl.innerHTML = '';
    if (!stories.length) {
      const empty = document.createElement('div');
      empty.className = 'text-center text-muted';
      empty.textContent = 'No news stories yet.';
      listEl.appendChild(empty);
      return;
    }
    for (const s of stories) {
      // eslint-disable-next-line no-await-in-loop
      const node = await renderStory(s);
      listEl.appendChild(node);
    }
  };

  const load = async () => {
    try {
      const res = await fetch(NEWS_INDEX_URL, { credentials: 'omit', cache: 'no-cache' });
      if (!res.ok) throw new Error(res.statusText || 'Failed to load news index');
      const data = await res.json();
      const items = Array.isArray(data?.stories) ? data.stories : [];
      // Sort newest first by date if present
      items.sort((a, b) => {
        const ta = Date.parse(a.date || 0);
        const tb = Date.parse(b.date || 0);
        return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
      });
      await renderList(items);
    } catch (e) {
      listEl.innerHTML = '<div class="text-danger">Unable to load news at this time.</div>';
      // eslint-disable-next-line no-console
      console.error('Error loading news index', e);
    }
  };

  document.addEventListener('DOMContentLoaded', load);
})();



