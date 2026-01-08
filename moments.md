---
layout: default
title: 时光轴
permalink: /moments/
---

<div class="moments-container">
    <!-- Header Section -->
    <header class="moments-header">
        <h1 class="moments-title">时光轴</h1>
        <p class="moments-subtitle">记录生活中的每一个精彩瞬间</p>
        
        <div class="moments-controls">
            <button class="control-btn active" data-view="timeline" title="时间轴视图">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                <span>时间轴</span>
            </button>
            <button class="control-btn" data-view="grid" title="照片墙视图">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>照片墙</span>
            </button>
        </div>
    </header>

    <!-- Main Content -->
    <main class="moments-wrapper view-timeline" id="moments-wrapper">
        <div id="loading-state" style="text-align: center; padding: 40px; color: var(--moments-text-light);">
            Loading moments...
        </div>
    </main>
</div>

<!-- Data Injection -->
<script id="moments-data" type="application/json">
[
{% if site.data.moments %}
    {% for collection in site.data.moments %}
        {% assign items = collection[1] %}
        {% if items.first %}
            {% for item in items %}
                {
                    "date": "{{ item.date }}",
                    "content": {{ item.content | jsonify }},
                    "mood": "{{ item.mood }}",
                    "weather": "{{ item.weather }}",
                    "image": "{{ item.image }}",
                    "images": {{ item.images | jsonify }},
                    "tags": {{ item.tags | jsonify }}
                }{% unless forloop.last and forloop.parentloop.last %},{% endunless %}
            {% endfor %}
        {% endif %}
    {% endfor %}
{% endif %}
]
</script>

<!-- Add Moment Floating Button -->
<button class="add-moment-fab" id="add-moment-btn" title="记录瞬间">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
</button>

<!-- Add Moment Modal -->
<div class="modal-overlay" id="moment-modal">
    <div class="modal-container">
        <div class="modal-header">
            <h2>✨ 新增瞬间</h2>
            <button class="modal-close" id="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>日期</label>
                <input type="datetime-local" id="m-date" class="form-input">
            </div>
            <div class="form-group">
                <label>内容</label>
                <textarea id="m-content" class="form-textarea" placeholder="记录下这一刻的想法..."></textarea>
            </div>
            <div class="form-row">
                <div class="form-group half">
                    <label>心情</label>
                    <select id="m-mood" class="form-select">
                        <option value="">选择心情...</option>
                        <option value="😊 开心">😊 开心</option>
                        <option value="🥳 兴奋">🥳 兴奋</option>
                        <option value="🍲 满足">🍲 满足</option>
                        <option value="🤔 思考">🤔 思考</option>
                        <option value="😴 疲惫">😴 疲惫</option>
                        <option value="😢 难过">😢 难过</option>
                        <option value="😡 生气">😡 生气</option>
                        <option value="🌟 期待">🌟 期待</option>
                        <option value="🧘 平静">🧘 平静</option>
                    </select>
                </div>
                <div class="form-group half">
                    <label>天气</label>
                    <select id="m-weather" class="form-select">
                        <option value="">选择天气...</option>
                        <option value="☀️ 晴朗">☀️ 晴朗</option>
                        <option value="☁️ 多云">☁️ 多云</option>
                        <option value="⛅ 阴天">⛅ 阴天</option>
                        <option value="🌧️ 下雨">🌧️ 下雨</option>
                        <option value="❄️ 下雪">❄️ 下雪</option>
                        <option value="⛈️ 雷雨">⛈️ 雷雨</option>
                        <option value="🌫️ 雾天">🌫️ 雾天</option>
                        <option value="🌬️ 大风">🌬️ 大风</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>图片 URL (可选)</label>
                <input type="text" id="m-image" class="form-input" placeholder="https://...">
            </div>
            <div class="form-group">
                <label>标签 (逗号分隔)</label>
                <input type="text" id="m-tags" class="form-input" placeholder="生活, 随笔">
            </div>
        </div>
        <div class="modal-footer">
            <div class="code-preview-area" style="display:none;">
                <label>生成的 YAML (复制并添加到数据文件)</label>
                <textarea id="yaml-output" readonly></textarea>
                <button class="btn btn-copy" id="btn-copy">复制</button>
            </div>
            <button class="btn btn-primary" id="btn-generate">生成代码</button>
        </div>
    </div>
</div>

<!-- Lightbox -->
<div class="lightbox" id="lightbox">
    <span class="lightbox-close">&times;</span>
    <img class="lightbox-img" id="lightbox-img">
</div>

<link rel="stylesheet" href="/assets/css/moments.css">
<script src="/assets/js/moments.js"></script>
