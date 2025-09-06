// frontend/script.js
async function apiFetch(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Network response was not ok');
  const data = await response.json();
  return data;
}

const getData = async () => {
  try {
    const data = await apiFetch('/professional'); // same origin
    displayAllData(data);
  } catch (err) {
    console.error('Failed to fetch professional data:', err);
    document.getElementById('professionalName').innerText = 'Error loading data';
  }
};

function displayAllData(data) {
  displayProfessionalName(data.professionalName);
  displayImage(data.base64Image);
  displayPrimaryDescription(data);
  displayWorkDescription(data);
  displayLinkTitleText(data);
  displayLinkedInLink(data); // now will show YouTube if backend attached videos
  displayGitHubLink(data);
  displayContactText(data);
  displayVideos(data.videos || []);
}

function displayProfessionalName(n) {
  const professionalName = document.getElementById('professionalName');
  professionalName.innerText = n || '';
}

function displayImage(img) {
  const image = document.getElementById('professionalImage');
  if (!img) {
    image.src = '';
    image.alt = '';
    return;
  }
  image.src = `data:image/png;base64,${img}`;
  image.alt = 'Professional image';
}

function displayPrimaryDescription(data) {
  const nameLink = document.getElementById('nameLink');
  nameLink.innerText = (data.nameLink && data.nameLink.firstName) || '';
  nameLink.href = (data.nameLink && data.nameLink.url) || '#';
  const primaryDescription = document.getElementById('primaryDescription');
  primaryDescription.innerText = data.primaryDescription || '';
}

function displayWorkDescription(data) {
  const workDescription1 = document.getElementById('workDescription1');
  workDescription1.innerText = data.workDescription1 || '';
  const workDescription2 = document.getElementById('workDescription2');
  workDescription2.innerText = data.workDescription2 || '';
}

function displayLinkTitleText(data) {
  const linkTitle = document.getElementById('linkTitleText');
  linkTitle.innerText = data.linkTitleText || '';
}

function displayLinkedInLink(data) {
  const linkedInLink = document.getElementById('linkedInLink');
  // backend sets linkedInLink to YouTube link when videos exist
  const obj = data.linkedInLink || data.youtubeLink || { text: 'YouTube', link: '' };
  linkedInLink.innerText = obj.text || 'YouTube';
  linkedInLink.href = obj.link || '#';
}

function displayGitHubLink(data) {
  const githubLink = document.getElementById('githubLink');
  githubLink.innerText = (data.githubLink && data.githubLink.text) || '';
  githubLink.href = (data.githubLink && data.githubLink.link) || '#';
}

function displayContactText(data) {
  const contactText = document.getElementById('contactText');
  contactText.innerText = data.contactText || '';
}

// Render embedded iframes for each video in the returned videos array
function displayVideos(videos) {
  const gallery = document.getElementById('videoGallery');
  if (!videos || videos.length === 0) {
    gallery.innerHTML = '<p>No videos yet.</p>';
    return;
  }

  // Build responsive iframe wrappers with title and description
  gallery.innerHTML = videos.map(v => {
    const safeTitle = escapeHtml(v.title || '');
    const safeDesc = escapeHtml(v.description || '');
    const id = encodeURIComponent(v.videoId || '');
    return `
      <article class="video-item">
        ${safeTitle ? `<h4>${safeTitle}</h4>` : ''}
        ${safeDesc ? `<p>${safeDesc}</p>` : ''}
        <div class="iframe-wrap">
          <iframe
            src="https://www.youtube.com/embed/${id}"
            title="${safeTitle || 'Video'}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>
      </article>
    `;
  }).join('');
}

// simple HTML escape
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

getData();
