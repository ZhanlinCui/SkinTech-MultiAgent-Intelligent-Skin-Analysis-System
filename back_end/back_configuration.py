import sys, logger_config

import ALi_skin_model.img_to_oss as img_to_oss
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path

# 将图片存放在OSS上，并获取对应的upload_url
def img_to_oss_url():
    # 初始化测试配置实例
    main_configuration = logger_config.Config().get_main_configuration()
    img_to_oss_url = logger_config.Config().get_img_to_oss()

    # 测试配置
    access_key_id = main_configuration.get('access_key_id')
    access_key_secret = main_configuration.get('access_key_secret')
    bucket_name = img_to_oss_url.get('bucket_name')
    oss_endpoint = img_to_oss_url.get('oss_endpoint')

    return access_key_id, access_key_secret, bucket_name, oss_endpoint

# 对皮肤分析进行实例化, 并将图片实例化,k并对后续操作进行简化代码操作
def skin_analysis_instantiation(custom_img_path=None):
    access_key_id, access_key_secret, bucket_name, oss_endpoint = img_to_oss_url()
    skin_analysis = logger_config.Config().get_skin_analysis()
    oss_img_url = img_to_oss.file_paths_oss_url(access_key_id, access_key_secret, bucket_name, oss_endpoint, custom_img_path)
    return skin_analysis, oss_img_url

# 对deepseek-R1的基础配置进行实例化
def deepseek_R1_instantiation():
    deepseek_llm = logger_config.Config().get_deepseek_api()
    api_key = deepseek_llm.get('api_key')
    base_url = deepseek_llm.get('base_url')
    model_name = deepseek_llm.get('model_name')
    return api_key, base_url, model_name

# 对皮肤数据可视化进行实例化
def skin_data_visualization():
    gemma3n_llm = logger_config.Config().get_gemma3n_api()

    api_key = gemma3n_llm.get('api_key')
    invoke_url = gemma3n_llm.get('invoke_url')
    model_name = gemma3n_llm.get('model_name')
    max_tokens = gemma3n_llm.get('max_tokens')

    return api_key, invoke_url, model_name, max_tokens




if __name__ == '__main__':
    pass
   
