# -*- coding: utf-8 -*-
"""
日志管理模块
自动创建按日期命名的日志文件，收集运行过程中的错误信息
"""

import logging
import os
import sys
from datetime import datetime
from logging.handlers import RotatingFileHandler
import traceback
import functools

class DailyLogger:
    """按日期管理的日志记录器"""
    
    def __init__(self, log_dir="logger_log"):
        self.log_dir = log_dir
        self.current_date = None
        self.logger = None
        self._ensure_log_dir()
        self._setup_logger()
    
    def _ensure_log_dir(self):
        """确保日志目录存在"""
        if not os.path.exists(self.log_dir):
            os.makedirs(self.log_dir)
            print(f"[日志] 创建日志目录: {self.log_dir}")
    
    def _get_current_date(self):
        """获取当前日期字符串 YYYY-M-D 格式"""
        now = datetime.now()
        return f"{now.year}-{now.month}-{now.day}"
    
    def _get_log_filename(self, date_str):
        """获取日志文件名"""
        return os.path.join(self.log_dir, f"{date_str}.log")
    
    def _setup_logger(self):
        """设置日志记录器"""
        current_date = self._get_current_date()
        
        # 如果日期变化，重新设置logger
        if self.current_date != current_date:
            self.current_date = current_date
            
            # 创建新的logger
            logger_name = f"daily_logger_{current_date}"
            self.logger = logging.getLogger(logger_name)
            
            # 清除之前的handlers
            for handler in self.logger.handlers[:]:
                self.logger.removeHandler(handler)
            
            self.logger.setLevel(logging.DEBUG)
            
            # 文件处理器
            log_filename = self._get_log_filename(current_date)
            file_handler = RotatingFileHandler(
                log_filename, 
                maxBytes=10*1024*1024,  # 10MB
                backupCount=5,
                encoding='utf-8'
            )
            
            # 控制台处理器
            console_handler = logging.StreamHandler(sys.stdout)
            
            # 设置格式
            formatter = logging.Formatter(
                '%(asctime)s - %(levelname)s - %(module)s:%(funcName)s:%(lineno)d - %(message)s',
                datefmt='%Y-%m-%d %H:%M:%S'
            )
            
            file_handler.setFormatter(formatter)
            console_handler.setFormatter(formatter)
            
            # 添加处理器
            self.logger.addHandler(file_handler)
            self.logger.addHandler(console_handler)
            
            # 防止重复日志
            self.logger.propagate = False
            
            print(f"[日志] 日志文件: {log_filename}")
    
    def _check_date_change(self):
        """检查日期是否变化，如果变化则重新设置logger"""
        current_date = self._get_current_date()
        if self.current_date != current_date:
            self._setup_logger()
    
    def info(self, message):
        """记录信息日志"""
        self._check_date_change()
        self.logger.info(message)
    
    def warning(self, message):
        """记录警告日志"""
        self._check_date_change()
        self.logger.warning(message)
    
    def error(self, message, exc_info=None):
        """记录错误日志"""
        self._check_date_change()
        if exc_info:
            self.logger.error(message, exc_info=exc_info)
        else:
            self.logger.error(message)
    
    def exception(self, message):
        """记录异常日志（自动包含堆栈信息）"""
        self._check_date_change()
        self.logger.exception(message)
    
    def debug(self, message):
        """记录调试日志"""
        self._check_date_change()
        self.logger.debug(message)

# 全局日志实例
daily_logger = DailyLogger()

def log_exceptions(func):
    """装饰器：自动捕获和记录函数异常"""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            daily_logger.exception(f"函数 {func.__name__} 发生异常: {str(e)}")
            raise
    return wrapper

def log_function_call(func):
    """装饰器：记录函数调用"""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        daily_logger.debug(f"调用函数: {func.__name__}")
        try:
            result = func(*args, **kwargs)
            daily_logger.debug(f"函数 {func.__name__} 执行成功")
            return result
        except Exception as e:
            daily_logger.error(f"函数 {func.__name__} 执行失败: {str(e)}")
            raise
    return wrapper

# 便捷函数
def log_info(message):
    """记录信息日志"""
    daily_logger.info(message)

def log_warning(message):
    """记录警告日志"""
    daily_logger.warning(message)

def log_error(message, exc_info=None):
    """记录错误日志"""
    daily_logger.error(message, exc_info=exc_info)

def log_exception(message):
    """记录异常日志"""
    daily_logger.exception(message)

def log_debug(message):
    """记录调试日志"""
    daily_logger.debug(message)

if __name__ == "__main__":
    # 测试日志功能
    log_info("日志系统启动")
    log_debug("这是一个调试信息")
    log_warning("这是一个警告信息")
    
    try:
        1 / 0
    except Exception as e:
        log_exception("测试异常捕获")
    
    log_info("日志系统测试完成")
