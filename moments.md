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
            <section class="post-meta" style="text-align: center; margin-bottom: 30px;">记录生活中的每一个精彩瞬间</section>
        </header>

        <section class="post-content">
            <!-- 统计概览 -->
            {% assign all_moments = "" | split: "" %}
            {% for file in site.data.moments %}
                {% assign all_moments = all_moments | concat: file[1] %}
            {% endfor %}
            {% assign sorted_moments = all_moments | sort: "date" | reverse %}
            
            <div class="moments-stats">
                <div class="stat-card">
                    <span class="stat-value">{{ sorted_moments.size }}</span>
                    <span class="stat-label">总瞬间</span>
                </div>
                <div class="stat-card">
                    {% assign last_moment = sorted_moments.first %}
                    <span class="stat-value">{{ last_moment.date | date: "%m-%d" }}</span>
                    <span class="stat-label">最近更新</span>
                </div>
                <div class="stat-card">
                    {% assign current_year = "now" | date: "%Y" %}
                    {% assign year_count = 0 %}
                    {% for m in sorted_moments %}
                        {% assign m_year = m.date | date: "%Y" %}
                        {% if m_year == current_year %}
                            {% assign year_count = year_count | plus: 1 %}
                        {% endif %}
                    {% endfor %}
                    <span class="stat-value">{{ year_count }}</span>
                    <span class="stat-label">{{ current_year }} 年记录</span>
                </div>
            </div>

            <!-- 模式切换按钮 -->
            <div class="moments-controls">
                <button class="mode-btn active" data-mode="timeline"><span>⏳</span> 时间轴</button>
                <button class="mode-btn" data-mode="grid"><span>🖼️</span> 照片墙</button>
            </div>

            <!-- 内容容器 -->
            <div id="moments-container" class="mode-timeline">
                {% for moment in sorted_moments %}
                <div class="moment-item">
                    <div class="moment-dot"></div>
                    <div class="moment-card">
                        <div class="moment-header-info">
                            <span class="moment-date-tag">{{ moment.date | date: "%Y-%m-%d" }}</span>
                            {% if moment.mood %}
                            <span class="moment-mood-tag">{{ moment.mood }}</span>
                            {% endif %}
                        </div>

                        {% if moment.image %}
                        <div class="moment-image-container">
                            <div class="moment-image">
                                <img src="{{ site.baseurl | append: '/' | append: moment.image | replace: '//', '/' }}" alt="Moment Image" loading="lazy">
                            </div>
                        </div>
                        {% endif %}
                        
                        <div class="moment-body">
                            <div class="moment-text-container">
                                <div class="moment-text">{{ moment.content }}</div>
                            </div>
                            {% if moment.tags.size > 0 %}
                            <div class="moment-footer">
                                {% for tag in moment.tags %}
                                <span class="moment-tag">#{{ tag }}</span>
                                {% endfor %}
                            </div>
                            {% endif %}
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
            <p style="font-size: 0.8em; color: #666; margin-top: 5px;">推荐使用 <a href="https://github.com/RemainderTime/remaindertime.github.io/issues/new?template=new_moment.md" target="_blank" style="color: #60a5fa; text-decoration: underline;">GitHub Issue 自动化发布</a></p>
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
        </div>
        <div class="modal-footer">
            <button id="close-modal" class="btn-cancel">关闭</button>
            <button id="generate-btn" class="btn-submit">🚀 一键发布</button>
        </div>
    </div>
</div>

<link rel="stylesheet" href="/assets/css/moments.css?v={{ site.time | date: '%s' }}">
<script src="/assets/js/moments.js?v={{ site.time | date: '%s' }}"></script>
