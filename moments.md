---
layout: default
title: 时光轴
permalink: /moments/
---

<header class="main-header post-head no-cover">
    <nav class="main-nav clearfix">
        <a class="blog-logo" href="{{ site.url }}"><img src="{{ site.cdn_url }}{{ site.data.authors['moonagic'].assets }}" alt="Blog Logo" /></a>
        {% if page.navigation %}
            <a class="menu-button icon-menu" href="#"><span class="word">Menu</span></a>
        {% endif %}
    </nav>
</header>

<main class="content" role="main">
    <article class="post">
        <header class="post-header">
            <h1 class="post-title" style="text-align: center; margin-bottom: 10px;">⏳ 时光轴</h1>
            <section class="post-meta" style="text-align: center; margin-bottom: 40px;">记录生活中的每一个精彩瞬间</section>
        </header>

        <section class="post-content">
            <!-- 模式切换按钮 -->
            <div class="moments-controls">
                <button class="mode-btn active" data-mode="timeline"><span>⏳</span> 时间轴</button>
                <button class="mode-btn" data-mode="grid"><span>🖼️</span> 照片墙</button>
            </div>

            <!-- 内容容器 -->
            <div id="moments-container" class="mode-timeline">
                {% for moment in site.data.moments %}
                <div class="moment-item">
                    <div class="moment-dot"></div>
                    <div class="moment-date">{{ moment.date | date: "%Y-%m-%d" }}</div>
                    
                    <!-- Date for Grid View -->
                    <div class="moment-date-card" style="display:none;">{{ moment.date | date: "%Y-%m-%d" }}</div>
                    
                    <div class="moment-card">
                        {% if moment.image %}
                        <div class="moment-image">
                            <img src="{{ site.baseurl | append: '/' | append: moment.image | replace: '//', '/' }}" alt="Moment Image" loading="lazy">
                        </div>
                        {% endif %}
                        <div class="moment-body">
                            {% if moment.mood %}
                            <div class="moment-mood">{{ moment.mood }}</div>
                            {% endif %}
                            <div class="moment-text">{{ moment.content }}</div>
                            <div class="moment-footer">
                                {% for tag in moment.tags %}
                                <span class="moment-tag">#{{ tag }}</span>
                                {% endfor %}
                            </div>
                        </div>
                    </div>
                </div>
                {% endfor %}
            </div>
        </section>
    </article>
</main>

<!-- Floating Add Button -->
<button id="add-moment-btn" class="add-moment-btn" title="记录新瞬间">➕</button>

<!-- Add Moment Modal -->
<div id="moment-modal" class="moment-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>📝 记录新瞬间</h3>
            <p style="font-size: 0.8em; color: #666; margin-top: 5px;">推荐使用 <a href="https://github.com/RemainderTime/remaindertime.github.io/issues/new?template=new_moment.md" target="_blank" style="color: #60a5fa; text-decoration: underline;">GitHub Issue 自动化发布</a>，无需手动复制代码。</p>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>此刻的想法...</label>
                <textarea id="m-content" class="form-textarea" rows="3" placeholder="今天发生了什么有趣的?"></textarea>
            </div>
            
            <div class="form-group">
                <label>心情</label>
                <input type="text" id="m-mood" class="form-input" placeholder="例如: 😊 开心, 🌧️ 忧伤">
            </div>
            
            <div class="form-group">
                <label>图片 (可选)</label>
                <div class="file-drop-zone">
                    <p>📸 点击选择图片</p>
                    <input type="file" id="m-image" accept="image/*" style="display: none;">
                </div>
            </div>
            
            <div class="form-group">
                <label>标签 (用逗号分隔)</label>
                <input type="text" id="m-tags" class="form-input" placeholder="生活, 摄影, 美食">
            </div>

            <div id="generated-result" class="generated-code-block" style="background: #f8fafc; border: 1px dashed #cbd5e1; padding: 15px; border-radius: 8px; margin-top: 10px;">
                <p style="color: #475569; margin-bottom: 0; font-size: 0.9em;">💡 点击下方按钮后，将自动跳转到 GitHub 提交页面。您只需点击 <b>"Submit new issue"</b> 即可完成发布，无需手动修改代码。</p>
            </div>
        </div>
        <div class="modal-footer">
            <button id="close-modal" class="btn-cancel">关闭</button>
            <button id="generate-btn" class="btn-submit">生成代码</button>
        </div>
    </div>
</div>

<link rel="stylesheet" href="/assets/css/moments.css">
<script src="/assets/js/moments.js"></script>
