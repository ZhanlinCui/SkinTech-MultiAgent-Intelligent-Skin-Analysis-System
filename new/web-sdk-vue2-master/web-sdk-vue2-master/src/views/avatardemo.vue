<template>
  <div class="avatar">
    <el-container>
      <el-aside width="200px" height="840px">
        <el-row>
          <el-button style="margin: 0px" @click="initSDK()" type="primary"
            >实例化SDK</el-button
          >
          <el-button style="margin: 0px" @click="createRecoder()" type="primary"
            >创建录音器</el-button
          >
          <el-button style="margin: 0px" @click="setSDKEvenet()" type="primary"
            >设置SDK监听事件</el-button
          >
          <el-button
            style="margin: 0px"
            @click="setPlayerEvenet()"
            type="primary"
            >设置播放器监听事件</el-button
          >
          <el-button
            style="margin: 0px"
            @click="SetApiInfodialog = true"
            type="primary"
            >SetApiInfo</el-button
          >
          <el-button
            style="margin: 0px"
            @click="SetGlobalParamsdialog = true"
            type="primary"
            >SetGlobalParams</el-button
          >
          <el-button style="margin: 0px" @click="start()" type="primary"
            >Start</el-button
          >
          <el-radio v-model="nlp" :label="true">开启语义理解</el-radio>
          <el-radio v-model="nlp" :label="false">关闭语义理解</el-radio>
          <el-input
            type="textarea"
            placeholder="请输入内容,包括符号在内，最大2000字符"
            v-model="textarea"
            maxlength="2000"
            show-word-limit
            :autosize="{ minRows: 5, maxRows: 10 }"
          >
          </el-input>
          <el-input v-model="vc" placeholder="变声"></el-input>
          <el-input v-model.number="emotion" placeholder="情感系数"></el-input>
          <el-button style="margin: 0px" @click="writeText()" type="primary"
            >文本驱动</el-button
          >
          <el-button style="margin: 0px" @click="interrupt()" type="primary"
            >打断</el-button
          >
          <el-input v-model="action" placeholder="执行动作"></el-input>
          <el-button style="margin: 0px" @click="writeCmd()" type="primary"
            >执行动作</el-button
          >
          <el-button
            style="margin: 0px"
            @click="startRecord()"
            v-if="recorderbutton == false"
            type="primary"
            >开启录音</el-button
          >
          <el-button
            style="margin: 0px"
            @click="stopRecord()"
            v-if="recorderbutton == true"
            type="primary"
            >关闭录音</el-button
          >
          <el-button style="margin: 0px" @click="stop()" type="primary"
            >关闭连接</el-button
          >
          <el-button style="margin: 0px" @click="destroy()" type="primary"
            >销毁SDK</el-button
          >
        </el-row>
      </el-aside>

      <el-main class="htmleaf-content" style="padding: 0px">
        <div class="weather rain" id="wrapper"></div>
        <span>透明度</span><input type="range" id="opacityRange" min="0" max="1" step="0.1" value="1">
      </el-main>

      <!--SetApiInfo悬浮框-->
      <el-dialog title="初始化SDK" :visible.sync="SetApiInfodialog">
        <el-form :model="form">
          <span>此处参数均去交互平台-接口服务中获取</span>
          <el-form-item label="Appid" :label-width="formLabelWidth">
            <el-input
              class="widthclass"
              v-model="form.appid"
              autocomplete="off"
            ></el-input>
            <span>必填</span>
          </el-form-item>
          <el-form-item label="ApiKey" :label-width="formLabelWidth">
            <el-input
              class="widthclass"
              v-model="form.apikey"
              autocomplete="off"
            ></el-input>
            <span>必填</span>
          </el-form-item>
          <el-form-item label="ApiSecret" :label-width="formLabelWidth">
            <el-input
              class="widthclass"
              v-model="form.apisecret"
              autocomplete="off"
            ></el-input>
            <span>必填</span>
          </el-form-item>
          <el-form-item label="SceneId" :label-width="formLabelWidth">
            <el-input
              class="widthclass"
              v-model="form.sceneid"
              autocomplete="off"
            ></el-input>
            <span>必填</span>
          </el-form-item>
          <el-form-item label="ServerUrl" :label-width="formLabelWidth">
            <el-input
              class="widthclass"
              v-model="form.serverurl"
              autocomplete="off"
            ></el-input>
            <span>必填</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="SetApiInfodialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="(SetApiInfodialog = false), SetApiInfo2()"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!--SetGlobalParams悬浮框-->
      <el-dialog title="设置全局变量" :visible.sync="SetGlobalParamsdialog">
        <div style="text-align: center"><h3>打断模式全局设置</h3></div>
        <el-form :model="setglobalparamsform" :label-width="formLabelWidth">
          <el-form-item label="视频协议">
            <el-tooltip
              class="item"
              effect="dark"
              content="支持webrtc/xrtc/rtmp(控制台打印视频流地址)"
              placement="right-start"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
            <el-select
              v-model="setglobalparamsform.stream.protocol"
              placeholder="请选择视频流协议"
            >
              <el-option label="xrtc" value="xrtc"></el-option>
              <el-option label="webrtc" value="webrtc"></el-option>
              <el-option label="rtmp" value="rtmp"></el-option>
            </el-select>
            <span>必填</span>
          </el-form-item>
          <el-form-item label="透明背景">
            <el-tooltip
              class="item"
              effect="dark"
              content="仅支持xrtc协议"
              placement="right-start"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
            <el-switch v-model="setglobalparamsform.stream.alpha"></el-switch>
          </el-form-item>
          <el-form-item label="全局交互模式">
            <el-radio-group v-model="setglobalparamsform.avatar_dispatch.interactive_mode">
              <el-radio :label="0">追加模式（信息依次播报）</el-radio>
              <el-radio :label="1">打断模式（直接播报最新）</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="形象ID"
          >
            <el-input
              class="widthclass"
              v-model="setglobalparamsform.avatar.avatar_id"
              autocomplete="on"
              placeholder="到交互平台-接口服务-形象列表中获取id"
            ></el-input>
            <span>必填</span>
            </el-form-item>
            <el-form-item
            label="分辨率高"
          >
            <el-input
              class="widthclass"
              v-model="setglobalparamsform.avatar.height"
              autocomplete="on"
            ></el-input>
            </el-form-item>
            <el-form-item
            label="分辨率宽"
          >
            <el-input
              class="widthclass"
              v-model="setglobalparamsform.avatar.width"
              autocomplete="on"
            ></el-input>
          </el-form-item>
          <el-form-item label="音频采样率">
            <el-radio-group v-model="setglobalparamsform.avatar.audio_format">
              <el-radio :label="1">16K(传1)</el-radio>
              <el-radio :label="2">24K(传2，大部分情况默认24K即可)</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="形象裁剪"
            v-if="setglobalparamsform.avatar.mask_region != null"
          >
            <el-input
              class="widthclass"
              v-model="setglobalparamsform.avatar.mask_region"
              autocomplete="on"
              placeholder="对形象进行裁剪[从左到右,从上到下,从右到左,从下到上]"
            ></el-input>
          </el-form-item>
          <el-form-item label="发音人">
            <el-input
              class="widthclass"
              v-model="setglobalparamsform.tts.vcn"
              autocomplete="on"
              placeholder="到交互平台-接口服务-声音列表中获取id"
            ></el-input>
            <span>必填</span>
          </el-form-item>
          <el-form-item label="情感">
            <el-input
              class="widthclass"
              v-model.number="setglobalparamsform.tts.emotion"
              autocomplete="on"
              placeholder="到交互平台-接口服务-声音列表中获取id"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否开启字幕">
            <el-radio-group v-model="setglobalparamsform.subtitle.subtitle">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0"
                >关闭</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="字体颜色">
          <el-color-picker v-model="setglobalparamsform.subtitle.font_color"></el-color-picker>
          </el-form-item>
          <el-form-item label="是否开启背景图">
            <el-radio-group v-model="setglobalparamsform.enable">
              <el-radio :label="true">开启</el-radio>
              <el-radio :label="false"
                >关闭</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="背景图片">
            <el-radio-group v-model="setglobalparamsform.background.type">
              <el-radio label="url">URL</el-radio>
              <el-radio label="res_key"
                >res_key(到交互平台-素材管理中获取)</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="背景数据">
            <el-input
              v-model="setglobalparamsform.background.data"
              autocomplete="on"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-form :model="form"> </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="SetGlobalParamsdialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="(SetGlobalParamsdialog = false), SetGlobalParams()"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
//模块导入
import AvatarPlatform, {
  PlayerEvents,
  SDKEvents,
} from "../vm-sdk/avatar-sdk-web_3.1.1.1011/index.js";

//动态虚拟人调节透明度
document.addEventListener("DOMContentLoaded",function(){
    const div = document.getElementById('wrapper');
    const range = document.getElementById('opacityRange');

    range.addEventListener('input', function () {
      div.style.opacity = this.value;
    });
})

let avatarPlatform2 = null;
let recorder = null;
export default {
  name: "avatarComponent",
  data() {
    return {
      SetApiInfodialog: false,
      SetGlobalParamsdialog: false,
      form: {
        appid: "",//到交互平台-接口服务中获取
        apikey: "",//到交互平台-接口服务中获取
        apisecret: "",//到交互平台-接口服务中获取
        sceneid: "",//到交互平台-接口服务中获取，即"接口服务ID"
        serverurl: "wss://avatar.cn-huadong-1.xf-yun.com/v1/interact",//接口地址，无需更改
      },
      setglobalparamsform: {
        stream: {
          protocol: "xrtc",//（必传）实时视频协议，支持webrtc/xrtc/rtmp，其中只有xrtc支持透明背景，需参数alpha传1
          fps: 25,//（非必传）视频刷新率,值越大，越流畅，取值范围0-25，默认25即可
          bitrate: 1000000,//（非必传）视频码率，值越大，越清晰，对网络要求越高，默认1000000即可
          alpha: false,//（非必传）是否开启透明背景，0关闭1开始，需配合protocol=xrtc使用
        },
        avatar: {
          avatar_id: "110117005",//（必传）授权的形象资源id，请到交互平台-接口服务-形象列表中获取
          width: 1080,//（非必传）视频分辨率宽（不是画布的宽，调整画布大小需调整名为wrapper的div宽）
          height: 1920,//（非必传）视频分辨率高（不是画布的高，调整画布大小需调整名为wrapper的div高）
          mask_region: "[0,0,1080,1920]",//（非必传）形象裁剪参数，[从左到右，从上到下，从右到左，从下到上]
          scale: 1,//（非必传）形象缩放比例，取值范围0.1-1
          move_h: 0,//（非必传）形象左右移动
          move_v: 0,//（非必传）形象上下移动
          audio_format: 1,//（非必传）音频采样率，传1即可
        },
        tts: {
          vcn: "x4_lingxiaoying_assist",//（必传）授权的声音资源id，请到交互平台-接口服务-声音列表中获取
          speed: 50,//（非必传）语速
          pitch: 50,//（非必传）语调
          volume: 100,//（非必传）音量
          emotion:13,//（非必传）情感系数，仅带有情感能力的超拟人音色支持该能力，普通音色不支持
        },
        avatar_dispatch: {
          interactive_mode: 1,//（非必传）0追加模式，1打断模式
        },
        subtitle:{
          subtitle:1,//（非必传）开启字幕，2D形象支持字幕，透明背景不支持字幕，3D形象不支持字幕（3D形象多为卡通形象，2D多为真人形象）
          font_color:"#FFFFFF",//（非必传）字体颜色
          font_name:"Sanji.Suxian.Simple",//（非必传）不支持自定义字体，若不想使用默认提供的
          //字体，那么可以设置asr和nlp监听事件，去获取语音识别和语义理解的文本，自己前端贴字体。
          //支持一下字体：'Sanji.Suxian.Simple','Honglei.Runninghand.Sim','Hunyuan.Gothic.Bold',
          //'Huayuan.Gothic.Regular','mainTitle'
          position_x:100,//（非必传）设置字幕水平位置，必须配置width、height一起使用，否则字幕不显示
          position_y:0,//（非必传）设置字幕竖向位置，必须配置width、height一起使用，否则字幕不显示
          font_size:10,//（非必传）设置字幕字体大小，取值范围：1-10
          width:100,//（非必传）设置字幕宽
          height:100,//（非必传）设置字幕高
        },
        enable:false,//demo中用来控制是否开启背景的参数，与虚拟人参数无关
        background: {
          type: "res_key",//（非必传）上传图片的类型，支持url以及res_key。（res_key请到交互平台-素材管理-背景中上传获取)
          data: "22SLM2teIw+aqR6Xsm2JbH6Ng310kDam2NiCY/RQ9n6dw47gMO+7gGUJfWWfkqD3IxsU/HMK1uJTTxxF2llcKSM4dlSdBy0Piag/DndHocqs32kTOwXUw6lkyggYQBXF0uwTv9jVFm1ZjZgSehV3kpx5RTvizZ9MqEI8lotCRvokC9HLI0pGfKtSmlKgCKL+OUoc9QI5HW3wLtYbLersumd4UCKEPk/uWAdKEh4ntSJiW2km8waGFsg/VSNFj5vaDK3LC4PxfsRvi1a2veZW7JUs/VOleE9wwgTH+A/oqPPcyksBY7aQ4TxYjvS9Qj9LtXkvOwttQMgPGwoxlqBEBhR/xLUwmecHkHzgjACFtxE=",
          //（非必传）图片的值，当type='url'时,data='http://xxx/xxx.png'，当type='res_key'时，data='res_key值'（res_key请到交互平台-素材管理-背景中上传获取)
        }
      },
      formLabelWidth: "120px",
      textarea: "",
      vc: "",
      recorderbutton: false,
      nlp: false,
      emotion:0,
      action:"A_RH_hello_O",
      volume:100,
    };
  },
  methods: {
    initSDK() {
      //必须先实例化SDK，再去调用其挂载的方法
      avatarPlatform2 = new AvatarPlatform();
      if (avatarPlatform2 != null) {
        this.open2("实例化SDK成功");
      }
    },
    createRecoder() {
      if (avatarPlatform2 != null) {
        recorder = avatarPlatform2.createRecorder();
        this.open2("创建录音器成功");
      } else {
        alert("请实例化SDK实例");
      }
    },
    setSDKEvenet() {
      //绑定SDK事件
      if (avatarPlatform2 != null) {
      avatarPlatform2
        .on(SDKEvents.connected, function (initResp) {
          console.log("SDKEvent.connect:initResp:", initResp);
        })
        .on(SDKEvents.stream_start, function () {
          console.log("stream_start");
        })
        .on(SDKEvents.disconnected, function (err) {
          console.log("SDKEvent.disconnected:", err);
          if (err) {
            // 因为异常 而导致的断开！ 此处可以进行 提示通知等
            console.error("ws link disconnected because of Error");
            console.error(e.code, e.message, e.name, e.stack);
          }
        })
        .on(SDKEvents.nlp, function (nlpData) {
          console.log("语义理解内容nlp:", nlpData);
        })
        .on(SDKEvents.frame_start, function (frame_start) {
          console.log(
            "推流开始（可以看作一段文本开始播报时间点）frame_start:",
            frame_start
          );
        })
        .on(SDKEvents.frame_stop, function (frame_stop) {
          console.log(
            "推流结束（可以看作一段文本结束播报时间点）frame_stop:",
            frame_stop
          );
        })
        .on(SDKEvents.error, function (error) {
          console.log("错误信息error:", error);
        })
        .on(SDKEvents.connected, function () {
          console.log("connected");
        })
        .on(SDKEvents.asr, function (asrData) {
          console.log("语音识别数据asr:", asrData);
        })
        .on(SDKEvents.tts_duration, function (ttsData) {
          console.log("语音合成用时tts：", ttsData);
        })
        .on(SDKEvents.subtitle_info, function (subtitleData) {
          console.log("subtitleData：", subtitleData);
        })
        .on(SDKEvents.action_start, function (action_start) {
          console.log(
            "动作推流开始（可以看作动作开始时间节点）action_start:",
            action_start
          );
        })
        .on(SDKEvents.action_stop, function (action_stop) {
          console.log(
            "动作推流结束（可以看作动作结束时间点）action_stop：",
            action_stop
          );
        });
      this.open2("监听SDK事件成功");
      }else{
        alert("请先实例化SDK")
      }
    },
    setPlayerEvenet() {
      if (avatarPlatform2 != null) {
      //绑定播放器事件
      const player = avatarPlatform2.createPlayer();
      player
        .on(PlayerEvents.play, function () {
          console.log("paly");
        })
        .on(PlayerEvents.playing, function () {
          console.log("playing");
        })
        .on(PlayerEvents.waiting, function () {
          console.log("waiting");
        })
        .on(PlayerEvents.stop, function () {
          console.log("stop");
        })
        .on(PlayerEvents.playNotAllowed, function () {
          console.log(
            "playNotAllowed：触发了游览器限制自动播放策略，播放前必须与游览器产生交互（例如点击页面或者dom组件），触发该事件后调用avatarPlatform2.player.resume()方法来接触限制"
          );
          player.resume();
        });
      this.open2("监听播放器事件成功");
      }else{
        alert("请先实例化SDK")
      }
    },
    SetApiInfo2() {
      if (avatarPlatform2 == null) {
        alert("请先实例化SDK");
      } else {
        console.log("设置setApiInfo");
        const params = {
          appId: this.form.appid,
          apiKey: this.form.apikey,
          apiSecret: this.form.apisecret,
          serverUrl: this.form.serverurl,
          sceneId: this.form.sceneid,
        };
        console.log("初始化SDK信息：", params);
        //初始化SDK
        avatarPlatform2.setApiInfo(params);
        this.open2("初始化SDK成功");
      }
    },
    SetGlobalParams() {
      if (avatarPlatform2 != null) {
        let params = Object.assign({}, this.setglobalparamsform);
        console.log("this.setglobalparamsform.stream.alpha",this.setglobalparamsform.stream.alpha)
        if(this.setglobalparamsform.enable == false){
          delete params.background;
          delete params.enable;
        }
        console.log("this.setglobalparamsform",this.setglobalparamsform)
        if(this.setglobalparamsform.stream.alpha == true){
          console.log("设置alpha=1")
          params.stream.alpha = 1
        }else{
          console.log("设置alpha=0")
          params.stream.alpha = 0
        }
        console.log("设置的全局变量为：",params);
        avatarPlatform2.setGlobalParams(params);
        this.open2("设置全局变量成功")
      } else {
        alert("请先实例化SDK");
      }
    },
    start() {
      if(avatarPlatform2!=null){
      avatarPlatform2
        .start({ wrapper: document.querySelector("#wrapper") })
        .catch((e) => {
          console.error(e.code, e.message, e.name, e.stack);
        });
      }else{
        alert("请先实例化SDK")
      }

    },
    writeText() {
      if(avatarPlatform2 != null){
      const text = this.textarea;
      if (text != "" && this.vc == "") {
        avatarPlatform2.writeText(text, {
          nlp: this.nlp,//是否开启语义理解
          tts: {
            volume: 100,
          },
        });
      } else if (text != "" && this.vc != ""){
        avatarPlatform2.writeText(text, {
          nlp: this.nlp,//是否开启语义理解
          tts: {
            vcn:this.vc,//变声
            volume: 100,
            emotion:this.emotion,
          },
        });
      }else {
        alert("内容不许为空");
      }
      }else {
        alert("请先实例化SDK")
      }

    },
    writeCmd(){
      avatarPlatform2.writeCmd("action",this.action);
    },
    interrupt(){
      if(avatarPlatform2 != null){
      avatarPlatform2.interrupt();
      }else {
        alert("请先实例化SDK")
      }
    },
    startRecord() {
      if(avatarPlatform2 != null){
      avatarPlatform2.recorder.startRecord(0, ()=>{
        console.warn('STOPED RECORDER')
      }, {
        nlp: true,
        avatar_dispatch: {
          interactive_mode: 0//交互模式（追加或打断）
        }
      });
      //关闭录音按钮显示
      this.recorderbutton = true;
      }else {
        alert("请先实例化SDK")
      }
    },
    stopRecord() {
      if(avatarPlatform2 != null){
      avatarPlatform2.recorder.stopRecord();
      //开启录音按钮显示
      this.recorderbutton = false;
      }else {
        alert("请先实例化SDK")
      }
    },
    stop() {
      if(avatarPlatform2 != null){
      avatarPlatform2.stop();
      }else {
        alert("请先实例化SDK")
      }
    },
    destroy() {
      if(avatarPlatform2 != null){
      //销毁SDK示例，内部包含stop协议，重启需重新示例化avatarPlatform实例
      avatarPlatform2.destroy();
      avatarPlatform2 = null;
      }else {
        alert("请先实例化SDK")
      }
    },
    open2(text) {
      this.$message({
        message: text,
        type: "success",
      });
    },
  },

  beforeDestroy(){
    //关闭页面时调用stop协议，确保链接断开，释放资源
    if(avatarPlatform2){
      avatarPlatform2.stop();
    }
  }
};
</script>

<style scoped>
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
  border: none;
}
.el-button {
  width: 200px;
  margin: 0px;
}
#wrapper {
  height: 100%;
  width: 100%;
}
.error {
  border-block-color: red;
}
.widthclass {
  width: 400px;
}
span {
  color: red;
}
</style>