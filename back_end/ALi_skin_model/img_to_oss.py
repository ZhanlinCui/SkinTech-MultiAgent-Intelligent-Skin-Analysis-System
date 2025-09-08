import  sys
from pathlib import Path
# 将父目录添加到 Python 模块搜索路径
sys.path.append(str(Path(__file__).parent.parent))
sys.stdout.reconfigure(encoding='utf-8')

import oss2
import os
import uuid
from pathlib import Path
import back_configuration as bc

def generate_unique_filename(original_filename):
    """生成唯一的文件名"""
    ext = os.path.splitext(original_filename)[1]
    return f"{uuid.uuid4().hex}{ext}"

def file_paths_oss_url(access_key_id, access_key_secret, bucket_name, oss_endpoint, file_obj=None, local_img_path=None):
    """
    上传文件到OSS并返回URL
    :param file_obj: 文件对象（优先使用）
    :param local_img_path: 本地文件路径（file_obj为None时使用）
    """
    if not file_obj and not local_img_path:
        raise ValueError("Either file_obj or local_img_path must be provided")
        
    auth = oss2.Auth(access_key_id, access_key_secret)
    bucket = oss2.Bucket(auth, oss_endpoint, bucket_name)
    
    # 生成唯一的对象名
    if file_obj:
        if hasattr(file_obj, 'filename'):
            original_filename = file_obj.filename
        else:
            original_filename = str(uuid.uuid4()) + ".jpg"
            
        object_name = f"uploads/{generate_unique_filename(original_filename)}"
        try:
            if hasattr(file_obj, 'read'):
                # 如果 file_obj 有 read 方法，直接上传
                bucket.put_object(object_name, file_obj)
            else:
                # 否则假设它是文件路径
                with open(file_obj, 'rb') as f:
                    bucket.put_object(object_name, f)
            return f'https://{bucket_name}.{oss_endpoint}/{object_name}'
        except Exception as e:
            print(f"Error uploading file to OSS: {str(e)}")
            raise
        finally:
            if hasattr(file_obj, 'close') and not file_obj.closed:
                file_obj.close()
    
    # 处理本地文件路径
    elif local_img_path:
        object_name = local_img_path.replace('\\', '/')
        try:
            with open(local_img_path, 'rb') as fileobj:
                bucket.put_object(object_name, fileobj)
            return f'https://{bucket_name}.{oss_endpoint}/{object_name}'
        except Exception as e:
            print(f"Error uploading local file to OSS: {str(e)}")
            raise

async def save_and_upload(file_obj):
    """保存上传的文件到临时目录并上传到OSS"""
    # 确保临时目录存在
    temp_dir = os.path.join(os.path.dirname(__file__), 'temp_image')
    os.makedirs(temp_dir, exist_ok=True)
    
    # 生成唯一的文件名
    filename = generate_unique_filename(file_obj.filename)
    temp_path = os.path.join(temp_dir, filename)
    
    try:
        # 保存到临时文件
        with open(temp_path, 'wb') as buffer:
            # 读取文件内容
            content = await file_obj.read()
            buffer.write(content)
        
        # 上传到OSS
        access_key_id, access_key_secret, bucket_name, oss_endpoint = bc.img_to_oss_url()
        
        # 使用文件路径上传
        with open(temp_path, 'rb') as file_to_upload:
            oss_url = file_paths_oss_url(
                access_key_id=access_key_id,
                access_key_secret=access_key_secret,
                bucket_name=bucket_name,
                oss_endpoint=oss_endpoint,
                file_obj=file_to_upload
            )
        
        return oss_url
        
    except Exception as e:
        print(f"Error in save_and_upload: {str(e)}")
        raise
        
    finally:
        # 保留临时文件，不再删除
        # 确保文件存在
        if os.path.exists(temp_path):
            print(f"临时文件已保存在: {temp_path}")
        else:
            print(f"警告: 临时文件 {temp_path} 不存在")

if __name__ == "__main__":
    # 测试代码
    local_img_path = r'D:\桌面\Analysis_Skin\images\uploaded_20250710_210902_42683b0f.png'
    access_key_id, access_key_secret, bucket_name, oss_endpoint = bc.img_to_oss_url()
    
    # 测试旧版接口
    print("测试旧版接口:")
    print(file_paths_oss_url(access_key_id, access_key_secret, bucket_name, oss_endpoint, 
                           local_img_path=local_img_path))
    
    # 测试新版接口
    print("\n测试新版接口:")
    with open(local_img_path, 'rb') as f:
        print(save_and_upload(f))
