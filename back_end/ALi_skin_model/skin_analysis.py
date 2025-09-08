""" 利用阿里云皮肤病分析模型进行视觉性地采集皮肤上的一些表征数据
目前，阿里云推出的是公测版，基本没有成本，但是对速率和并发量有限制

"""
import  sys
from pathlib import Path
# 将父目录添加到 Python 模块搜索路径
sys.path.append(str(Path(__file__).parent.parent))
sys.stdout.reconfigure(encoding='utf-8')

from typing import List
import json
from alibabacloud_imageprocess20200320.client import Client as imageprocess20200320Client
from alibabacloud_credentials.client import Client as CredentialClient
from alibabacloud_tea_openapi import models as open_api_models
from alibabacloud_imageprocess20200320 import models as imageprocess_20200320_models
from alibabacloud_tea_util import models as util_models
from alibabacloud_tea_util.client import Client as UtilClient

import back_configuration as bc

class Sample:
    @staticmethod
    def create_client(skin_analysis) -> imageprocess20200320Client:
        config = open_api_models.Config(
            access_key_id=skin_analysis.get('access_key_id'),
            access_key_secret=skin_analysis.get('access_key_secret'),
        )
        config.endpoint = skin_analysis.get('endpoint', 'imageprocess.cn-shanghai.aliyuncs.com')
        return imageprocess20200320Client(config)

    @staticmethod
    def main(
        args: List[str],
        skin_analysis,
        oss_img_url: str
    ) -> str:
        if not oss_img_url:
            raise ValueError("oss_img_url cannot be empty")
            
        if not skin_analysis or not isinstance(skin_analysis, dict):
            raise ValueError("Invalid skin_analysis configuration")
            
        client = Sample.create_client(skin_analysis)
        detect_skin_disease_request = imageprocess_20200320_models.DetectSkinDiseaseRequest(
            url=oss_img_url,
            org_id=skin_analysis.get('org_id'),
            org_name=skin_analysis.get('org_name')
        )
        runtime = util_models.RuntimeOptions()
        try:
            response = client.detect_skin_disease_with_options(detect_skin_disease_request, runtime)
            # 格式化输出
            def obj_to_dict(obj):
                if isinstance(obj, dict):
                    return {k: obj_to_dict(v) for k, v in obj.items()}
                elif hasattr(obj, '__dict__'):
                    return {k: obj_to_dict(v) for k, v in obj.__dict__.items() if not k.startswith('_')}
                elif isinstance(obj, list):
                    return [obj_to_dict(i) for i in obj]
                else:
                    return obj

            # 在打印前使用
            skin_analysis_data = json.dumps(obj_to_dict(response.body.data), ensure_ascii=False, indent=2)

            return skin_analysis_data
        except Exception as error:
            print(getattr(error, 'message', str(error)))
            if hasattr(error, 'data') and error.data:
                print(error.data.get("Recommend"))
            UtilClient.assert_as_string(getattr(error, 'message', str(error)))


if __name__ == '__main__':
    import os
    import glob
    from datetime import datetime

    # 获取user_TempImage文件夹中的最新图片
    user_temp_dir = os.path.join(Path(__file__).parent.parent, 'user_TempImage')
    
    # 获取文件夹中的所有图片文件
    image_files = glob.glob(os.path.join(user_temp_dir, "*.jpg")) + \
                 glob.glob(os.path.join(user_temp_dir, "*.jpeg")) + \
                 glob.glob(os.path.join(user_temp_dir, "*.png")) + \
                 glob.glob(os.path.join(user_temp_dir, "*.webp"))
    
    if not image_files:
        print(f"在 {user_temp_dir} 文件夹中没有找到图片文件")
        print("使用默认测试图片...")
        local_img_path = r'D:\桌面\Analysis_Skin\images\uploaded_20250710_210902_42683b0f.png'
    else:
        # 按修改时间排序，获取最新的图片
        image_files.sort(key=os.path.getmtime, reverse=True)
        local_img_path = image_files[0]
        print(f"使用最新上传的图片: {local_img_path}")
        print(f"上传时间: {datetime.fromtimestamp(os.path.getmtime(local_img_path)).strftime('%Y-%m-%d %H:%M:%S')}")

    # 实例化测试配置
    skin_analysis, oss_img_url = bc.skin_analysis_instantiation(local_img_path)
    # 得到分析结果
    result = Sample.main(sys.argv[1:], skin_analysis, oss_img_url)
    # 打印结果
    print(result)