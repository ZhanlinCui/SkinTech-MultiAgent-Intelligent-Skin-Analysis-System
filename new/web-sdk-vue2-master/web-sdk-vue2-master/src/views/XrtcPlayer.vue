<template>
<div>
    <div class="wrapperPlayer">

    </div>
    <button @click="play()">播放</button>
</div>
</template>

<script>
import {RTCPlayer} from "../vm-sdk/player/rtcplayer.esm.js"

const player = new RTCPlayer();
export default ({
    data(){
        return{

        }
    },
    methods:{
        //设置监听事件，有助于观察播放阶段
    play(){
        player.resume();
        player?.on("play",function(){
            console.log("play事件")
        })
        .on("playing",function(){
            console.log("playing事件")
        })
        .on("waiting",function(){
            console.log("waiting事件")
        })
        .on("error",function(e){
            console.log("error:",e)
        })
        .on("not-allowed",function(){
            console.log("触发游览器限制播放策略，播放前必须要先与游览器产生交互（例如点击页面或者dom组件),触发该事件后去调用resume（）方法解除限制")
            player.resume();
        });
        //XRTC协议设置参数如下：
        // player.playerType = 12;
        // player.stream = {
        //     sid:"vms000ec4da@dx195f094539d6f19882",
        //     server:"https://xrtc-cn-east-2.xf-yun.com",
        //     auth:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIxMDAwMDAwMDAxIiwidGltZSI6MTY0ODAxODQ2MTU0MywiaWF0IjoxNjQ4MTkxMjQyfQ.CTcOh_kCLqvvglo5VLVnjgpZzoFpzk7Un3Et0c9dhUs",
        //     appid:"1000000001",
        //     userId:"123123123",
        //     roomId:"ase0001bbe2hu19632f0f6070442142",
        //     timeStr:"123412341324",
        // }

        //WebRtc协议设置参数如下：
        player.playerType = 6;
        player.stream = {
            sid:"e754f25f-509d-ee77-29f9-4e4b567597e1",
            streamUrl:"webrtc://srs-stream.cn-huadong-1.xf-yun.com:19850/live/a78ca3f0?stream=a78ca3f0"
        }

        //VideSize的宽高需与虚拟人保持一致
        player.videoSize = { 
            width: 720,
            height: 1280,
        }
        
        //将视频流填充进容器中
        player.container = document.querySelector(".wrapperPlayer")

        //开始播放
        player.play();

        }

    }
})
</script>

<style scoped>
*{
  margin:0px;
  padding:0px;
  box-sizing: border-box;
  border:none;
}
.wrapperPlayer{
    height: 480px;
    width:270px;
    background-color: aqua;
}

</style>
