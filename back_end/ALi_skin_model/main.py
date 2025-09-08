import os
import sys
import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import Dict, Any, Optional
import json

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 添加项目根目录到 Python 路径
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

try:
    from skin_analysis import Sample
    import back_configuration as bc
    from img_to_oss import save_and_upload
except ImportError as e:
    logger.error(f"导入模块失败: {str(e)}")
    raise

app = FastAPI(title="Skin Analysis API", description="API for skin analysis using Alibaba Cloud")

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该限制为前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/save-image")
async def save_image(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    保存上传的图片到user_TempImage文件夹
    """
    try:
        logger.info(f"收到图片保存请求，文件名: {file.filename}, 类型: {file.content_type}")
        
        # 检查文件类型
        if not file.content_type or not file.content_type.startswith('image/'):
            error_msg = f"无效的文件类型: {file.content_type}。请上传图片文件。"
            logger.warning(error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
        
        # 确保user_TempImage文件夹存在
        user_temp_dir = os.path.join(parent_dir, 'user_TempImage')
        os.makedirs(user_temp_dir, exist_ok=True)
        
        # 生成唯一文件名
        import uuid
        from datetime import datetime
        file_extension = os.path.splitext(file.filename)[1] if '.' in file.filename else '.jpg'
        unique_filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}{file_extension}"
        file_path = os.path.join(user_temp_dir, unique_filename)
        
        # 保存文件
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        logger.info(f"图片已保存到: {file_path}")
        
        # 构建图片URL (相对路径)
        image_url = f"/user_TempImage/{unique_filename}"
        
        return {
            "status": "success",
            "message": "图片已成功保存",
            "image_path": file_path,
            "image_url": image_url
        }
        
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"保存图片时发生错误: {str(e)}"
        logger.error(error_msg, exc_info=True)
        raise HTTPException(status_code=500, detail=error_msg)

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    上传图片并返回分析结果
    """
    try:
        logger.info(f"收到上传请求，文件名: {file.filename}, 类型: {file.content_type}")
        
        # 检查文件类型
        if not file.content_type or not file.content_type.startswith('image/'):
            error_msg = f"无效的文件类型: {file.content_type}。请上传图片文件。"
            logger.warning(error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
        
        try:
            # 保存文件到临时目录并上传到 OSS
            logger.info("开始上传文件到OSS...")
            oss_url = await save_and_upload(file)
            
            if not oss_url:
                error_msg = "上传文件到OSS失败，未返回URL"
                logger.error(error_msg)
                raise HTTPException(status_code=500, detail=error_msg)
                
            logger.info(f"文件已上传到OSS: {oss_url}")
            
            # 获取皮肤分析配置
            logger.info("初始化皮肤分析配置...")
            skin_analysis, _ = bc.skin_analysis_instantiation()
            
            if not skin_analysis:
                error_msg = "初始化皮肤分析配置失败"
                logger.error(error_msg)
                raise HTTPException(status_code=500, detail=error_msg)
            
            # 调用皮肤分析
            logger.info("开始皮肤分析...")
            analysis_result = Sample.main([], skin_analysis, oss_url)
            
            if not analysis_result:
                error_msg = "皮肤分析未返回结果"
                logger.error(error_msg)
                raise HTTPException(status_code=500, detail=error_msg)
            
            # 解析分析结果
            try:
                analysis_data = json.loads(analysis_result)
                logger.info("皮肤分析完成")
            except json.JSONDecodeError as e:
                error_msg = f"解析分析结果失败: {str(e)}"
                logger.error(f"{error_msg}, 原始结果: {analysis_result[:200]}...")
                analysis_data = {
                    "error": "Failed to parse analysis result", 
                    "raw_result": str(analysis_result)[:1000]
                }
            
            return {
                "status": "success",
                "image_url": oss_url,
                "analysis": analysis_data
            }
            
        except Exception as e:
            error_msg = f"处理文件时发生错误: {str(e)}"
            logger.error(error_msg, exc_info=True)
            raise HTTPException(status_code=500, detail=error_msg)
            
    except HTTPException:
        raise
        
    except Exception as e:
        error_msg = f"服务器内部错误: {str(e)}"
        logger.error(error_msg, exc_info=True)
        raise HTTPException(status_code=500, detail=error_msg)

@app.post("/api/analyze")
async def analyze_skin(file: UploadFile = File(...), question: str = "我的皮肤状况如何？"):
    """完整的皮肤分析流程"""
    try:
        # 1. 保存图片到user_TempImage
        saved_image = await save_image(file)
        
        # 2. 上传到OSS
        oss_url = await save_and_upload(file)
        
        # 3. 皮肤分析
        skin_analysis, _ = bc.skin_analysis_instantiation()
        analysis_result = Sample.main([], skin_analysis, oss_url)
        
        # 4. DeepSeek推理
        dp_api_key, dp_base_url, dp_model_name = bc.deepseek_R1_instantiation()
        from deepseek_R1_reasoning import dp_analysis_result
        reasoning_result = dp_analysis_result(
            analysis_result,
            dp_api_key,
            dp_base_url,
            dp_model_name,
            question
        )
        
        # 构建前端需要的结构化数据
        return {
            "status": "success",
            "image_path": saved_image["image_path"],
            "image_url": oss_url,
            "analysis": json.loads(analysis_result),
            "ai_reasoning": {
                "title": "🧠 AI模型推理过程",
                "subtitle": "深度学习算法分析步骤详解",
                "status": "AI模型正在推理中...",
                "content": reasoning_result["reasoning"],
                "result": reasoning_result["content"],
                "progress": 100
            }
        }
        
    except Exception as e:
        logger.error(f"分析过程中出错: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Skin Analysis API is running"}

if __name__ == "__main__":
    # 创建必要的目录
    temp_image_dir = os.path.join(os.path.dirname(__file__), 'temp_image')
    user_temp_dir = os.path.join(os.path.dirname(__file__), '..', 'user_TempImage')
    
    os.makedirs(temp_image_dir, exist_ok=True)
    os.makedirs(user_temp_dir, exist_ok=True)
    
    logger.info(f"临时图片目录: {temp_image_dir}")
    logger.info(f"用户上传图片目录: {user_temp_dir}")
    
    # 启动服务
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )
