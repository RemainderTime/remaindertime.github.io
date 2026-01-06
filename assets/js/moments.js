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
            
            // Toggle date visibility for grid mode
            const gridDates = document.querySelectorAll('.moment-date-card');
            gridDates.forEach(d => d.style.display = mode === 'grid' ? 'block' : 'none');
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
            const container = expandBtn.previousElementSibling;
            const isExpanded = container.classList.toggle('expanded');
            expandBtn.innerText = isExpanded ? '收起内容' : '展开全文';
            
            // If collapsing, scroll back to card top smoothly
            if (!isExpanded) {
                expandBtn.closest('.moment-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    });

    // Initialize Expand Buttons
    const initExpandButtons = () => {
        const containers = document.querySelectorAll('.moment-text-container');
        containers.forEach(container => {
            // Check if content exceeds 3 lines (approx 4.8em)
            if (container.scrollHeight > container.offsetHeight) {
                const btn = document.createElement('button');
                btn.className = 'expand-btn';
                btn.innerText = '展开全文 ↓';
                container.after(btn);
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

    // Image Upload Interaction
    const fileDropZone = document.querySelector('.file-drop-zone');
    const imageInput = document.getElementById('m-image');
    if (fileDropZone && imageInput) {
        fileDropZone.addEventListener('click', () => imageInput.click());
        imageInput.addEventListener('change', () => {
            if (imageInput.files && imageInput.files[0]) {
                fileDropZone.querySelector('p').innerText = `📸 已选择: ${imageInput.files[0].name}`;
            }
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

    // One-click Publish to GitHub
    if (generateBtn) {
        generateBtn.innerText = "🚀 一键发布到时光轴";
        generateBtn.addEventListener('click', () => {
            const content = document.getElementById('m-content').value;
            const mood = document.getElementById('m-mood').value;
            const tags = document.getElementById('m-tags').value;
            const imageInput = document.getElementById('m-image');
            
            if (!content) {
                alert("请输入此刻的想法内容！");
                return;
            }

            // 处理图片路径
            let imagePath = '';
            if (imageInput && imageInput.files && imageInput.files[0]) {
                // 如果用户选了图片，尝试使用该文件名
                imagePath = `assets/images/${imageInput.files[0].name}`;
            }

            // 构建 Issue 内容体
            const issueBody = `### 心情\n${mood || '😊'}\n\n### 标签\n${tags || '生活'}\n\n### 内容\n${content}\n\n### 图片\n${imagePath}`;
            
            // 构建 GitHub New Issue URL
            // 替换为你的仓库地址
            const repoUrl = "https://github.com/RemainderTime/remaindertime.github.io";
            const templateName = "new_moment.md";
            const title = encodeURIComponent(`[Moment] ${content.substring(0, 20)}...`);
            const body = encodeURIComponent(issueBody);
            
            const publishUrl = `${repoUrl}/issues/new?template=${templateName}&title=${title}&body=${body}`;
            
            // 打开新窗口跳转
            window.open(publishUrl, '_blank');
            
            // 关闭弹窗
            closeModal();
        });
    }
});
