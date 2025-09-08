# -*- coding: utf-8 -*-
import yaml
import os

CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'config.yaml')

def load_config():
    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)

class Config:
    def __init__(self):
        self._config = load_config()

    def get_main_configuration(self):
        return self._config.get('skin_analysis_main_configuration', {})

    def get_img_to_oss(self):
        return self._config.get('img_to_oss', {})

    def get_skin_analysis(self):
        return self._config.get('skin_analysis', {})
    
    def get_deepseek_api(self):
        return self._config.get('deepseek_api', {})
    
    def get_gemma3n_api(self):
        return self._config.get('gemma3n_api', {})
    
    def get_front_end(self):
        return self._config.get('front_end_configuration', {})
