# 配置文件设置指南 / Configuration Setup Guide

本项目使用多个第三方AI服务，需要您配置相应的API密钥才能正常运行。

## 必需的配置文件

### 1. 后端API配置 (Backend API Configuration)

复制配置模板并添加您的API密钥：

```bash
cp back_end/config.yaml.template back_end/config.yaml
```

然后编辑 `back_end/config.yaml` 文件，将以下占位符替换为您的真实API密钥：

- `YOUR_ALIBABA_CLOUD_ACCESS_KEY_ID`: 阿里云Access Key ID
- `YOUR_ALIBABA_CLOUD_ACCESS_KEY_SECRET`: 阿里云Access Key Secret  
- `YOUR_OSS_BUCKET_NAME`: 阿里云OSS存储桶名称
- `YOUR_DEEPSEEK_API_KEY`: DeepSeek API密钥
- `YOUR_NVIDIA_NIM_API_KEY`: NVIDIA NIM API密钥

### 2. 数字人API配置 (Digital Human API Configuration)

复制科大讯飞API配置模板：

```bash
cp "new/api相关.txt.template" "new/api相关.txt"
```

然后编辑 `new/api相关.txt` 文件，将以下占位符替换为您的科大讯飞API信息：

- `YOUR_XFYUN_SERVICE_ID`: 科大讯飞接口服务ID
- `YOUR_XFYUN_APPID`: 科大讯飞APPID
- `YOUR_XFYUN_API_KEY`: 科大讯飞APIKey
- `YOUR_XFYUN_API_SECRET`: 科大讯飞APISecret

## API服务申请指南

### 阿里云 (Alibaba Cloud)
1. 注册阿里云账号：https://www.aliyun.com/
2. 开通以下服务：
   - 图像处理服务 (Image Processing)
   - 对象存储OSS (Object Storage Service)
3. 创建AccessKey：控制台 → 用户头像 → AccessKey管理

### DeepSeek
1. 注册DeepSeek账号：https://platform.deepseek.com/
2. 获取API密钥：控制台 → API Keys

### NVIDIA NIM
1. 注册NVIDIA开发者账号：https://developer.nvidia.com/
2. 申请NIM API访问权限
3. 获取API密钥

### 科大讯飞 (iFlytek)
1. 注册讯飞开放平台账号：https://www.xfyun.cn/
2. 创建应用并申请Avatar SDK权限
3. 获取APPID、APIKey和APISecret

## 安全提醒

⚠️ **重要**: 
- 配置文件包含敏感信息，请勿将其提交到公共代码仓库
- 项目已配置 `.gitignore` 自动忽略这些敏感文件
- 建议在生产环境中使用环境变量管理API密钥

## 验证配置

配置完成后，启动项目验证：

```bash
# 启动后端
cd back_end/ALi_skin_model
python3 main.py

# 启动前端
cd front_end  
npm run dev

# 启动数字人
cd new/avatar-sdk-web_demo/avatar-sdk-web_demo
npm run dev
```

如果配置正确，所有服务应该可以正常启动。
