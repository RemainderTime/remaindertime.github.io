// Blog enhancements
(function() {
  
  // Reading progress bar
  function initReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      
      progressBar.style.width = progress + '%';
    });
  }
  
  // Back to top button
  function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Code copy button
  function initCodeCopy() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach((block) => {
      const pre = block.parentElement;
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      
      const copyBtn = document.createElement('button');
      copyBtn.className = 'code-copy-btn';
      copyBtn.innerHTML = '<span class="copy-icon">📋</span><span class="copy-text">复制</span>';
      copyBtn.setAttribute('aria-label', '复制代码');
      
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(copyBtn);
      wrapper.appendChild(pre);
      
      copyBtn.addEventListener('click', async () => {
        const code = block.textContent;
        
        try {
          await navigator.clipboard.writeText(code);
          copyBtn.innerHTML = '<span class="copy-icon">✓</span><span class="copy-text">已复制</span>';
          copyBtn.classList.add('copied');
          
          setTimeout(() => {
            copyBtn.innerHTML = '<span class="copy-icon">📋</span><span class="copy-text">复制</span>';
            copyBtn.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy code:', err);
          copyBtn.innerHTML = '<span class="copy-icon">✗</span><span class="copy-text">失败</span>';
          
          setTimeout(() => {
            copyBtn.innerHTML = '<span class="copy-icon">📋</span><span class="copy-text">复制</span>';
          }, 2000);
        }
      });
    });
  }
  
  // Table of Contents (TOC)
  function initTOC() {
    const tocContainer = document.getElementById('toc-container');
    if (!tocContainer) return;
    
    const postContent = document.querySelector('.post-content');
    if (!postContent) return;
    
    const headings = postContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) {
      tocContainer.style.display = 'none';
      return;
    }
    
    let tocHTML = '<nav class="toc"><div class="toc-title">目录</div><ul class="toc-list">';
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent;
      const id = heading.id || `heading-${index}`;
      
      if (!heading.id) {
        heading.id = id;
      }
      
      tocHTML += `<li class="toc-item toc-level-${level}">
        <a href="#${id}" class="toc-link">${text}</a>
      </li>`;
    });
    
    tocHTML += '</ul></nav>';
    tocContainer.innerHTML = tocHTML;
    
    // Highlight current section in TOC
    const tocLinks = tocContainer.querySelectorAll('.toc-link');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tocLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -35% 0px'
    });
    
    headings.forEach(heading => observer.observe(heading));
  }
  
  // Lazy load images
  function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src], picture source[data-srcset]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            
            if (element.tagName === 'IMG' && element.dataset.src) {
              element.src = element.dataset.src;
              element.removeAttribute('data-src');
            } else if (element.tagName === 'SOURCE' && element.dataset.srcset) {
              element.srcset = element.dataset.srcset;
              element.removeAttribute('data-srcset');
            }
            
            element.classList.add('loaded');
            observer.unobserve(element);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      images.forEach(element => {
        if (element.tagName === 'IMG' && element.dataset.src) {
          element.src = element.dataset.src;
        } else if (element.tagName === 'SOURCE' && element.dataset.srcset) {
          element.srcset = element.dataset.srcset;
        }
      });
    }
  }
  
  // Smooth scroll for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update URL without jumping
          history.pushState(null, null, href);
        }
      });
    });
  }
  
  // Initialize all enhancements
  document.addEventListener('DOMContentLoaded', function() {
    initReadingProgress();
    initBackToTop();
    initCodeCopy();
    initTOC();
    initLazyLoad();
    initSmoothScroll();
  });
  
})();
