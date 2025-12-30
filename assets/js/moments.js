document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('moments-container');
    const buttons = document.querySelectorAll('.mode-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode');
            
            // 更新按钮状态
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // 切换容器类名（带淡出淡入效果）
            container.style.opacity = '0';
            container.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                // 移除所有模式类
                container.classList.remove('mode-timeline', 'mode-grid', 'mode-list');
                // 添加新模式类
                container.classList.add('mode-' + mode);
                
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 300);

            // 保存用户偏好
            localStorage.setItem('moments-mode', mode);
        });
    });

    // 加载用户偏好
    const savedMode = localStorage.getItem('moments-mode');
    if (savedMode) {
        const targetBtn = document.querySelector(`.mode-btn[data-mode="${savedMode}"]`);
        if (targetBtn) targetBtn.click();
    }
});
