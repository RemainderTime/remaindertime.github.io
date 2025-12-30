document.addEventListener('DOMContentLoaded', function () {
    // ----------------------------------------------------------------
    // 1. View Mode Switching
    // ----------------------------------------------------------------
    const container = document.getElementById('moments-container');
    const buttons = document.querySelectorAll('.mode-btn');

    if (container && buttons.length > 0) {
        buttons.forEach(btn => {
            btn.addEventListener('click', function () {
                const mode = this.getAttribute('data-mode');

                // Update button state
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Animate transition
                container.style.opacity = '0';
                container.style.transform = 'translateY(10px)';

                setTimeout(() => {
                    // Remove all mode classes
                    container.classList.remove('mode-timeline', 'mode-grid', 'mode-list');
                    // Add new mode class
                    container.classList.add('mode-' + mode);

                    container.style.opacity = '1';
                    container.style.transform = 'translateY(0)';
                }, 300);

                // Save preference
                localStorage.setItem('moments-mode', mode);
            });
        });

        // Load preference
        const savedMode = localStorage.getItem('moments-mode');
        if (savedMode) {
            const targetBtn = document.querySelector(`.mode-btn[data-mode="${savedMode}"]`);
            if (targetBtn) targetBtn.click();
        }
    }

    // ----------------------------------------------------------------
    // 2. Lightbox Logic
    // ----------------------------------------------------------------
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    document.body.appendChild(lightbox);

    document.addEventListener('click', function (e) {
        if (e.target.closest('.moment-image img')) {
            const img = e.target.closest('.moment-image img');
            const bigImg = document.createElement('img');
            bigImg.src = img.src;

            lightbox.innerHTML = '';
            lightbox.appendChild(bigImg);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    });

    lightbox.addEventListener('click', function () {
        this.classList.remove('active');
        document.body.style.overflow = '';
    });

    // ----------------------------------------------------------------
    // 3. Add Moment Modal & Generator
    // ----------------------------------------------------------------
    const addBtn = document.getElementById('add-moment-btn');
    const modal = document.getElementById('moment-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const generateBtn = document.getElementById('generate-btn');
    const resultArea = document.getElementById('generated-result');

    if (addBtn && modal) {
        // Open Modal
        addBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });

        // Close Modal
        function closeModal() {
            modal.classList.remove('active');
            resultArea.classList.remove('visible');
        }

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Generate YAML
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                const content = document.getElementById('m-content').value;
                const mood = document.getElementById('m-mood').value;
                const tags = document.getElementById('m-tags').value;
                const imageFile = document.getElementById('m-image').files[0];
                const date = new Date().toISOString().split('T')[0];

                let imagePath = '';
                if (imageFile) {
                    imagePath = `assets/images/${imageFile.name}`;
                }

                // Initial YAML construction
                let yaml = `- date: ${date}\n`;
                yaml += `  content: "${content.replace(/"/g, '\\"')}"\n`;
                if (imagePath) yaml += `  image: "${imagePath}"\n`;
                if (mood) yaml += `  mood: "${mood}"\n`;
                if (tags) {
                    const tagList = tags.split(/[,，]/).map(t => `"${t.trim()}"`).filter(t => t);
                    yaml += `  tags: [${tagList.join(', ')}]\n`;
                }

                // Display result
                resultArea.querySelector('code').textContent = yaml;
                resultArea.classList.add('visible');

                // Copy to clipboard
                navigator.clipboard.writeText(yaml).then(() => {
                    const originalText = generateBtn.textContent;
                    generateBtn.textContent = '已复制 YAML！';
                    setTimeout(() => generateBtn.textContent = originalText, 2000);
                });
            });
        }

        // File input preview (Show name)
        const fileInput = document.getElementById('m-image');
        const dropZone = document.querySelector('.file-drop-zone');

        if (fileInput && dropZone) {
            dropZone.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', () => {
                if (fileInput.files.length > 0) {
                    dropZone.innerHTML = `<p>✅ 已选择: ${fileInput.files[0].name}</p><small>请确保将此文件放入 assets/images/ 目录</small>`;
                }
            });
        }
    }
});
