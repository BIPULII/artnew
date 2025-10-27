// Simple modal gallery viewer
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const modalCaption = document.getElementById('modalCaption');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Get all gallery items
const galleryItems = document.querySelectorAll('.card');
let currentIndex = 0;

// Function to show media in modal
function showMedia(element) {
    const mediaElement = element.querySelector('img, video');
    const caption = element.querySelector('h4').textContent;
    const isVideo = mediaElement.tagName.toLowerCase() === 'video';
    
    // Reset both elements
    modalImage.style.display = 'none';
    modalVideo.style.display = 'none';
    
    if (isVideo) {
        modalVideo.src = mediaElement.src;
        modalVideo.style.display = 'block';
        modalVideo.controls = true; // Show video controls
        modalVideo.muted = false; // Unmute for modal view
    } else {
        modalImage.src = mediaElement.src;
        modalImage.style.display = 'block';
    }
    
    modalCaption.textContent = caption;
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
}

// Add click event to gallery items
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentIndex = index;
        showMedia(item);
    });
});

// Close modal
function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modalVideo.pause(); // Pause video if it's playing
}

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Navigation
function showPrevious() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    showMedia(galleryItems[currentIndex]);
}

function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    showMedia(galleryItems[currentIndex]);
}

prevBtn.addEventListener('click', showPrevious);
nextBtn.addEventListener('click', showNext);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!modal.style.display || modal.style.display === 'none') return;
    
    switch(e.key) {
        case 'ArrowLeft':
            showPrevious();
            break;
        case 'ArrowRight':
            showNext();
            break;
        case 'Escape':
            closeModal();
            break;
    }
});

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('.category-section, .card').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Smooth animations on scroll
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.category-section, .card');
  
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const isVisible = (rect.top <= window.innerHeight * 0.8);
    
    if (isVisible) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }
  });
};

// Remove parallax effect to prevent shifting

// Initialize animations
window.addEventListener('scroll', () => {
  requestAnimationFrame(() => {
    animateOnScroll();
    // parallax removed to prevent shifting
  });
});

document.addEventListener('DOMContentLoaded', ()=>{
  const items = Array.from(document.querySelectorAll('.card'));
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modalImage');
  const caption = document.getElementById('modalCaption');
  const closeBtn = document.getElementById('closeBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const yearEl = document.getElementById('year');
  yearEl.textContent = new Date().getFullYear();

  let current = 0;
  const imgs = items.map((btn)=> btn.querySelector('img').src);
  const titles = items.map((btn)=> btn.querySelector('h4').textContent);

  function switchImage(index, direction = 'next') {
    const oldImage = modalImage.cloneNode(true);
    oldImage.style.position = 'absolute';
    oldImage.style.top = '0';
    oldImage.style.left = '0';
    oldImage.style.width = '100%';
    oldImage.style.height = '100%';
    modalImage.parentNode.appendChild(oldImage);

    // Update current image
    modalImage.style.opacity = '0';
    modalImage.src = imgs[index];
    caption.textContent = titles[index];

    // Animate transition
    setTimeout(() => {
      modalImage.style.opacity = '1';
      oldImage.style.transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
      oldImage.style.opacity = '0';
      setTimeout(() => oldImage.remove(), 500);
    }, 50);
  }

  function open(index){
    current = index;
    modalImage.src = imgs[current];
    caption.textContent = titles[current];
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function close(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  function next(){ 
    const nextIndex = (current+1) % imgs.length;
    switchImage(nextIndex, 'next');
    current = nextIndex;
  }

  function prev(){ 
    const prevIndex = (current-1+imgs.length) % imgs.length;
    switchImage(prevIndex, 'prev');
    current = prevIndex;
  }

  items.forEach((btn, i)=> btn.addEventListener('click', ()=> open(i)));
  closeBtn.addEventListener('click', close);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  document.addEventListener('keydown', (e)=>{
    if(modal.getAttribute('aria-hidden') === 'false'){
      if(e.key === 'Escape') close();
      if(e.key === 'ArrowRight') next();
      if(e.key === 'ArrowLeft') prev();
    }
  });

  // Close when clicking outside content
  modal.addEventListener('click', (e)=>{
    if(e.target === modal) close();
  });
});