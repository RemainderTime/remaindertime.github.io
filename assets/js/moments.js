document.addEventListener('DOMContentLoaded', () => {
    // --- Render Logic (New) ---
    const rawDataScript = document.getElementById('moments-data');
    let momentsData = [];
    try {
        momentsData = JSON.parse(rawDataScript.textContent);
    } catch (e) {
        console.error("Failed to parse moments data", e);
    }

    // Sort by date desc
    momentsData.sort((a, b) => new Date(b.date) - new Date(a.date));

    const wrapper = document.getElementById('moments-wrapper');
    wrapper.innerHTML = ''; // Clear loading state

    // Base URL handling
    const baseUrl = window.location.origin;

    // Helper to process image path
    const getImgUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('//')) return path;

        // If path is just a filename (e.g. "photo.jpg"), prepend standard path
        if (!path.includes('/')) {
            return `/assets/images/${path}`;
        }

        // If path starts with assets but misses slash
        if (path.startsWith('assets/')) {
            return '/' + path;
        }

        // Check if path already starts with slash
        const cleanPath = path.startsWith('/') ? path : '/' + path;
        return cleanPath;
    };

    if (momentsData.length === 0) {
        wrapper.innerHTML = `
            <div class="empty-state" style="text-align:center; padding:50px;">
                <div class="empty-icon" style="font-size:48px;">🌱</div>
                <h3>暂无动态</h3>
                <p>点击右下角的按钮，记录你的第一个瞬间吧！</p>
            </div>`;
    } else {
        momentsData.forEach(moment => {
            const dateObj = new Date(moment.date);
            const dateStr = isNaN(dateObj.getTime()) ? moment.date : dateObj.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');

            let imagesHtml = '';
            if (moment.image && moment.image !== 'null') {
                const imgUrl = getImgUrl(moment.image);
                imagesHtml += `<div class="moment-media"><img src="${imgUrl}" onerror="this.onerror=null;this.src='https://via.placeholder.com/600x400?text=Image+Not+Found';" loading="lazy" onclick="window.openLightbox(this.src)"></div>`;
            }
            if (moment.images && Array.isArray(moment.images)) {
                imagesHtml += `<div class="moment-gallery">
                    ${moment.images.map(img => {
                    const iUrl = getImgUrl(img);
                    return `<div class="gallery-item"><img src="${iUrl}" onerror="this.onerror=null;this.src='https://via.placeholder.com/300x300?text=Error';" loading="lazy" onclick="window.openLightbox(this.src)"></div>`;
                }).join('')}
                </div>`;
            }

            let tagsHtml = '';
            if (moment.tags && Array.isArray(moment.tags)) {
                tagsHtml = `<div class="moment-footer"><div class="moment-tags">${moment.tags.map(t => `<span class="tag">#${t}</span>`).join('')}</div></div>`;
            }

            const card = document.createElement('article');
            card.className = 'moment-card visible';

            // Build Meta HTML
            let metaHtml = `<span class="moment-date">${dateStr}</span>`;

            // Render Weather/Mood only if valid text (not "null", not empty)
            if (moment.weather && moment.weather !== 'null' && moment.weather.trim() !== '') {
                metaHtml += `<span class="moment-weather">${moment.weather}</span>`;
            }
            if (moment.mood && moment.mood !== 'null' && moment.mood.trim() !== '') {
                metaHtml += `<span class="moment-mood">${moment.mood}</span>`;
            }

            card.innerHTML = `
                <div class="moment-marker">
                    <div class="marker-dot"></div>
                    <div class="marker-line"></div>
                </div>
                <div class="moment-content-wrapper">
                    <div class="moment-meta">
                        ${metaHtml}
                    </div>
                    <div class="moment-body">
                        ${moment.content && moment.content !== 'null' ? `<p class="moment-text">${moment.content}</p>` : ''}
                        ${imagesHtml}
                    </div>
                    ${tagsHtml}
                </div>
            `;
            wrapper.appendChild(card);
        });
    }


    // --- View Toggle Logic ---
    const btns = document.querySelectorAll('.control-btn');
    const container = wrapper; // wrapper is the grid/timeline container

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update buttons state
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update View
            const view = btn.dataset.view;
            if (view === 'timeline') {
                container.classList.remove('view-grid');
                container.classList.add('view-timeline');
            } else {
                container.classList.remove('view-timeline');
                container.classList.add('view-grid');
            }

            // Trigger animation
            resetAnimations();
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    function resetAnimations() {
        const cards = document.querySelectorAll('.moment-card');
        cards.forEach(card => {
            card.classList.remove('visible');
            observer.observe(card);
        });
    }

    // Initial check
    resetAnimations();

    // --- Modal Logic ---
    const modal = document.getElementById('moment-modal');
    const addBtn = document.getElementById('add-moment-btn');
    const closeBtn = document.getElementById('modal-close');
    const generateBtn = document.getElementById('btn-generate');
    const copyBtn = document.getElementById('btn-copy');
    const previewArea = document.querySelector('.code-preview-area');
    const output = document.getElementById('yaml-output');

    // Set default datetime to now
    const now = new Date();
    // Adjust to local ISO string for input[type="datetime-local"]
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('m-date').value = now.toISOString().slice(0, 16);

    addBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    generateBtn.addEventListener('click', () => {
        const dateStr = document.getElementById('m-date').value;
        const content = document.getElementById('m-content').value;
        const mood = document.getElementById('m-mood').value;
        const weather = document.getElementById('m-weather').value;
        const img = document.getElementById('m-image').value;
        const tags = document.getElementById('m-tags').value;

        // Simple validation
        if (!content && !img) {
            alert('请至少填写内容或图片URL');
            return;
        }

        // Generate YAML
        let yaml = `- date: ${dateStr}\n`;
        if (content) yaml += `  content: "${content.replace(/"/g, '\\"')}"\n`;
        if (mood) yaml += `  mood: "${mood}"\n`; // Quote strings
        if (weather) yaml += `  weather: "${weather}"\n`; // Quote strings

        // Image Logic
        const imgInput = document.getElementById('m-image').value.trim();
        if (imgInput) {
            // Split by comma or newline to handle multiple images
            const imgs = imgInput.split(/[,，\n]/).map(s => s.trim()).filter(s => s);
            if (imgs.length === 1) {
                yaml += `  image: ${imgs[0]}\n`;
            } else if (imgs.length > 1) {
                yaml += `  images:\n`;
                imgs.forEach(url => {
                    yaml += `  - ${url}\n`;
                });
            }
        }

        if (tags) {
            const tagArray = tags.split(/[,，]/).map(t => t.trim()).filter(t => t);
            if (tagArray.length > 0) {
                yaml += `  tags: [${tagArray.map(t => `${t}`).join(', ')}]\n`;
            }
        }

        output.value = yaml;
        previewArea.style.display = 'block';

        // Auto copy logic if supported
        try {
            output.select();
            document.execCommand('copy');
            generateBtn.textContent = '已生成并尝试复制';
            setTimeout(() => generateBtn.textContent = '生成代码', 2000);
        } catch (e) {
            // fall back to manual copy
        }
    });

    copyBtn.addEventListener('click', () => {
        output.select();
        document.execCommand('copy');
        copyBtn.textContent = '已复制!';
        setTimeout(() => copyBtn.textContent = '复制', 2000);
    });

    // --- Lightbox Logic ---
    window.openLightbox = function (src) {
        const lightbox = document.getElementById('lightbox');
        const img = document.getElementById('lightbox-img');
        img.src = src;
        lightbox.classList.add('active');
    };

    document.querySelector('.lightbox-close').addEventListener('click', () => {
        document.getElementById('lightbox').classList.remove('active');
    });

    document.getElementById('lightbox').addEventListener('click', (e) => {
        if (e.target.id === 'lightbox') {
            document.getElementById('lightbox').classList.remove('active');
        }
    });
});
