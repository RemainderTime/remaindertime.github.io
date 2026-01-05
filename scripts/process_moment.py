import os
import yaml
import re
from datetime import datetime

def process_issue():
    issue_body = os.environ.get('ISSUE_BODY', '').replace('\r\n', '\n')
    issue_title = os.environ.get('ISSUE_TITLE', '')
    
    # 按照 ### 标题 分割
    # 结果会 be ['', '心情\n内容', '标签\n内容', ...]
    parts = re.split(r'\n?###\s+', issue_body)
    
    data = {
        '心情': '',
        '标签': '',
        '图片': '',
        '内容': ''
    }
    
    for part in parts:
        part = part.strip()
        if not part: continue
        
        lines = part.split('\n')
        header = lines[0].strip()
        body = "\n".join(lines[1:]).strip()
        
        if header in data:
            data[header] = body

    mood = data['心情']
    tags_str = data['标签']
    image = data['图片']
    content = data['内容']
    
    tags = []
    if tags_str:
        tags = [t.strip() for t in re.split(r'[,，\n]', tags_str) if t.strip()]
    
    if not content:
        content = issue_title.replace('[Moment]', '').strip()
    
    new_moment = {
        'date': datetime.now().strftime('%Y-%m-%d'),
        'content': content,
        'mood': mood,
        'tags': tags
    }
    
    if image and image != "assets/images/example.jpg":
        new_moment['image'] = image
        
    # 读取现有的 moments.yml
    yaml_path = '_data/moments.yml'
    if os.path.exists(yaml_path):
        with open(yaml_path, 'r', encoding='utf-8') as f:
            moments = yaml.safe_load(f) or []
    else:
        moments = []
        
    # 将新内容插入到最前面
    moments.insert(0, new_moment)
    
    # 写回文件
    os.makedirs(os.path.dirname(yaml_path), exist_ok=True)
    with open(yaml_path, 'w', encoding='utf-8') as f:
        yaml.dump(moments, f, allow_unicode=True, sort_keys=False, default_flow_style=False)

if __name__ == "__main__":
    process_issue()
