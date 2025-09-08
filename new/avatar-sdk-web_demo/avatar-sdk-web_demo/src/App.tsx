import { useEffect, useRef, useState } from 'react'
import './App.css'
import {
  Button,
  ColorPicker,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Space,
  Spin,
  Switch,
  message,
} from 'antd'
import { useForm } from 'antd/es/form/Form.js'
// import { PlayerEvents, SDKEvents } from './lib/enums/events'
// import AvatarPlatform from './lib/core'
import cloneDeep from 'lodash/cloneDeep'
import AvatarPlatform, {
  PlayerEvents,
  SDKEvents,
} from './testSdk/3.1.2.1002/avatar-sdk-web_3.1.2.1002/index.js'

const InitAppInfo = {
  serverUrl: 'wss://avatar.cn-huadong-1.xf-yun.com/v1/interact',
  // serverUrl: 'wss://test.xfyousheng.com/apigateway/avatar_ray/v1/avatar',
  // serverUrl: 'wss://test.xfyousheng.com/apigateway/avatar/v1/avatar',
  // 以下信息为交互平台 创建接口服务 后 服务项目页面获取
  appId: 'd93178dd',
  apiKey: '5150e817fd0911187217a67732dda82b',
  apiSecret: 'MzA4NGQ2ZTU5ZjExMTU0YTg4YWM4ZjFi',
  sceneId: '222287810449772544',
}
function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [loglevel, setLoglevel] = useState(0)
  const [loading, setLoading] = useState(false)
  const [initForm] = useForm()
  const [apiInfoForm] = useForm()
  const [avatarConfigForm] = useForm()
  const [startAvatarForm] = useForm()
  const [textDriverForm] = useForm()
  const [audioDriverForm] = useForm()
  const [actionDriverForm] = useForm()

  const [subtitle, setSubtitle] = useState('')
  // 添加go.txt内容状态
  const [goFileContent, setGoFileContent] = useState('1It is recommended to use gentle cleaning products. Pay attention to sun protection. Maintain adequate hydration. Consider using skincare products containing niacinamide.')
  const [selectedFileName, setSelectedFileName] = useState('')
  const [lastReadTime, setLastReadTime] = useState('')
  const [fileStatus, setFileStatus] = useState('')
  const [autoMonitoring, setAutoMonitoring] = useState(false)
  const [monitoringStatus, setMonitoringStatus] = useState('')
  const [playedContent, setPlayedContent] = useState(new Set())
  const [monitoringInterval, setMonitoringInterval] = useState(null)
  const fileInputRef = useRef(null)
  
  // 文件刷新相关状态
  const [lastRefreshTime, setLastRefreshTime] = useState('')
  const [refreshLog, setRefreshLog] = useState<string[]>([])
  
  // File System Access API 相关状态
  const [fileHandle, setFileHandle] = useState(null)
  const [supportsFSA, setSupportsFSA] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const interativeRef = useRef<any>()
  
  // 检测浏览器是否支持File System Access API
  useEffect(() => {
    const checkFSASupport = () => {
      const isSupported = 'showOpenFilePicker' in window && 'showSaveFilePicker' in window
      setSupportsFSA(isSupported)
      console.log('[文件系统API] 浏览器支持状态:', isSupported ? '支持' : '不支持')
      if (isSupported) {
        setMonitoringStatus('浏览器支持File System Access API，可使用高级文件监测功能')
      } else {
        setMonitoringStatus('浏览器不支持File System Access API，将使用拖拽上传模式')
      }
    }
    checkFSASupport()
  }, [])
  
  useEffect(() => {
    return () => {
      interativeRef.current?.stop()
      if (monitoringInterval) {
        clearInterval(monitoringInterval)
      }
    }
  }, [])

  const InitSDK = () => {
    try {
      let interative = interativeRef.current
      if (!interative) {
        interativeRef.current = interative = new (AvatarPlatform as any)({
          ...initForm.getFieldsValue(),
        })

        message.success('初始化成功 可以开启后续实例方法调用')
      } else {
        message.warning('请勿多次初始化 或先销毁当前实例')
      }
    } catch (e: any) {
      console.error(e)
      message.error('初始化失败' + e?.message)
    }
  }
  const bindInteractEvent = () => {
    if (!interativeRef.current) {
      return message.warning('请初始化sdk')
    }
    interativeRef.current.removeAllListeners()
    interativeRef.current
      .on(SDKEvents.connected, (initResp: any) => {
        console.log('sdk event: connected', initResp)
      })
      .on(SDKEvents.stream_start, () => {
        console.log('sdk event: stream_start')
      })
      .on(SDKEvents.disconnected, (e: any) => {
        setLoading(false)
        console.log('sdk event: disconnected')
        if (e) {
          message.error('ws link disconnected')
          console.error(e.code, e.message, e.name, e.stack)
        }
      })
      .on(SDKEvents.asr, (asrData: any) => {
        console.log('sdk event: asr', asrData)
      })
      .on(SDKEvents.nlp, (nlpData: any) => {
        console.log('sdk event: nlp', nlpData)
      })
      .on(SDKEvents.frame_start, (frameData: any) => {
        console.log('sdk event: frameBegin', frameData)
      })
      .on(SDKEvents.frame_stop, (frameData: any) => {
        console.log('sdk event: frameEnd', frameData)
      })
      .on(SDKEvents.action_start, (actionData: any) => {
        console.log('sdk event: actionBegin', actionData)
      })
      .on(SDKEvents.action_stop, (actionData: any) => {
        console.log('sdk event: actionEnd', actionData)
      })
      .on(SDKEvents.tts_duration, (sessionData: any) => {
        console.log('sdk event: duration', sessionData)
      })
      .on(SDKEvents.subtitle_info, (subtitleData: any) => {
        console.log('sdk event: subtitle', subtitleData)
        setSubtitle(subtitleData?.text || '')
      })
      .on(SDKEvents.error, (error: any) => {
        console.log('sdk event: error', error)
      })

    message.success(
      'SDK 交互事件监听绑定成功 可以打开控制台 查看事件日志 [sdk event:]'
    )
  }
  const UnInitSDK = () => {
    interativeRef.current?.destroy()
    interativeRef.current = undefined

    message.success('UnInitSDK成功')
  }
  const getPlayer = () => {
    const player = interativeRef.current.player
    console.log('player', player)
  }
  const createPlayer = () => {
    if (!interativeRef.current) {
      return message.warning('请初始化sdk')
    }
    const player =
      interativeRef.current.player || interativeRef.current.createPlayer()
    console.log('player', player)
    return player
  }
  const bindPlayerEvent = () => {
    if (!interativeRef.current) {
      return message.warning('请初始化sdk')
    }
    const player = interativeRef.current.player
    if (!player) {
      return message.warning('当前不存在player 实例 请调用create 创建')
    }
    player.removeAllListeners()
    player
      .on(PlayerEvents.error /* "error" */, (err: any) => {
        console.log('sdk player event: player error', err)
        if (err?.code === '700005') {
          // 不支持h264
          console.log('sdk player event: player h264 not supported')
        }
      })
      ?.on(PlayerEvents.play, () => {
        console.log('sdk player event: player play')
      })
      .on(PlayerEvents.waiting, () => {
        console.log('sdk player event: player waiting')
      })
      .on(PlayerEvents.playing, () => {
        console.log('sdk player event: player playing')
      })
      .on(PlayerEvents.playNotAllowed, () => {
        console.log(
          'sdk player event: play not allowed, muted play， player call resume after user gusture'
        )
      })

    message.success(
      'SDK Player 事件监听绑定成功 可以打开控制台 查看事件日志 [sdk player event:]'
    )
  }
  const setApiInfo = () => {
    if (!interativeRef.current) {
      return message.warning('请初始化sdk')
    }
    interativeRef.current.setApiInfo({
      ...apiInfoForm.getFieldsValue(),
    })

    message.success('Api 服务信息设置成功 ')
  }
  const setGlobalParams = () => {
    if (!interativeRef.current) {
      return message.warning('请初始化sdk')
    }
    const fcolor = avatarConfigForm.getFieldsValue().subtitle.font_color
    const subtitle_font_color =
      Object.prototype.toString.call(fcolor) === '[object String]'
        ? fcolor
        : fcolor?.toHexString?.()
    const values = cloneDeep(avatarConfigForm.getFieldsValue())

    if (values.avatar.mask_region) {
      values.avatar.mask_region = JSON.parse(values.avatar.mask_region)
    } else {
      delete values.avatar.mask_region
    }
    if (!values.subtitle?.subtitle) {
      delete values.subtitle
    }
    if (!values.background?.enabled) {
      delete values.background
    } else {
      delete values.background.enabled
    }
    if (values.subtitle) {
      values.subtitle.width = values.avatar.width
      values.subtitle.font_color = subtitle_font_color
    }
    interativeRef.current.setGlobalParams({
      ...values,
    })
    message.success('全局 start 信息 设置成功 服务信息设置成功 ')
  }

  const startAvatar = async () => {
    if (!interativeRef.current) {
      return message.warning('请初始化sdk')
    }
    const values = startAvatarForm.getFieldsValue()
    setLoading(true)
    await interativeRef.current
      ?.start({
        wrapper: document.querySelector(
          '.' + values.container
        ) as HTMLDivElement,
        // preRes: {
        //   image: [
        //     {
        //       url: 'https://pygfile.peiyinge.com/business/user/bgimg/1699422531256_ec250b66142fbf375b4899cc416968b3.png',
        //     },
        //     {
        //       url: 'https://pygfile.peiyinge.com/light/user/20240530/31f7e9c5-5e76-4b24-b071-075a8f703327.jpg',
        //     },
        //   ],
        // },
      })
      .then(() => {
        console.warn('player fetch stream ed')
        message.success('连接成功 & 拉流订阅成功 & 流播放成功')
        setLoading(false)
      })
      .catch((e: any) => {
        message.error('连接失败，可以打开控制台查看信息')
        console.error(e.code, e.message, e.name, e.stack)
        setLoading(false)
      })
  }
  const driveAction = async () => {
    const { actionId } = actionDriverForm.getFieldsValue()
    if (!interativeRef.current) {
      return message.warning('请初始化sdk & 连接')
    }
    if (!actionId?.trim()) {
      return message.warning('请输入actionId')
    }
    interativeRef.current.writeCmd('action', actionId?.trim())
  }
  const writeText = async () => {
    const { text, tts, ...extend } = textDriverForm.getFieldsValue()
    if (!interativeRef.current) {
      return message.warning('请初始化sdk & 连接')
    }
    if (!text?.trim()) {
      return message.warning('请输入文本')
    }
    if (tts && !tts?.vcn) {
      delete tts.vcn
    }
    interativeRef.current
      .writeText(text, {
        tts,
        ...extend,
      })
      .then((reqId: string) => {
        message.success(`发送成功request_id: ${reqId}`)
      })
      .catch((err: any) => {
        console.error(err)
        message.error('发送失败，可以打开控制台查看信息')
      })
  }
  
  // 选择文件
  const selectGoTxtFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // 处理文件选择
  const handleFileSelect = (event: any) => {
    const file = event.target.files[0]
    if (file && file.name.endsWith('.txt')) {
      setSelectedFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e: any) => {
        const content = e.target.result
        setGoFileContent(content)
        setLastReadTime(new Date().toLocaleString())
        console.log('文件读取成功:', file.name)
      }
      reader.onerror = () => {
        console.error('文件读取失败')
      }
      reader.readAsText(file, 'UTF-8')
    } else {
      message.error('请选择.txt文件')
    }
  }

  const readGoFile = async () => {
    if (!interativeRef.current) {
      return message.warning('请初始化sdk & 连接')
    }
    
    // 从状态中读取go.txt文件内容（带状态码）
    const currentContent = goFileContent.trim()
    if (!currentContent) {
      return message.warning('go.txt内容为空')
    }
    
    // 检查状态码
    const statusCode = currentContent.charAt(0)
    if (statusCode === '0') {
      return message.warning('文件未更新，状态码为0')
    }
    
    // 跳过第一个字符（状态码），获取实际内容
    const actualContent = currentContent.substring(1)
    
    const { tts, ...extend } = textDriverForm.getFieldsValue()
    if (tts && !tts?.vcn) {
      delete tts.vcn
    }
    
    interativeRef.current
      .writeText(actualContent, {
        tts,
        ...extend,
      })
      .then((reqId: string) => {
        message.success(`go.txt文件内容发送成功 request_id: ${reqId}`)
      })
      .catch((err: any) => {
        console.error(err)
        message.error('发送失败，可以打开控制台查看信息')
      })
  }
  const interrupt = async () => {
    if (!interativeRef.current) {
      return message.warning('请初始化sdk & 连接')
    }
    interativeRef.current.interrupt()
  }

  const startRecord = () => {
    if (!interativeRef.current) {
      return message.warning('请初始化sdk & 连接')
    }
    const { nlp, full_duplex, single_seconds } =
      audioDriverForm.getFieldsValue()

    const audio_format = avatarConfigForm.getFieldValue([
      'avatar',
      'audio_format',
    ])
    const destSampleRate: any = {
      1: 16000,
      2: 24000,
    }
    if (interativeRef.current?.recorder) {
      if (nlp && interativeRef.current?.recorder?.sampleRate !== 16000) {
        // 交互拾音只支持16k 16bit
        interativeRef.current.destroyRecorder()
      } else if (
        !nlp &&
        interativeRef.current?.recorder &&
        interativeRef.current?.recorder?.sampleRate !==
          destSampleRate[audio_format]
      ) {
        // 驱动必须与 形象设置的输出声音采样率一致,
        interativeRef.current.destroyRecorder()
      }
    }
    if (!interativeRef.current?.recorder) {
      // 交互播放器必须是16000， 音频驱动 一定要与setGloableParams 全局参数avatar.audio_format
      interativeRef.current?.createRecorder({
        sampleRate: nlp ? 16000 : destSampleRate[audio_format] || 16000,
      })
    }
    const recorder = interativeRef.current?.recorder
    recorder?.startRecord(
      full_duplex ? 0 : single_seconds * 1000,
      () => {
        console.log('recorder auto stopped')
      },
      {
        nlp: nlp,
      }
    )
  }
  const stopRecorder = () => {
    if (!interativeRef.current) {
      return message.warning('请初始化sdk & 连接')
    }
    const recorder = interativeRef.current?.recorder
    recorder?.stopRecord()
  }
  const stopAvatar = async () => {
    if (!interativeRef.current) {
      return message.warning('请初始化sdk')
    }
    interativeRef.current?.stop()
  }

  const oneClickStart = async () => {
    try {
      // 1. 初始化SDK
      await InitSDK()
      
      // 2. 设置API信息
      await setApiInfo()
      
      // 3. 设置全局参数
      await setGlobalParams()
      
      // 4. 启动数字人
      await startAvatar()
      
      // 启动完成提示
      message.success('数字人启动完成！请选择go.txt文件并开启自动监测')
      
    } catch (error) {
      console.error('一键启动失败:', error)
      message.error('一键启动失败，请检查控制台信息')
    }
  }
  // File System Access API 文件选择
  const selectFileWithFSA = async () => {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{
          description: 'Text files',
          accept: {
            'text/plain': ['.txt']
          }
        }],
        multiple: false
      })
      
      setFileHandle(handle)
      setSelectedFileName(handle.name)
      console.log('[FSA] 文件选择成功:', handle.name)
      message.success(`已选择文件: ${handle.name}`)
      
      // 立即读取一次文件内容
      await readFileWithFSA(handle)
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('[FSA] 文件选择失败:', error)
        message.error('文件选择失败')
      }
    }
  }
  
  // File System Access API 文件读取
  const readFileWithFSA = async (handle = fileHandle) => {
    if (!handle) {
      console.error('[FSA] 没有文件句柄')
      return null
    }
    
    try {
      const file = await handle.getFile()
      const content = await file.text()
      const currentTime = new Date().toLocaleTimeString()
      
      console.log(`[FSA] ${currentTime} - 文件读取成功，大小: ${content.length}字符`)
      setLastReadTime(currentTime)
      setGoFileContent(content)
      
      return content
    } catch (error) {
      console.error('[FSA] 文件读取失败:', error)
      throw error
    }
  }
  
  // 拖拽上传处理函数
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }
  
  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        try {
          const content = await file.text()
          const currentTime = new Date().toLocaleTimeString()
          
          setSelectedFileName(file.name)
          setGoFileContent(content)
          setLastReadTime(currentTime)
          
          console.log(`[拖拽] ${currentTime} - 文件读取成功: ${file.name}，大小: ${content.length}字符`)
          message.success(`文件上传成功: ${file.name}`)
          
          // 检查状态码并播放
          checkStatusAndPlay(content)
          
        } catch (error) {
          console.error('[拖拽] 文件读取失败:', error)
          message.error('文件读取失败')
        }
      } else {
        message.error('请上传.txt文件')
      }
    }
  }
  
  useEffect(() => {
    return () => {
      interativeRef.current?.destroy()
      if (monitoringInterval) {
        clearInterval(monitoringInterval)
      }
    }
  }, [])

  // 自动监测功能
  const [lastStatusCode, setLastStatusCode] = useState('')
  const [lastFileContent, setLastFileContent] = useState('')
  const [lastPlayedFullContent, setLastPlayedFullContent] = useState('') // 记录上次播放的完整内容（包括状态码）
  const [cachedFileContent, setCachedFileContent] = useState('') // 缓存前一秒的文件内容
  const lastPlayedContentRef = useRef('') // 同步引用，解决异步状态更新竞态条件
  
  const startAutoMonitoring = () => {
    // 严格验证启动条件
    if (!interativeRef.current) {
      setMonitoringStatus('请先启动数字人')
      message.warning('请先启动数字人')
      return
    }
    
    // 根据浏览器支持情况验证文件选择
    if (supportsFSA && !fileHandle) {
      setMonitoringStatus('请先使用高级文件选择功能选择go.txt文件')
      message.warning('请先使用高级文件选择功能选择go.txt文件')
      return
    } else if (!supportsFSA && !selectedFileName) {
      setMonitoringStatus('请先选择go.txt文件或拖拽文件到页面')
      message.warning('请先选择go.txt文件或拖拽文件到页面')
      return
    }
    
    setAutoMonitoring(true)
    setMonitoringStatus('自动监测已开启')
    setLastStatusCode('') // 重置状态
    setLastFileContent('') // 重置内容
    setCachedFileContent('') // 重置缓存内容
    setLastPlayedFullContent('') // 重置上次播放内容
    lastPlayedContentRef.current = '' // 重置ref
    setPlayedContent(new Set()) // 清空已播放记录
    
    let retryCount = 0
    const maxRetries = 3
    
    const interval = setInterval(async () => {
      try {
        let content = ''
        
        if (supportsFSA && fileHandle) {
          // 使用File System Access API读取
          content = await readFileWithFSA()
          if (content === null) {
            console.log('[自动监测] FSA文件读取失败')
            setMonitoringStatus('FSA文件读取失败，请检查文件权限')
            return
          }
        } else if (!supportsFSA && fileInputRef.current?.files?.[0]) {
          // 传统模式 - 但由于浏览器限制，提示用户拖拽更新
          console.log('[自动监测] 传统模式下等待拖拽更新')
          setMonitoringStatus('等待文件拖拽更新... (请将修改后的文件拖拽到页面)')
          return
        } else {
          console.log('[自动监测] 没有可用的文件源')
          setMonitoringStatus('没有可用的文件源，请重新选择文件')
          stopAutoMonitoring()
          return
        }
        
        // 处理文件内容
        const currentTime = new Date().toLocaleTimeString()
        
        // 重置重试计数器（读取成功）
        retryCount = 0
        
        if (!content) {
          console.log(`[自动监测] ${currentTime} - 文件内容为空`)
          setMonitoringStatus(`[${currentTime}] 文件内容为空`)
          return
        }
        
        // 【修复竞态条件】与上次播放内容比较，并在发送请求前立即更新状态
        const currentFullContent = content.trim()
        const statusCode = content.charAt(0)
        const textContent = content.substring(1).trim()
        
        console.log(`[自动监测] ${currentTime} - 状态码: ${statusCode}, 内容: "${textContent}", 文件大小: ${content.length}字符`)
        
        // 更新监测状态显示
        setMonitoringStatus(`[${currentTime}] 状态码: ${statusCode} | 内容: ${textContent.substring(0, 20)}${textContent.length > 20 ? '...' : ''}`)
        
        // 只有状态码为1时才考虑播放
        if (statusCode === '1' && textContent) {
          // 【关键修复】使用ref进行同步重复检测逻辑
          const isContentDuplicate = currentFullContent === lastPlayedContentRef.current
          
          console.log(`[自动监测] 重复检测: 当前内容="${currentFullContent}"`)
          console.log(`[自动监测] 重复检测: 上次播放(ref)="${lastPlayedContentRef.current}"`)
          console.log(`[自动监测] 重复检测: 内容完全相同=${isContentDuplicate}`)
          
          if (isContentDuplicate && lastPlayedContentRef.current !== '') {
            console.log(`[自动监测] ✗ 内容与上次播放完全相同，跳过发送请求`)
            setMonitoringStatus(`[${currentTime}] 内容与上次播放相同，跳过处理`)
            return
          }
          
          console.log(`[自动监测] ✓ 内容与上次播放不同或首次检测，开始播放: "${textContent}"`)
          
          // 【关键修复】在发送请求前同步更新ref，防止竞态条件
          const previousContent = lastPlayedContentRef.current
          lastPlayedContentRef.current = currentFullContent
          
          const { tts, ...extend } = textDriverForm.getFieldsValue()
          if (tts && !tts?.vcn) {
            delete tts.vcn
          }
          
          interativeRef.current
            .writeText(textContent, {
              tts,
              ...extend,
            })
            .then((reqId) => {
              message.success(`自动播放成功 request_id: ${reqId}`)
              console.log(`[自动监测] 播放成功: ${reqId}, 内容: "${textContent}"`)
              
              // 播放成功后更新状态
              setLastPlayedFullContent(currentFullContent)
              setLastFileContent(textContent)
              setLastStatusCode(statusCode)
              setPlayedContent(prev => new Set([...prev, textContent]))
            })
            .catch((err) => {
              console.error('[自动监测] 播放失败:', err)
              message.error('自动播放失败')
              // 播放失败时回滚ref
              lastPlayedContentRef.current = previousContent
            })
        } else if (statusCode === '1' && !textContent) {
          console.log(`[自动监测] ✗ 跳过播放 - 文本内容为空`)
        } else if (statusCode === '0') {
          console.log(`[自动监测] ${currentTime} - 状态码为0，等待更新`)
        } else {
          console.log(`[自动监测] ${currentTime} - 未知状态码: "${statusCode}"`)
        }
        
        // 更新状态记录
        setLastStatusCode(statusCode)
      } catch (error) {
        console.error('[自动监测] 监测过程出错:', error)
        setMonitoringStatus('监测过程出错，请检查控制台')
      }
    }, 1000)
    
    setMonitoringInterval(interval)
  }
  
  const stopAutoMonitoring = () => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval)
      setMonitoringInterval(null)
    }
    setAutoMonitoring(false)
    setMonitoringStatus('自动监测已停止')
    setPlayedContent(new Set()) // 清空已播放记录
  }
  
  // 手动刷新文件内容
  const refreshFileContent = async () => {
    if (!selectedFileName || !fileInputRef.current?.files?.[0]) {
      console.error('[文件刷新] 请先选择文件')
      const logEntry = `${new Date().toLocaleTimeString()}: 请先选择go.txt文件`
      setRefreshLog(prev => [logEntry, ...prev.slice(0, 9)])
      return
    }

    try {
      const file = fileInputRef.current.files[0]
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        const content = e.target?.result as string
        const statusCode = content.charAt(0)
        const textContent = content.substring(1).trim()
        
        const now = new Date().toLocaleTimeString()
        setLastRefreshTime(now)
        setGoFileContent(content)
        
        console.log(`[文件刷新] ${now} - 状态码: ${statusCode}, 内容: "${textContent.substring(0, 50)}..."`)
        
        if (statusCode === '1' && textContent.length > 0) {
          // 检查完整内容是否与上次播放的内容相同
          const currentFullContent = content.trim()
          const isContentDuplicate = currentFullContent === lastPlayedContentRef.current
          
          console.log(`[手动刷新] 内容重复检测: 完整内容相同=${isContentDuplicate}`)
          console.log(`[手动刷新] 当前完整内容: "${currentFullContent}", 上次播放内容(ref): "${lastPlayedContentRef.current}"`)
          
          if (interativeRef.current) {
            if (!isContentDuplicate) {
              console.log(`[手动刷新] ✓ 满足播放条件，开始播放: "${textContent}"`)
              
              // 播放前同步更新ref
              const previousContent = lastPlayedContentRef.current
              lastPlayedContentRef.current = currentFullContent
              
              const { tts, ...extend } = textDriverForm.getFieldsValue()
              if (tts && !tts?.vcn) {
                delete tts.vcn
              }
              
              interativeRef.current
                .writeText(textContent, {
                  tts,
                  ...extend,
                })
                .then((reqId: string) => {
                  const logEntry = `${now}: 播放 "${textContent.substring(0, 30)}..."`
                  setRefreshLog(prev => [logEntry, ...prev.slice(0, 9)])
                  message.success(`文件内容播放成功 request_id: ${reqId}`)
                  
                  // 播放成功后更新状态
                  setLastPlayedFullContent(currentFullContent)
                  setLastFileContent(textContent)
                  setLastStatusCode(statusCode)
                })
                .catch((err: any) => {
                  console.error(err)
                  const logEntry = `${now}: 播放失败`
                  setRefreshLog(prev => [logEntry, ...prev.slice(0, 9)])
                  message.error('播放失败，可以打开控制台查看信息')
                  // 播放失败时回滚ref
                  lastPlayedContentRef.current = previousContent
                })
              
              console.log('[文件刷新] 播放完成，建议将状态码改为0')
            } else {
              console.log(`[手动刷新] ✗ 内容与上次播放相同，跳过播放`)
              const logEntry = `${now}: 内容未变化，跳过播放`
              setRefreshLog(prev => [logEntry, ...prev.slice(0, 9)])
              message.info('内容未发生变化，跳过播放')
            }
          } else {
            const logEntry = `${now}: 状态码为1但数字人未启动`
            setRefreshLog(prev => [logEntry, ...prev.slice(0, 9)])
            console.log('[文件刷新] 状态码为1但数字人未启动')
          }
        } else if (statusCode === '0') {
          const logEntry = `${now}: 状态码为0，不播放`
          setRefreshLog(prev => [logEntry, ...prev.slice(0, 9)])
          console.log('[文件刷新] 状态码为0，不播放')
        } else {
          const logEntry = `${now}: 内容为空或状态码异常`
          setRefreshLog(prev => [logEntry, ...prev.slice(0, 9)])
          console.log('[文件刷新] 内容为空或状态码异常')
        }
      }
      
      reader.onerror = () => {
        console.error('[文件刷新] 文件读取失败')
        const logEntry = `${new Date().toLocaleTimeString()}: 文件读取失败`
        setRefreshLog(prev => [logEntry, ...prev.slice(0, 9)])
      }
      
      reader.readAsText(file, 'UTF-8')
      
    } catch (error) {
      console.error('[文件刷新] 刷新过程出错:', error)
      const logEntry = `${new Date().toLocaleTimeString()}: 刷新出错`
      setRefreshLog(prev => [logEntry, ...prev.slice(0, 9)])
    }
  }

  return (
    <Spin spinning={loading} tip="Loading...">
      <div className={'wrapper'}>
        <div className="wp wrapper1"></div>
        <div className="wp wrapper2"></div>
        <p className="subtitle">{subtitle}</p>
      </div>
      <Button className="hdl" onClick={() => setDrawerOpen(true)}>
        打开调试面板
      </Button>
      <Drawer
        title="API"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={450}
        maskClosable={false}
      >
        <Space direction="vertical">
          <Button onClick={oneClickStart} block type="primary" size="large" style={{marginBottom: 16, backgroundColor: '#52c41a', borderColor: '#52c41a'}}>
            🚀 一键启动数字人
          </Button>
          
          {/* 文件选择区域 */}
          <div 
            style={{ 
              marginBottom: '16px', 
              padding: '12px', 
              backgroundColor: dragActive ? '#e6f7ff' : '#f5f5f5', 
              borderRadius: '6px',
              border: dragActive ? '2px dashed #1890ff' : '1px solid #d9d9d9',
              transition: 'all 0.3s ease'
            }}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".txt"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            
            {/* 浏览器兼容性提示 */}
            <div style={{ marginBottom: '12px', fontSize: '12px', color: '#666' }}>
              {supportsFSA ? (
                <span style={{ color: '#52c41a' }}>✓ 支持高级文件API，可持续读取文件</span>
              ) : (
                <span style={{ color: '#faad14' }}>⚠ 使用传统文件API，需要重新选择或拖拽文件</span>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
              {supportsFSA ? (
                <Button onClick={selectFileWithFSA} type="primary">
                  选择go.txt文件 (高级模式)
                </Button>
              ) : (
                <Button onClick={selectGoTxtFile}>
                  选择go.txt文件
                </Button>
              )}
              
              <Button 
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                  setSelectedFileName('')
                  setGoFileContent('')
                  setLastRefreshTime('')
                  setRefreshLog([])
                  setFileHandle(null)
                }}
                size="small"
              >
                重新选择
              </Button>
            </div>
            
            {/* 拖拽提示 */}
            <div style={{ 
              padding: '8px', 
              backgroundColor: '#fafafa', 
              borderRadius: '4px', 
              fontSize: '11px', 
              color: '#999',
              textAlign: 'center',
              border: '1px dashed #d9d9d9'
            }}>
              {dragActive ? '松开鼠标放置文件' : '或将go.txt文件拖拽到此区域'}
            </div>
            
            {selectedFileName && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                当前文件: {selectedFileName}
                {lastReadTime && <div>最后读取: {lastReadTime}</div>}
                {fileHandle && <div style={{ color: '#52c41a' }}>✓ 文件句柄已获取，支持持续读取</div>}
              </div>
            )}
            
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0f8ff', border: '1px solid #87ceeb', borderRadius: '6px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>手动刷新</div>
              <div style={{ marginBottom: '8px' }}>
                <Button 
                  onClick={refreshFileContent} 
                  type="primary"
                  size="small"
                  disabled={!selectedFileName}
                >
                  刷新文件内容
                </Button>
              </div>
              {lastRefreshTime && (
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>最后刷新: {lastRefreshTime}</div>
              )}
              <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
                {supportsFSA ? 
                  '说明：高级模式下可持续读取文件变化，也可手动刷新' : 
                  '说明：传统模式下需要手动刷新或重新选择文件'
                }
              </div>
            </div>
            
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fff7e6', border: '1px solid #ffd591', borderRadius: '6px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>自动监测功能</div>
              <div style={{ marginBottom: '8px' }}>
                {!autoMonitoring ? (
                  <Button 
                    onClick={startAutoMonitoring} 
                    type="primary"
                    size="small"
                    disabled={!interativeRef.current || !selectedFileName}
                  >
                    开启自动监测
                  </Button>
                ) : (
                  <Button 
                    onClick={stopAutoMonitoring} 
                    danger
                    size="small"
                  >
                    停止监测
                  </Button>
                )}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                状态: {autoMonitoring ? '监测中...' : '未开启'}
              </div>
              {monitoringStatus && (
                <div style={{ fontSize: '12px', color: '#1890ff', marginTop: '4px' }}>{monitoringStatus}</div>
              )}
              <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
                {supportsFSA ? 
                  '说明：高级模式下持续监测文件变化，状态码为1时自动播放' :
                  '说明：传统模式下每秒检查文件，需要重新拖拽文件以更新内容'
                }
              </div>
            </div>
            
            {/* 刷新日志 */}
            {refreshLog.length > 0 && (
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0fff0', border: '1px solid #90ee90', borderRadius: '6px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>操作日志</div>
                <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                  {refreshLog.map((log, index) => (
                    <div key={index} style={{ fontSize: '11px', color: '#333', backgroundColor: '#fff', padding: '4px 8px', marginBottom: '2px', borderRadius: '4px' }}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Button onClick={() => message.success(AvatarPlatform.getVersion())}>
            static getVersion
          </Button>
          <Space>
            <Select
              style={{ width: '100px' }}
              options={[
                { value: 0, label: 'verbose' },
                { value: 1, label: 'debug' },
                { value: 2, label: 'info' },
                { value: 3, label: 'warn' },
                { value: 4, label: 'error' },
                { value: 5, label: 'none' },
              ]}
              value={loglevel}
              onChange={(va) => setLoglevel(va)}
            ></Select>
            <Button
              onClick={() => {
                AvatarPlatform.setLogLevel(loglevel)
                message.success('日志级别设置成功 可以开启控制台查看')
              }}
            >
              static setLogLevel
            </Button>
          </Space>
          <Divider>SDK 初始化参数（初始化前设置）</Divider>
          <Form
            form={initForm}
            initialValues={{
              useInlinePlayer: true,
              binaryData: false,
            }}
          >
            <Form.Item label="使用内敛播放器" name="useInlinePlayer">
              <Switch></Switch>
            </Form.Item>
            {/* <Form.Item label="binary发送" name="binaryData">
              <Switch></Switch>
            </Form.Item> */}
            {/* <Form.Item label="静音续连" name="keepAliveTime">
              <InputNumber min={0} step={1} addonAfter="毫秒"></InputNumber>
            </Form.Item> */}
          </Form>
          <Button onClick={InitSDK} block type="primary">
            初始化SDK
          </Button>
          <Button onClick={bindInteractEvent} block type="primary">
            监听SDK交互事件
          </Button>
          <Divider>播放器</Divider>
          <Space>
            <Button onClick={getPlayer}>获取player实例</Button>
            <Button onClick={createPlayer}>create player实例</Button>
          </Space>
          <Button onClick={bindPlayerEvent} block type="primary">
            监听player事件
          </Button>
          <Divider>SDK 环境参数（start前设置）</Divider>
          <Form
            form={apiInfoForm}
            initialValues={{
              ...InitAppInfo,
            }}
          >
            <Form.Item label="serverUrl" name="serverUrl">
              <Input></Input>
            </Form.Item>
            <Form.Item label="appId" name="appId">
              <Input></Input>
            </Form.Item>
            <Form.Item label="apiKey" name="apiKey">
              <Input></Input>
            </Form.Item>
            <Form.Item label="apiSecret" name="apiSecret">
              <Input></Input>
            </Form.Item>
            <Form.Item label="sceneId" name="sceneId">
              <Input></Input>
            </Form.Item>
          </Form>
          <Button onClick={setApiInfo} block type="primary">
            SDK setApiInfo
          </Button>
          <Divider>SDK startAvatar 参数（startAvatar前设置）</Divider>
          <Form
            form={avatarConfigForm}
            initialValues={{
              avatar_dispatch: { interactive_mode: 0, content_analysis: 0 },
              stream: {
                protocol: 'xrtc',
                alpha: 0,
                bitrate: 1000000,
                fps: 25,
              },
              avatar: {
                avatar_id: '110017006',
                width: 720,
                height: 1280,
                mask_region: '[0, 0, 1080, 1920]',
                scale: 1,
                move_h: 0,
                move_v: 0,
                audio_format: 1,
              },
              tts: {
                vcn: 'x4_xiaozhong',
                speed: 50,
                pitch: 50,
                volume: 100,
              },
              subtitle: {
                subtitle: 0,
                font_color: '#ffffff',
              },
              background: {
                enabled: false,
                type: 'url',
                data: '',
              },
            }}
          >
            <Divider>打断模式全局设置</Divider>
            <Form.Item
              label="文本打断模式"
              name={['avatar_dispatch', 'interactive_mode']}
            >
              <Radio.Group>
                <Radio value={1}>打断模式</Radio>
                <Radio value={0}>追加模式</Radio>
              </Radio.Group>
            </Form.Item>
            <Divider>推流信息</Divider>
            <Form.Item label="推流格式" name={['stream', 'protocol']}>
              <Select
                style={{ width: '100px' }}
                options={[
                  { value: 'webrtc', label: 'webrtc' },
                  { value: 'xrtc', label: 'xrtc' },
                  { value: 'rtmp', label: 'rtmp 不支持播放' },
                ]}
              ></Select>
            </Form.Item>
            <Form.Item label="透明通道(xrtc)" name={['stream', 'alpha']}>
              <Radio.Group>
                <Radio value={1}>开启</Radio>
                <Radio value={0}>关闭</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="码率" name={['stream', 'bitrate']}>
              <InputNumber min={500000} max={5000000} step={1}></InputNumber>
            </Form.Item>
            <Form.Item label="fps" name={['stream', 'fps']}>
              <Slider
                min={15}
                max={25}
                step={1}
                marks={{ 15: '15', 20: '20', 25: '25' }}
              ></Slider>
            </Form.Item>
            <Divider>形象信息</Divider>
            <Form.Item label="形象ID" name={['avatar', 'avatar_id']}>
              <Input></Input>
            </Form.Item>

            <Form.Item
              label="情感分析"
              name={['avatar_dispatch', 'content_analysis']}
              extra="该参数仅超拟人非语音驱动时支持，常规请关闭"
            >
              <Radio.Group>
                <Radio value={1}>开启</Radio>
                <Radio value={0}>关闭</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="流宽" name={['avatar', 'width']}>
              <InputNumber></InputNumber>
            </Form.Item>
            <Form.Item label="流高" name={['avatar', 'height']}>
              <InputNumber></InputNumber>
            </Form.Item>
            <Form.Item label="mask_region" name={['avatar', 'mask_region']}>
              <Input></Input>
            </Form.Item>
            <Form.Item label="scale" name={['avatar', 'scale']}>
              <InputNumber min={0.1} max={1}></InputNumber>
            </Form.Item>
            <Form.Item label="move_h" name={['avatar', 'move_h']}>
              <InputNumber></InputNumber>
            </Form.Item>
            <Form.Item label="move_v" name={['avatar', 'move_v']}>
              <InputNumber></InputNumber>
            </Form.Item>
            <Form.Item
              label="音频驱动/音频输出采样率"
              name={['avatar', 'audio_format']}
            >
              <Radio.Group>
                <Radio value={1}>16k</Radio>
                <Radio value={2}>24k</Radio>
              </Radio.Group>
            </Form.Item>

            <Divider>形象信息</Divider>
            <Form.Item label="声音" name={['tts', 'vcn']}>
              <Input></Input>
            </Form.Item>
            <Form.Item label="语速" name={['tts', 'speed']}>
              <Slider min={1} max={100}></Slider>
            </Form.Item>
            <Form.Item label="语调" name={['tts', 'pitch']}>
              <Slider min={1} max={100}></Slider>
            </Form.Item>
            <Form.Item label="音量" name={['tts', 'volume']}>
              <Slider min={1} max={100}></Slider>
            </Form.Item>
            <Divider>字幕信息</Divider>
            <Form.Item
              label="字幕"
              name={['subtitle', 'subtitle']}
              extra="不启用 sdk 内部默认未启用"
            >
              <Select
                options={[
                  { value: 0, label: '关闭' },
                  { value: 1, label: '服务端字幕' },
                  // { value: 2, label: '响应字幕' },
                ]}
              ></Select>
            </Form.Item>
            <Form.Item label="字体颜色" name={['subtitle', 'font_color']}>
              <ColorPicker disabledAlpha format="hex"></ColorPicker>
            </Form.Item>
            <Divider>背景</Divider>
            <Form.Item
              label="背景"
              name={['background', 'enabled']}
              extra="不启用（默认原始训练）"
            >
              <Switch></Switch>
            </Form.Item>
            <Form.Item label="数据类型" name={['background', 'type']}>
              <Radio.Group>
                <Radio value={'url'}>url</Radio>
                <Radio value={'res_id'}>resId</Radio>
                <Radio value={'data'}>base64</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="图片数据" name={['background', 'data']}>
              <Input></Input>
            </Form.Item>
            {/* <Divider>全局上行音频配置</Divider> */}
            {/* <Form.Item
              label="采样率"
              name={['audio', 'sample_rate']}
              extra="sdk 内部默认 16000"
            >
              <Radio.Group>
                <Radio value={16000}>16000</Radio>
                <Radio value={24000}>24000</Radio>
              </Radio.Group>
            </Form.Item> */}
          </Form>
          <Button onClick={setGlobalParams} block type="primary">
            SDK setGlobalParams
          </Button>
          <Form
            form={startAvatarForm}
            initialValues={{
              container: 'wrapper1',
            }}
          >
            <Form.Item label="选择渲染区域dom" name="container">
              <Radio.Group>
                <Radio value={'wrapper1'}>左侧容器</Radio>
                <Radio value={'wrapper2'}>右侧容器</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
          <Button onClick={startAvatar} block type="primary">
            SDK start
          </Button>
          <Divider>交互 / 虚拟人驱动</Divider>
          <Form
            form={textDriverForm}
            initialValues={{
              avatar_dispatch: {
                interactive_mode: 0,
                content_analysis: 0,
              },
              text: '你好[[action=A_W_walk_left_O]]',
              tts: {
                vcn: '',
                speed: 50,
                pitch: 50,
                volume: 100,
              },
              nlp: false,
            }}
          >
            <Form.Item label="文本是否理解" name="nlp">
              <Switch></Switch>
            </Form.Item>
            <Form.Item
              label="文本打断模式"
              name={['avatar_dispatch', 'interactive_mode']}
            >
              <Radio.Group>
                <Radio value={1}>打断模式</Radio>
                <Radio value={0}>追加模式</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="情感分析"
              name={['avatar_dispatch', 'content_analysis']}
              extra="该参数仅超拟人非语音驱动时支持，常规请关闭"
            >
              <Radio.Group>
                <Radio value={1}>开启</Radio>
                <Radio value={0}>关闭</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="文本" name="text">
              <Input.TextArea></Input.TextArea>
            </Form.Item>
            <Form.Item label="声音" name={['tts', 'vcn']}>
              <Input></Input>
            </Form.Item>
            <Form.Item label="语速" name={['tts', 'speed']}>
              <Slider min={1} max={100}></Slider>
            </Form.Item>
            <Form.Item label="语调" name={['tts', 'pitch']}>
              <Slider min={1} max={100}></Slider>
            </Form.Item>
            <Form.Item label="音量" name={['tts', 'volume']}>
              <Slider min={1} max={100}></Slider>
            </Form.Item>
          </Form>
          <Button onClick={writeText} type="primary">
            文本驱动/交互 writeText
          </Button>
          <Button onClick={readGoFile} type="primary" style={{marginTop: 8}}>
            读取go.txt文件
          </Button>
          
          <Divider>go.txt内容管理</Divider>
          <div style={{marginBottom: 16}}>
            <div style={{marginBottom: 8, fontWeight: 'bold'}}>go.txt内容：</div>
            <Input.TextArea 
              value={goFileContent}
              onChange={(e) => setGoFileContent(e.target.value)}
              placeholder="请输入go.txt内容，第一个字符为状态码（0=未更新，1=更新完成）"
              rows={4}
              style={{marginBottom: 8}}
            />
            <Button 
              onClick={() => message.success('内容已更新！现在可以点击"读取go.txt文件"按钮播放新内容')}
              type="default"
              block
            >
              更新内容
            </Button>
          </div>
          
          <Divider>立即驱动指定动作</Divider>
          <Form
            form={actionDriverForm}
            initialValues={{
              actionId: '',
            }}
          >
            <Form.Item label="动作ID" name="actionId">
              <Input></Input>
            </Form.Item>
          </Form>
          <Button block onClick={driveAction} type="primary">
            立即执行动作 API driveAction
          </Button>

          <Divider>全局打断当前播报</Divider>
          <Button block onClick={interrupt} type="primary">
            发送打断 SDK API interrupt
          </Button>
          <Divider>语音交互 / 语音驱动</Divider>
          <Form
            form={audioDriverForm}
            initialValues={{
              full_duplex: 0,
              nlp: false,
              single_seconds: 20,
            }}
          >
            <Form.Item label="是否理解" name="nlp">
              <Switch></Switch>
            </Form.Item>
            <Form.Item label="语音模式" name="full_duplex">
              <Radio.Group>
                <Radio value={1}>全双工</Radio>
                <Radio value={0}>单轮</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="单轮模式端语音自动停止时间"
              name="single_seconds"
              extra="单轮模式 该时间内 用户未主动停止录音，则自动停止；sdk startRecord 支持设置时间"
            >
              <Slider min={5} max={30}></Slider>
            </Form.Item>
          </Form>
          <Button onClick={startRecord} type="primary">
            开始录音 SDK API startRecord
          </Button>
          <Button onClick={stopRecorder} type="primary">
            结束录音 SDK API stopRecord
          </Button>
          <Divider>播放器方法--前端</Divider>
          <Button
            onClick={() => {
              interativeRef.current?.player?.resume()
            }}
            type="primary"
          >
            恢复播放 SDK player API resume
          </Button>
          <p>
            由于浏览器限制，无法自动播放时，需要引导用户手动点击 并 调用 resume
            恢复播放
          </p>
          <Button
            onClick={() => {
              interativeRef.current?.player?.resize()
            }}
          >
            手动刷新渲染 SDK player API resize
          </Button>
          <Button
            onClick={() => {
              if (interativeRef.current?.player)
                interativeRef.current.player.muted = true
            }}
            type="primary"
          >
            静音 SDK player player.muted = true
          </Button>
          <Button
            onClick={() => {
              if (interativeRef.current?.player)
                interativeRef.current.player.muted = false
            }}
            type="primary"
          >
            解除静音 SDK player.muted = false
          </Button>
          <div>
            设置播放外放音量：
            <Slider
              min={0}
              max={100}
              defaultValue={100}
              onChange={(v: number) => {
                if (interativeRef.current?.player)
                  interativeRef.current.player.volume = v / 100
              }}
            ></Slider>
          </div>
          <Divider>断开链接</Divider>
          <Button onClick={stopAvatar} block type="primary">
            SDK API stop
          </Button>
          <Divider>逆初始化 销毁SDK实例</Divider>
          <Button onClick={UnInitSDK} block type="primary">
            SDK API destroy
          </Button>
        </Space>
      </Drawer>
      <div className={'panel'}>
        {/* <div
          onClick={() => {
            console.log(UserMedia.getEnumerateDevices('audiooutput'))
          }}
        >
          get output Devices
        </div>
        <div
          onClick={() => {
            console.log(UserMedia.getEnumerateDevices('audioinput'))
          }}
        >
          get input Devices
        </div>
        <div
          onClick={async () => {
            const outputs = await UserMedia.getEnumerateDevices('audiooutput')
            const output = outputs[Math.floor(Math.random() * outputs.length)]
            console.log(output)
            if (interativeRef.current?.player)
              interativeRef.current.player.setSinkId(output.deviceId)
          }}
        >
          switch Devices
        </div> */}

        {/* <div
          onClick={async () => {
            const inputs = await UserMedia.getEnumerateDevices('audioinput')
            const input = inputs[Math.floor(Math.random() * inputs.length)]
            console.log(input)
            if (interativeRef.current?.player)
              interativeRef.current.recorder?.switchDevice(input.deviceId)
          }}
        >
          switch recorder Devices
        </div> */}
      </div>
    </Spin>
  )
}

export default App
