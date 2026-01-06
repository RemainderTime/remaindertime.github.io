document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('moments-container');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const addBtn = document.getElementById('add-moment-btn');
    const modal = document.getElementById('moment-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const generateBtn = document.getElementById('generate-btn');

    // Mode Switch
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            container.className = `mode-${mode}`;
            
            // Re-initialize expand buttons if needed
            initExpandButtons();
        });
    });

    // Lightbox Logic
    const createLightbox = () => {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = '<img src="" alt="Full Image">';
        document.body.appendChild(lightbox);

        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.querySelector('img').src = '';
            }, 300);
        });

        return lightbox;
    };

    const lightbox = document.getElementById('lightbox') || createLightbox();
    const lightboxImg = lightbox.querySelector('img');

    document.addEventListener('click', (e) => {
        // Lightbox logic
        const imgContainer = e.target.closest('.moment-image');
        if (imgContainer) {
            const img = imgContainer.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
            }
            return;
        }

        // Expand/Collapse logic
        const expandBtn = e.target.closest('.expand-btn');
        if (expandBtn) {
            const textContainer = expandBtn.previousElementSibling;
            const isExpanded = textContainer.classList.toggle('expanded');
            expandBtn.innerText = isExpanded ? '收起内容 ↑' : '展开全文 ↓';
            
            if (!isExpanded) {
                expandBtn.closest('.moment-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    });

    // Initialize Expand Buttons
    const initExpandButtons = () => {
        // Remove existing buttons first to avoid duplicates
        document.querySelectorAll('.expand-btn').forEach(b => b.remove());
        
        const containers = document.querySelectorAll('.moment-text-container');
        containers.forEach(container => {
            // Only add if content is long enough
            // Using a temporary style to check height
            const originalStyle = container.style.maxHeight;
            container.style.maxHeight = 'none';
            const fullHeight = container.scrollHeight;
            container.style.maxHeight = originalStyle;
            
            if (fullHeight > 120) { // Approx 5-6 lines
                const btn = document.createElement('button');
                btn.className = 'expand-btn';
                btn.style.cssText = "display: block; width: 100%; padding: 8px; margin-top: 8px; background: none; border: 1px dashed var(--border-color); border-radius: 8px; color: var(--accent-color); cursor: pointer; font-size: 0.8rem;";
                btn.innerText = '展开全文 ↓';
                container.after(btn);
                container.style.maxHeight = '100px';
                container.style.overflow = 'hidden';
            }
        });
    };
    initExpandButtons();

    // Modal Logic
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // One-click Publish
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const content = document.getElementById('m-content').value;
            const mood = document.getElementById('m-mood').value;
            const tags = document.getElementById('m-tags').value;
            const imageInput = document.getElementById('m-image');
            
            if (!content) {
                alert("请输入此刻的想法内容！");
                return;
            }

            let imagePath = '';
            if (imageInput && imageInput.files && imageInput.files[0]) {
                imagePath = `assets/images/${imageInput.files[0].name}`;
            }

            const issueBody = `### 心情\n${mood || '😊'}\n\n### 标签\n${tags || '生活'}\n\n### 内容\n${content}\n\n### 图片\n${imagePath}`;
            const repoUrl = "https://github.com/RemainderTime/remaindertime.github.io";
            const templateName = "new_moment.md";
            const title = encodeURIComponent(`[Moment] ${content.substring(0, 20)}...`);
            const body = encodeURIComponent(issueBody);
            
            const publishUrl = `${repoUrl}/issues/new?template=${templateName}&title=${title}&body=${body}`;
            window.open(publishUrl, '_blank');
            closeModal();
        });
    }
});
