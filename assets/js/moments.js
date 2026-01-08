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
                imagesHtml += `<div class="moment-media"><img src="${moment.image}" loading="lazy" onclick="window.openLightbox(this.src)"></div>`;
            }
            if (moment.images && Array.isArray(moment.images)) {
                imagesHtml += `<div class="moment-gallery">
                    ${moment.images.map(img => `<div class="gallery-item"><img src="${img}" loading="lazy" onclick="window.openLightbox(this.src)"></div>`).join('')}
                </div>`;
            }

            let tagsHtml = '';
            if (moment.tags && Array.isArray(moment.tags)) {
                tagsHtml = `<div class="moment-footer"><div class="moment-tags">${moment.tags.map(t => `<span class="tag">#${t}</span>`).join('')}</div></div>`;
            }

            const card = document.createElement('article');
            card.className = 'moment-card visible'; // Directly visible for now, animation handled by observer
            card.innerHTML = `
                <div class="moment-marker">
                    <div class="marker-dot"></div>
                    <div class="marker-line"></div>
                </div>
                <div class="moment-content-wrapper">
                    <div class="moment-meta">
                        <span class="moment-date">${dateStr}</span>
                        ${moment.weather && moment.weather !== 'null' ? `<span class="moment-weather">${moment.weather}</span>` : ''}
                        ${moment.mood && moment.mood !== 'null' ? `<span class="moment-mood">${moment.mood}</span>` : ''}
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
        if (mood) yaml += `  mood: ${mood}\n`;
        if (weather) yaml += `  weather: ${weather}\n`;
        if (img) yaml += `  image: ${img}\n`;

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
