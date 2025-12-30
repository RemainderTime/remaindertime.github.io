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
            <h1 class="post-title">时光轴</h1>
            <section class="post-meta">记录生活中的点滴瞬间</section>
        </header>

        <section class="post-content">
            <!-- 模式切换按钮 -->
            <div class="moments-controls">
                <button class="mode-btn active" data-mode="timeline">⏳ 时间轴</button>
                <button class="mode-btn" data-mode="grid">🖼️ 照片墙</button>
                <button class="mode-btn" data-mode="list">📜 列表</button>
            </div>

            <!-- 内容容器 -->
            <div id="moments-container" class="mode-timeline">
                {% for moment in site.data.moments %}
                <div class="moment-item" data-tags="{{ moment.tags | join: ',' }}">
                    <div class="moment-date">{{ moment.date }}</div>
                    <div class="moment-card">
                        {% if moment.image %}
                        <div class="moment-image">
                            <img src="{{ site.baseurl }}{{ moment.image }}" alt="Moment Image" loading="lazy">
                        </div>
                        {% endif %}
                        <div class="moment-body">
                            <div class="moment-mood">{{ moment.mood }}</div>
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

<link rel="stylesheet" href="{{ site.baseurl }}assets/css/moments.css">
<script src="{{ site.baseurl }}assets/js/moments.js"></script>
