import os
import yaml
import re
from datetime import datetime

def process_issue():
    issue_body = os.environ.get('ISSUE_BODY', '').replace('\r\n', '\n')
    issue_title = os.environ.get('ISSUE_TITLE', '')

    data = {
        '心情': [],
        '标签': [],
        '图片': [],
        '内容': []
    }

    current_key = None
    for line in issue_body.split('\n'):
        line_stripped = line.strip()
        if line_stripped.startswith('###'):
            header = line_stripped.replace('###', '').strip()
            if header in data:
                current_key = header
            else:
                current_key = None
            continue

        if current_key:
            data[current_key].append(line)

    mood = "\n".join(data['心情']).strip()
    tags_str = "\n".join(data['标签']).strip()
    image = "\n".join(data['图片']).strip()
    content = "\n".join(data['内容']).strip()

    tags = []
    if tags_str:
        tags = [t.strip() for t in re.split(r'[,，\n]', tags_str) if t.strip()]

    if not content:
        content = issue_title.replace('[Moment]', '').strip()

    now = datetime.now()
    date_str = now.strftime('%Y-%m-%d')
    month_str = now.strftime('%Y-%m')
    
    new_moment = {
        'date': date_str,
        'content': content,
        'mood': mood,
        'tags': tags
    }

    if image and image != "assets/images/example.jpg":
        new_moment['image'] = image

    # Use monthly file structure
    yaml_dir = '_data/moments'
    yaml_path = os.path.join(yaml_dir, f'{month_str}.yml')
    
    os.makedirs(yaml_dir, exist_ok=True)
    
    moments = []
    if os.path.exists(yaml_path):
        with open(yaml_path, 'r', encoding='utf-8') as f:
            moments = yaml.safe_load(f) or []
    
    moments.insert(0, new_moment)

    with open(yaml_path, 'w', encoding='utf-8') as f:
        yaml.dump(moments, f, allow_unicode=True, sort_keys=False, default_flow_style=False)

if __name__ == "__main__":
    process_issue()
