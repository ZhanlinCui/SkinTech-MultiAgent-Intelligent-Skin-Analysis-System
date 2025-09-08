import os
from pathlib import Path

def ensure_directory_exists(directory):
    """确保目录存在，如果不存在则创建"""
    Path(directory).mkdir(parents=True, exist_ok=True)
    return directory

def get_temp_image_path(filename):
    """获取临时图片保存路径"""
    temp_dir = os.path.join(os.path.dirname(__file__), 'temp_image')
    ensure_directory_exists(temp_dir)
    return os.path.join(temp_dir, filename)

def save_uploaded_file(file, filename):
    """保存上传的文件到临时目录"""
    temp_path = get_temp_image_path(filename)
    with open(temp_path, 'wb') as f:
        f.write(file.read())
    return temp_path
