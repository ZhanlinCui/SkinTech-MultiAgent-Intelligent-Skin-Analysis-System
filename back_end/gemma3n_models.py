import re, sys, json, urllib.parse, requests
from skin_analysis import Sample
import back_configuration as bc

sys.stdout.reconfigure(encoding='utf-8')

def clean_json_string(json_str):
    """清理JSON字符串，处理重复键等问题"""
    try:
        # 处理重复的plugins键问题
        # 使用正则表达式找到并移除重复的plugins块

        # 首先找到第一个plugins块的位置
        first_plugins_match = re.search(r'"plugins"\s*:\s*\{', json_str)
        if not first_plugins_match:
            return json_str

        # 找到第二个plugins块并移除它
        # 查找第二个plugins出现的位置
        second_plugins_start = json_str.find('"plugins"', first_plugins_match.end())
        if second_plugins_start == -1:
            return json_str  # 没有重复的plugins

        # 找到第二个plugins块的结束位置
        # 需要匹配对应的大括号
        brace_count = 0
        i = second_plugins_start
        while i < len(json_str):
            if json_str[i] == '{':
                brace_count += 1
            elif json_str[i] == '}':
                brace_count -= 1
                if brace_count == 0:
                    # 找到了匹配的结束大括号
                    # 移除整个第二个plugins块（包括前面的逗号）
                    before_second_plugins = json_str[:second_plugins_start].rstrip()
                    if before_second_plugins.endswith(','):
                        before_second_plugins = before_second_plugins[:-1]

                    after_second_plugins = json_str[i+1:]

                    cleaned = before_second_plugins + after_second_plugins
                    return cleaned
            i += 1

        # 如果没有找到匹配的结束大括号，返回原始字符串
        return json_str

    except Exception as e:
        # 如果清理失败，返回原始字符串
        return json_str

def get_chart_config_from_nim(data, api_key, invoke_url, model_name, max_tokens):
    """
    用 NVIDIA NIM 的 google/gemma-3n-e4b-it 模型生成 Chart.js 配置
    """
    prompt = f"""
你是一个专业数据可视化专家。请根据以下数据内容，分析其数据特征（如类别数量、数值分布、对比关系等），
推荐最适合的可视化图表类型（如雷达图、柱状图、饼图等），并自动选择合适的配色和对比度，使不同类别对比清晰。
最后只输出适用于 Chart.js 的 config JSON（不要输出任何解释说明），config 要包含合适的 type、labels、datasets、options（如颜色、标题、legend等）。
数据：{json.dumps(data, ensure_ascii=False, indent=2)}
"""
    stream = False

    # 添加更详细的 headers
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    payload = {
        "model": model_name,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens,
        "temperature": 0.2,
        "top_p": 0.7,
        "frequency_penalty": 0.0,
        "presence_penalty": 0.0,
        "stream": stream
    }

    try:
        response = requests.post(invoke_url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()  # 检查 HTTP 错误
        
        if not response.text:
            raise Exception("API 返回空响应")
            
        result = response.json()
        
        # 添加更多的错误检查
        if "choices" not in result or not result["choices"]:
            raise Exception("API 响应中缺少 choices 字段")
            
        # 取出大模型返回的内容
        content = result["choices"][0]["message"]["content"]

        # 提取 config JSON，兼容多种输出格式
        match = re.search(r"```json\s*(\{.*?\})\s*```", content, re.DOTALL)
        if match:
            config_str = match.group(1)
        else:
            match = re.search(r"(\{.*\})", content, re.DOTALL)
            if match:
                config_str = match.group(1)
            else:
                raise ValueError("未能从大模型输出中提取到合法的 JSON 配置！原始内容：" + content)
                
        # 清理JSON字符串，处理重复键等问题
        config_str = clean_json_string(config_str)
        config = json.loads(config_str)
        return config
        
    except requests.exceptions.RequestException as e:
        # 导入日志模块并记录错误
        try:
            from daily_logger import log_error
            log_error(f"Gemma3n网络请求错误: {str(e)}")
        except:
            print(f"网络请求错误: {str(e)}")
        raise
    except json.JSONDecodeError as e:
        try:
            from daily_logger import log_error
            log_error(f"Gemma3n JSON解析错误: {str(e)}")
            if 'response' in locals() and hasattr(response, 'text'):
                log_error(f"Gemma3n API响应: {response.text}")
        except:
            print(f"JSON 解析错误: {str(e)}")
            if 'response' in locals() and hasattr(response, 'text'):
                print(f"API 响应: {response.text}")
        raise
    except Exception as e:
        try:
            from daily_logger import log_error
            log_error(f"Gemma3n模型调用发生错误: {str(e)}")
        except:
            print(f"发生错误: {str(e)}")
        raise

def generate_quickchart_url(config):
    config_json = json.dumps(config, separators=(',', ':'))
    encoded_config = urllib.parse.quote(config_json)
    chart_url = f"https://quickchart.io/chart?c={encoded_config}"
    return chart_url

#=========结果分析==========
def gemma3n_skin_quickchartURL(data, api_key, invoke_url, model_name, max_tokens): 
    # 1. 让 NIM 生成 config
    config = get_chart_config_from_nim(data, api_key, invoke_url, model_name, max_tokens)
    # 2. 生成 quickchart URL
    chart_url = generate_quickchart_url(config)
    return chart_url, config
    
if __name__ == '__main__':
    # 实例化基础配置
    api_key, invoke_url, model_name, max_tokens = bc.skin_data_visualization()
    skin_analysis, oss_img_url = bc.skin_analysis_instantiation(custom_img_path=r'D:\桌面\Analysis_Skin\images\image1.png')
    # 得到分析结果
    data = Sample.main(sys.argv[1:], skin_analysis, oss_img_url)
    chart_url, config = gemma3n_skin_quickchartURL(data, api_key, invoke_url, model_name, max_tokens)
    print(chart_url)
