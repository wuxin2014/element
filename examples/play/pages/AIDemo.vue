<template>
  <div class="ai-box-div">
    <!-- 悬浮球 -->
    <vue-draggable-resizable
      @dragging="onDragging"
      :resizable="false"
      :draggable="true"
      :w="67"
      :h="67"
      :x="position.x"
      :y="position.y"
      class-name="custom-draggable"
      style="border-radius: 50%"
    >
      <div
        class="floating-ball"
        @mousedown="startDrag"
        @click="toggleChat"
        v-if="isShowAi"
        @mouseover="showChatBox = true"
        @mouseleave="showChatBox = false"
      >
        <div class="ai-img">
          <img src="./aiImage/ai.png" alt="AI 头像" />
        </div>
      </div>
    </vue-draggable-resizable>
    <!-- 悬浮球旁条形框 -->
    <div
      class="chat-box"
      v-if="showChatBox"
      :style="{
        left: position.x - chatWidth - 10 + 'px',
        top: position.y + ballSize / 2 - chatHeight / 2 + 100 + 'px',
      }"
    >
      <div>问问路宝</div>
      <div style="cursor: pointer">
        <img style="width: 15px; height: 18px" src="./aiImage/语音.png" alt="语音" />
      </div>
      <div
        style="cursor: pointer"
        @click="(showDialog = true), (showChatBox = false), (isShowAi = false)"
      >
        <img style="width: 25px; height: 23px" src="./aiImage/键盘.png" alt="键盘" />
      </div>
    </div>
    <!-- 对话框 -->
    <vue-draggable-resizable
      :w="450"
      :h="dynamicHeight"
      :x="position.x - 150"
      :y="position.y - 50"
      :draggable="true"
      :resizable="false"
      v-if="showDialog"
      :max-width="800"
      :max-height="800"
      :min-width="450"
      :min-height="226"
      ref="dialogContent"
      :drag-cancel="'.drag-cancel'"
      class-name="custom-draggable"
    >
      <div class="dialog-box" ref="dialogBox">
        <!-- 右下角 -->
        <div
          class="drag-cancel resizer bottom-right"
          @mousedown="startResize($event, 'br')"
        ></div>
        <!-- 左下角 -->
        <div
          class="drag-cancel resizer bottom-left"
          @mousedown="startResize($event, 'bl')"
        ></div>
        <!-- 右上角 -->
        <div
          class="drag-cancel resizer top-right"
          @mousedown="startResize($event, 'tr')"
        ></div>
        <!-- 左上角 -->
        <div
          class="drag-cancel resizer top-left"
          @mousedown="startResize($event, 'tl')"
        ></div>
 
        <div class="dialog-header drag-handle">
          <div class="little-img" @click="(showDialog = false), (isShowAi = true)">
            <img src="./aiImage/ai.png" alt="AI头像" class="ai-avatar" />
          </div>
          <el-input
            autosize
            type="textarea"
            v-model="query"
            ref="inputRef"
            placeholder="AI搜索、提问"
            style="width: 88%"
            @keydown.native.enter.prevent="sendQuery"
          ></el-input>
          <div @click="recognitionDemo">
            <img src="./aiImage/语音.png" alt="语音" class="mic-icon" />
          </div>
        </div>
        <div class="option-buttons">
          <div
            @click="setOption('search')"
            :class="{ active: selectedOption === 'search' }"
          >
            查询检索
          </div>
          <!--  @click="setOption('report')" -->
          <div :class="{ active: selectedOption === 'report' }">报告生成</div>
          <!--  @click="setOption('history')" -->
          <div :class="{ active: selectedOption === 'history' }">历史记录</div>
        </div>
        <!-- chatContainer -->
        <div class="text-div-big" ref="chatContainer">
          <div v-for="chat in chatHistory" :key="chat.id" class="text-div">
            <div class="think-div">
              <div class="ai-img">
                <img src="./aiImage/ai.png" alt="AI 头像" />
              </div>
              <div
                class="right-div"
                @click="toggleThinkContent(chat)"
                style="cursor: pointer"
              >
                <img style="margin-left: 5px" src="./aiImage/深度思考 (1).png" alt="" />
                <div v-if="!showElapsedTime">思考中...</div>
                <div v-else>已深度思考(用时{{ elapsedTime }}秒)</div>
                <img
                  :src="
                    chat.isThinkVisible
                      ? require('./aiImage/箭头下.png')
                      : require('./aiImage/箭头上.png')
                  "
                  style="margin-right: 5px"
                  alt=""
                />
              </div>
            </div>
            <transition name="fade-slide">
              <div
                class="deep-think"
                v-if="chat.isThinkVisible"
                ref="deepThink"
                v-html="chat.thinkContent"
              ></div>
              <!-- <vue-markdown class="deep-think">{{ chat.thinkContent }}</vue-markdown> -->
            </transition>
 
            <div class="text-center-div">
              <div
                class="center-div"
                ref="centerDiv"
                v-html="compiledMarkdown(chat.answerContent)"
              ></div>
 
              <!-- <vue-markdown class="center-div">{{ (chat.answerContent) }}</vue-markdown> -->
            </div>
 
            <!-- 使用 iframe 显示图表 -->
            <div class="chart-container" v-if="chat.chartUrls.length > 0">
              <iframe
                v-for="chartUrl in chat.chartUrls"
                :key="chartUrl"
                :src="chartUrl"
                class="chart-iframe"
              ></iframe>
            </div>
 
            <!-- docs -->
            <div
              v-if="chat.docs.length"
              class="text-center-div"
              style="margin-left: 22px"
            >
              <div><strong>相关文档：</strong></div>
              <ul class="center-div" style="margin-left: 0px">
                <li
                  style="margin-top: 10px"
                  v-for="(doc, index) in chat.docs"
                  :key="doc.document_id"
                >
                  <div>
                    <b>文档id：</b>
                    <span style="opacity: 0.6">{{ doc.vector_id }}</span>
                  </div>
                  <div>
                    <b>相似度：</b>
                    <span style="opacity: 0.6">{{ doc.distance }}</span>
                  </div>
                  <div>
                    <b>所属文件：</b>
                    <!-- :href="'http://192.168.208.46:8000/' + doc.entity.metadata.file_path" -->
                    <a
                      style="color: violet"
                      :href="chat_Url.fileUrl + doc.entity.metadata.file_path"
                      target="_blank"
                    >
                      {{ doc.entity.metadata.file_name }}
                    </a>
                  </div>
                  <div>
                    <b>文档内容：</b>
                    <span
                      style="opacity: 0.6"
                      v-if="doc.entity && doc.entity.text"
                      v-html="doc.entity.text.replace(/\n/g, '<br>')"
                    ></span>
                  </div>
                </li>
              </ul>
            </div>
            <div class="bottom-icon">
              <img
                @click="handleCopy(chat.thinkContent, chat.answerContent)"
                src="./aiImage/复制.png"
                alt=""
              />
              <img src="./aiImage/刷新.png" alt="" />
              <img src="./aiImage/点赞.png" alt="" />
              <img src="./aiImage/点灭.png" alt="" />
            </div>
          </div>
        </div>
        <div class="begin-new" @click="beginNew(event)">开启新对话</div>
        <div class="checkbox-buttons">
          <el-checkbox-group
            class="checkbox"
            v-model="checkboxGroup"
            @change="handleSingleSelect"
          >
            <div
              :class="
                checkboxGroup.includes('深度思考（R1）') ? 'check-one-sel' : 'check-one'
              "
              style="margin-left: 10px"
            >
              <el-checkbox label="深度思考（R1）">
                <template #default>
                  <img
                    :src="
                      checkboxGroup.includes('深度思考（R1）')
                        ? selectedImage1
                        : unselectedImage1
                    "
                    style="
                      width: 20px;
                      height: 20px;
                      margin-right: 5px;
                      vertical-align: middle;
                    "
                  />
                  <span>数据查询</span>
                </template>
              </el-checkbox>
            </div>
            <div
              style="margin-left: 10px"
              :class="
                checkboxGroup.includes('联网搜索') ? 'check-one-sel1' : 'check-one1'
              "
            >
              <el-checkbox label="联网搜索">
                <template #default>
                  <img
                    :src="
                      checkboxGroup.includes('联网搜索')
                        ? selectedImage2
                        : unselectedImage2
                    "
                    style="
                      width: 20px;
                      height: 20px;
                      margin-right: 5px;
                      vertical-align: middle;
                    "
                  />
                  <span>知识库查询</span>
                </template>
              </el-checkbox>
            </div>
          </el-checkbox-group>
          <!-- <img src="./aiImage/链接.png" alt="" /> -->
 
          <img v-if="query === '' && !isLoading" src="./aiImage/禁止查询.png" alt="" />
 
          <img
            v-else-if="query !== '' && !isLoading"
            src="./aiImage/查询.png"
            alt=""
            @click="sendQuery"
          />
          <img v-else src="./aiImage/播放中.png" alt="进行中" @click="stopQuery" />
        </div>
      </div>
    </vue-draggable-resizable>
  </div>
</template>
 
<script>
import { marked } from "marked";
// import { markedHighlight } from "marked-highlight";
// import hljs from 'highlight.js';
// import 'highlight.js/styles/github.css';
export default {
  data() {
    return {
      isResizing: false,
      resizeDirection: "",
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
 
      showChatBox: false,
      position1: { x: 200, y: 200 }, // 初始对话框位置
      isDragging1: false, // 是否正在拖拽
      position: { x: window.innerWidth - 330, y: window.innerHeight - 970 },
      isDragging: false,
      offsetX: 0,
      offsetY: 0,
      ballSize: 65, // 悬浮球尺寸
      chatWidth: 140, // 聊天框宽度
      chatHeight: 36, // 聊天框高度
 
      isShowAi: true,
      isSearch: false,
 
      query: "",
      selectedOption: "search",
      checkboxGroup: ["深度思考（R1）"],
      showDialog: false,
 
      unselectedImage1: require("./aiImage/深度思考.png"), // 未选中时的图片
      selectedImage1: require("./aiImage/深度思考 (1).png"), // 选中时的图片
      unselectedImage2: require("./aiImage/联网搜索.png"), // 未选中时的图片
      selectedImage2: require("./aiImage/联网搜索 (1).png"), // 选中时的图片
 
      thinkText: "", // 存储 AI “思考” 过程
      answerText: "", // 存储 AI 回答
 
      chatHistory: [], // 存储多个对话
      isLoading: false, // 是否正在查询
      controller: null, // AbortController 用于终止请求
      thinkContent: "", // 处理 "think" 事件的内容
      answerContent: "", // 处理 "answer" 事件的内容
 
      startTime: null, // 查询开始时间
      elapsedTime: 0, // 记录消耗的秒数
      timer: null, // 定时器
      showElapsedTime: false, // 是否显示最终耗时
 
      recognition: null, // 语音识别对象
 
      chatUrl: "http://192.168.208.46:9100/", //线上地址
      // chatUrl: "http://10.102.1.134:9100/", //本地地址
 
      fileUrl: "http://192.168.208.46:8000/", //线上地址
      // fileUrl: "http://10.102.1.134:8000/", //本地地址
 
      isNewSearch: true, //是否是新的查询
      conversationId: null,
 
      chat_Url: null,
 
      rawMarkdown: `| 日期 | 机动车事件数量 | 非机动车事件数量 | 行人事件数量 |
|------------|----------------|------------------|--------------|
| 2023-12-26 | **648** | **308** | **0** |
| 2023-12-27 | **587** | **264** | **0** |`,
 
      hasMoved: false, // 记录是否发生了拖动
      clickTimeout: null,
      dragStartTime: 0,
      startPos: { x: 0, y: 0 },
 
      dynamicHeight: 226, // 初始高度
    };
  },
  watch: {
    $route(to, from) {
      // this.showChatBox = false; // 当路由变化时，隐藏聊天框
      // this.showDialog = false; // 当路由变化时，隐藏对话框
      // this.query = ""; // 清空查询内容
      // this.isLoading = false; // 重置加载状态
      // this.isSearch = false; // 重置搜索状态
      // this.selectedOption = "search"; // 重置选中选项
      // this.checkboxGroup = ["深度思考（R1）"]; // 重置复选框
      // this.isShowAi = true; // 重置显示AI
    },
 
    chatHistory: {
      handler() {
        this.$nextTick(() => {
          this.updateHeight();
        });
      },
      deep: true,
    },
  },
 
  mounted() {
    this.chat_Url = chat_Url;
  },
  computed: {},
  methods: {
    // TODO 解析marked格式数据
    compiledMarkdown(data) {
      const renderer = new marked.Renderer();
 
      // 可选：自定义 table 渲染输出，增加 class 支持样式美化
      renderer.table = function (header, body) {
        return `
    <table class="markdown-table">
      <thead>${header}</thead>
      <tbody>${body}</tbody>
    </table>`;
      };
      // 配置 marked
      marked.setOptions({
        renderer,
        gfm: true, // GitHub 风格支持
        breaks: true, // 换行符转换为 <br>
        tables: true, // 支持表格语法
        smartLists: true, // 更智能的列表
        smartypants: false,
      });
      return marked.parse(data);
    },
    // 复制功能实现
    handleCopy(a, b) {
      const combinedText = `${a}\n\n${b}`;
      navigator.clipboard
        .writeText(combinedText)
        .then(() => {
          alert("内容已复制！");
        })
        .catch((err) => {
          console.error("复制失败", err);
        });
    },
    // 对话框拉伸
    startResize(event, direction) {
      this.isResizing = true;
      this.resizeDirection = direction;
      this.startX = event.clientX;
      this.startY = event.clientY;
      const dialogBox = this.$refs.dialogBox;
      this.startWidth = dialogBox.offsetWidth;
      this.startHeight = dialogBox.offsetHeight;
 
      document.addEventListener("mousemove", this.resize);
      document.addEventListener("mouseup", this.stopResize);
    },
    resize(event) {
      if (!this.isResizing) return;
      const dialogBox = this.$refs.dialogBox;
      const content = this.$refs.dialogContent; // 获取内容区域
      let newWidth = this.startWidth;
      let newHeight = this.startHeight;
 
      const dx = event.clientX - this.startX;
      const dy = event.clientY - this.startY;
 
      if (this.resizeDirection.includes("r")) newWidth += dx; // 右侧拉伸
      if (this.resizeDirection.includes("l")) newWidth -= dx; // 左侧拉伸
      if (this.resizeDirection.includes("b")) newHeight += dy; // 底部拉伸
      if (this.resizeDirection.includes("t")) newHeight -= dy; // 顶部拉伸
      // **确保 minHeight 只在组件加载时获取**
      if (!this.initialMinHeight) {
        this.initialMinHeight = content ? content.scrollHeight : 226; // 只获取一次
      }
 
      // **固定最小高度，允许向上拉伸**
      const minWidth = 342;
      const minHeight = Math.max(this.initialMinHeight, 226); // 不能小于内容初始高度
      const maxWidth = 800;
      const maxHeight = 900; // 允许拉高到 900
 
      // **允许拖拽增大高度**
      dialogBox.style.width = Math.max(minWidth, Math.min(maxWidth, newWidth)) + "px";
      dialogBox.style.height = Math.max(minHeight, Math.min(maxHeight, newHeight)) + "px";
    },
    stopResize() {
      this.isResizing = false;
      document.removeEventListener("mousemove", this.resize);
      document.removeEventListener("mouseup", this.stopResize);
    },
    // 实时更新位置
    onDragging(x, y) {
      this.position.x = x;
      this.position.y = y;
    },
    updateHeight() {
      this.$nextTick(() => {
        const content = this.$refs.dialogContent;
        if (content) {
          this.dynamicHeight = content.scrollHeight + 20; // 额外增加一些间距
        }
      });
    },
    // 多选改单选
    handleSingleSelect(val) {
      // 当选择了一个选项时，清空另一个选项
      if (val.length > 1) {
        this.checkboxGroup = [val[val.length - 1]]; // 只保留最后选择的选项
      }
      this.$nextTick(() => {
        this.$refs.inputRef.focus();
      });
      this.isNewSearch = true; // 标记为新的查询
      this.conversationId = null; // 清空 conversationId
      this.chatHistory = []; // 清空聊天历史
      console.log("选中的选项:", this.checkboxGroup);
    },
    // 深层思考是否折叠
    toggleThinkContent(chat) {
      chat.isThinkVisible = !chat.isThinkVisible;
    },
    // 中止请求
    stopQuery() {
      if (this.controller) {
        this.controller.abort(); // 终止请求
        console.log("⛔ 查询已终止");
        this.isLoading = false; // 恢复查询按钮
 
        this.$nextTick(() => {
          this.$refs.inputRef.focus();
        });
      }
    },

    // TODO 开启新对话
    beginNew(event) {
      this.chatHistory = []; // 清空聊天历史
      this.query = ""; // 清空查询内容
      this.isSearch = false;
      this.conversationId = null; // 清空 conversationId
      this.isNewSearch = true; // 标记为新的查询
      this.$nextTick(() => {
        this.$refs.inputRef.focus();
      });
    },
    // 随机生成id
    generateConversationId() {
      return "c" + Math.floor(Math.random() * 1000); // 生成 c+随机数
    },
    // 语音识别    （未完成）
    recognitionDemo() {
      // 检查浏览器是否支持 SpeechRecognition
      if (!("webkitSpeechRecognition" in window)) {
        alert("你的浏览器不支持语音识别功能");
        return;
      }
      console.log("开始语音识别");
 
      // 初始化 SpeechRecognition 对象
      this.recognition = new webkitSpeechRecognition();
      this.recognition.lang = "zh-CN"; // 设置识别语言为中文
      this.recognition.continuous = false; // 不连续模式，语音识别结束后停止
      this.recognition.interimResults = false; // 是否输出中间结果
 
      // 语音识别成功回调
      this.recognition.onresult = (event) => {
        const result = event.results[0][0].transcript; // 获取识别到的文本
        this.query = result; // 更新 query 以显示在页面
        console.log("识别到的文本:", result);
      };
 
      // 语音识别错误回调
      this.recognition.onerror = (event) => {
        console.error("语音识别发生错误", event);
      };
 
      // 语音识别结束回调
      this.recognition.onend = () => {
        console.log("语音识别结束");
      };
    },
    // TODO 开启对话
    startChat() {
      if (!this.query.trim()) {
        alert("请输入内容");
        return;
      }
      this.isLoading = true; // 切换到“进行中”状态
      this.controller = new AbortController(); // 创建一个新的控制器
 
      this.showElapsedTime = false; // 查询时隐藏时间
      this.startTime = Date.now(); // 记录开始时间
      this.elapsedTime = 0; // 重置时间
      this.startTimer(); // 开启计时
      // 是否是新的会话
      if (this.isNewSearch) {
        this.conversationId = this.generateConversationId()
      }

      // 创建会话对象
      const newConversation = {
        id:
          this.conversationId == null
            ? this.generateConversationId()
            : this.conversationId, // 生成新的会话 ID
        query: this.query,
        thinkContent: "",
        answerContent: "",
        chartUrls: [], // 存储图表的 URL
        docs: [], // 新增 docs 处理
        isThinkVisible: true, // 默认展开
      };
 
      this.isNewSearch = false; // 标记为已查询
      this.chatHistory.push(newConversation); // 追加新的对话块
      const currentIndex = this.chatHistory.length - 1;
      this.$nextTick(() => {
        this.scrollToBottom(); // 输入新问题后先滚动一次
      });

      // 根据选择的复选框决定使用哪个接口  本地环境
      let chatUrl = `${
        chat_Url.chatUrl
      }model/cloud_control/chat?query=${encodeURIComponent(
        this.query
      )}&limit=3&conversation_id=${newConversation.id}`;
      let knowChatUrl = `${
        chat_Url.chatUrl
      }model/cloud_control/knowchat?query=${encodeURIComponent(
        this.query
      )}&limit=3&conversation_id=${newConversation.id}`;
 
      fetch(this.checkboxGroup[0] == "深度思考（R1）" ? chatUrl : knowChatUrl, {
        method: "GET",
        headers: { Accept: "text/event-stream" },
        signal: this.controller.signal, // 绑定 signal
      })
        .then((response) => {
          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let partialData = ""; // 部分数据
          let currentEvent = "";
 
          const readStream = () => {
            reader.read().then(({ done, value }) => {
              if (done) {
                console.log("✅ 流式数据读取完成");
                this.isLoading = false; // 查询完成，恢复查询按钮
                this.showElapsedTime = true; // 显示最终耗时
                this.stopTimer(); // 停止计时
                this.$nextTick(() => {
                  this.$refs.inputRef.focus();
                });
                return;
              }
 
              const chunk = decoder.decode(value, { stream: true });
              partialData += chunk;
              const lines = partialData.split("\n");
              partialData = lines.pop(); // 可能是半截数据，留到下次处理
              lines.forEach((line) => {
                if (line.startsWith("event:")) {
                  currentEvent = line.replace("event: ", "").trim(); // 事件类型
                } else if (line.startsWith("data:")) {
                  try {
                    const data = JSON.parse(line.replace("data: ", ""));
                    if (currentEvent === "think") {
                      this.chatHistory[currentIndex].thinkContent += data.text;
                    } else if (currentEvent === "answer") {
                      this.chatHistory[currentIndex].answerContent += data.text;
                    } else if (currentEvent === "chart") {
                      // 处理 chart 数据
                      if (Array.isArray(data.text)) {
                        data.text.forEach((fileName) => {
                          const fullUrl = `${chat_Url.chatUrl}download/chart_path/${fileName}`;
                          // const fullUrl = `http://192.168.208.46:9100/download/chart_path/${fileName}`; //现场
                          this.chatHistory[currentIndex].chartUrls.push(fullUrl);
                        });
                      }
                    } else if (currentEvent === "docs") {
                      // 处理 docs 数据
                      if (Array.isArray(data)) {
                        this.chatHistory[currentIndex].docs.push(...data);
                      }
                    }
                    this.$nextTick(() => {
                      this.scrollToBottom(); // 每次更新内容后滚动到底部
                    });
                  } catch (err) {
                    console.error("❌ JSON 解析错误:", err, line);
                  }
                }
              });
 
              readStream();
            });
          };
 
          readStream();
        })
        .catch((error) => {
          this.isLoading = false; // 失败时恢复查询按钮
          this.stopTimer(); // 停止计时
          this.showElapsedTime = true; // 显示最终耗时
 
          this.$nextTick(() => {
            this.$refs.inputRef.focus();
          });
          console.error("❌ 请求错误:", error);
        });
 
      this.query = ""; // 清空输入框
    },
    // 计时
    startTimer() {
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
      }, 1000);
    },
    // 停止计时
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    // 滚动条   自动滚动到底部
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    // 打印 Markdown 到控制台
    updateMarkdownContent(data, eventType) {
      const markdownText = data.text; // 解析 Markdown
      console.log(`📢 ${eventType} 内容 (Markdown):`, markdownText); // 控制台打印
      if (eventType === "think") {
        this.thinkContent += markdownText; // 追加 "think" 内容
      } else if (eventType === "answer") {
        this.answerContent += markdownText; // 追加 "answer" 内容
      }
    },
    // 查询事件  回车
    sendQuery(event) {
      if (event.key === "Enter") {
        event.preventDefault(); // 阻止默认的换行行为
      }
      this.isSearch = true;
      setTimeout(() => {
        this.startChat();
      }, 100);
    },
    toggleChat() {
      this.showChatBox = !this.showChatBox;
      this.showDialog = false;
    },
    startDrag(event) {
      this.isDragging = true; // 立即进入拖动模式
      this.hasMoved = false; // 记录拖动状态
      this.offsetX = event.clientX - this.position.x;
      this.offsetY = event.clientY - this.position.y;
      this.startPos = { x: event.clientX, y: event.clientY }; // 记录按下时的鼠标位置
      document.addEventListener("mousemove", this.dragMove);
      document.addEventListener("mouseup", this.stopDrag);
      this.dragStartTime = Date.now(); // 记录按下时间
      // 启动一个延迟操作，超过 200ms 才会进入拖动模式
      this.clickTimeout = setTimeout(() => {
        this.isDragging = true;
      }, 200);
    },
    dragMove(event) {
      if (!this.isDragging) return;
      const deltaX = Math.abs(event.clientX - this.startPos.x);
      const deltaY = Math.abs(event.clientY - this.startPos.y);
 
      if (deltaX > 5 || deltaY > 5) {
        this.hasMoved = true; // 只要移动超过 5px 就认为是拖动
      }
 
      // this.position.x = event.clientX - this.offsetX;
      // this.position.y = event.clientY - this.offsetY;
    },
    stopDrag(event) {
      // this.isDragging = false;
      document.removeEventListener("mousemove", this.dragMove);
      document.removeEventListener("mouseup", this.stopDrag);
 
      // clearTimeout(this.clickTimeout);
 
      // // 计算鼠标释放时间
      // const duration = Date.now() - this.dragStartTime;
      // const deltaX = Math.abs(event.clientX - this.startPos.x);
      // const deltaY = Math.abs(event.clientY - this.startPos.y);
 
      this.isDragging = false;
 
      // 如果鼠标松开时，几乎没有移动，则判定为点击
      if (!this.hasMoved) {
        this.handleClick();
      }
    },
    handleClick() {
      this.showDialog = true;
      this.showChatBox = false;
      this.isShowAi = false;
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.inputRef.focus();
        });
      }, 500);
    },
    setOption(option) {
      this.selectedOption = option;
    },
  },
};
</script>
 
<style scoped lang="less">
::v-deep.vue-draggable-resizable-handle {
  display: none !important;
}
/* 定义展开/收起动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease-in-out;
}
 
/* 进入时：透明度从 0 到 1，高度从 0 变到正常 */
.fade-slide-enter {
  opacity: 0;
  transform: translateY(-10px);
}
 
/* 离开时：透明度从 1 变为 0，高度收缩 */
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.begin-new {
  width: 100px;
  height: 30px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1c5cff;
  border-radius: 50px;
  margin: auto;
  margin-bottom: 10px;
  cursor: pointer;
  z-index: 999;
}
 
.bottom-icon {
  margin-left: 22px;
  margin-bottom: 10px;
 
  img {
    width: 16px;
    height: 16px;
    margin-right: 10px;
    cursor: pointer;
  }
}
.text-div-big {
  max-height: calc(100vh - 350px);
  overflow-y: auto;
  overflow-x: hidden;
}
.text-div {
  .text-center-div {
    margin-top: 10px;
    border-top: 1px solid #434b5b;
    color: #fcfcfc;
 
    .center-div {
      width: 95%;
      margin-left: 22px;
      padding-top: 10px;
      padding-right: 10px;
      padding-bottom: 10px;
    }
  }
 
  .deep-think {
    width: 95%;
    padding-right: 10px;
    margin-left: 22px;
    padding-top: 10px;
    color: #d1d3d7;
    padding-left: 20px;
    padding-bottom: 10px;
    border-left: 1px solid #434b5b;
    word-wrap: break-word; /* 允许长单词或 URL 断行 */
    white-space: pre-wrap; /* 保留换行符并允许文本换行 */
    overflow-wrap: break-word; /* 处理超长单词的换行 */
  }
 
  .think-div {
    display: flex;
    margin-top: 6px;
 
    .right-div {
      display: flex;
      align-items: center;
      color: white;
      width: 200px;
      height: 30px;
      background-color: #3a4a61;
      border-radius: 5px;
 
      margin-left: 6px;
      justify-content: space-between;
 
      img {
        width: 20px;
        height: 20px;
        // margin-right: 5px;
        // margin-left: 6px;
      }
    }
  }
 
  .ai-img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #1c5cff;
    background-color: #031c41;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 6px;
 
    img {
      width: 20px;
      height: 20px;
    }
  }
}
 
.checkbox {
  display: flex;
 
  .check-one {
    width: 140px;
    height: 30px;
    background-color: #364257;
    border-radius: 50px;
    display: flex;
    align-items: center;
  }
 
  .check-one1 {
    width: 120px;
    height: 30px;
    background-color: #364257;
    border-radius: 50px;
    display: flex;
    align-items: center;
  }
 
  .check-one-sel1 {
    width: 120px;
    height: 30px;
    background-color: #1c3b69;
    border-radius: 50px;
    display: flex;
    color: white;
    align-items: center;
  }
 
  .check-one-sel {
    width: 140px;
    height: 30px;
    background-color: #1c3b69;
    border-radius: 50px;
    color: white;
    display: flex;
    align-items: center;
  }
 
  ::v-deep .el-checkbox__label {
    color: #a7aab2;
  }
 
  .is-checked {
    ::v-deep .el-checkbox__label {
      color: white;
    }
  }
}
 
::v-deep .el-textarea {
  width: 200px;
}
 
::v-deep .el-textarea__inner {
  background: #2f3749 !important;
  // background: chocolate !important;
  border: none !important;
  box-shadow: none; //去除自带边框
  padding: 0;
  resize: none; //去除右下角的拖动角标
  color: #d0cfd6;
  margin-left: 6px;
}
 
.ai-box-div {
  z-index: 9999;
  position: fixed;
  top: 100px;
}
 
.floating-ball {
  position: fixed;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  cursor: grab;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border: 1px solid #1c5cff;
  background-color: #031c41;
  display: flex;
  justify-content: center;
  align-items: center;
 
  img {
    width: 45px;
    height: 45px;
  }
}
 
.floating-ball:active {
  cursor: grabbing;
}
 
.chat-box {
  position: fixed;
  width: 140px;
  height: 36px;
  border-radius: 50px;
  border: 1px solid #1c5cff;
  background-color: #031c41;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  padding: 5px;
}
 
::v-deep .radio,
.checkbox {
  padding-left: 0px;
}
 
.dialog-box {
  position: fixed;
  width: 450px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  //   padding: 15px;
  // top: 90px;
  // left: 90%;
  border: 1px solid #1c5cff;
  background-color: #2f3749;
  // transform: translateX(-50%);
 
  // transition: left 0.2s ease-out, top 0.2s ease-out; /* 平滑拖拽 */
  // cursor: grab;
}
 
/* 缩放控制点样式 */
.resize-handle {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #409eff;
  border: 2px solid white;
  border-radius: 50%;
  z-index: 1001;
}
 
.tl {
  left: -6px;
  top: -6px;
  cursor: nwse-resize;
}
.tr {
  right: -6px;
  top: -6px;
  cursor: nesw-resize;
}
.bl {
  left: -6px;
  bottom: -6px;
  cursor: nesw-resize;
}
.br {
  right: -6px;
  bottom: -6px;
  cursor: nwse-resize;
}
 
.resize-handle:hover {
  background: #67c23a;
  transform: scale(1.2);
}
 
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #d0cfd6;
  padding: 6px 6px 4px 6px;
  width: 100%;
  // background-color: #fff;
  border-bottom: 1px solid #1c5cff;
 
  .little-img {
    width: 30px;
    height: 30px;
    cursor: pointer;
    border-radius: 50%;
    border: 1px solid #1c5cff;
    background-color: #031c41;
    display: flex;
    justify-content: center;
    align-items: center;
 
    img {
      width: 20px;
      height: 20px;
    }
  }
}
 
.dialog-header .ai-avatar {
  width: 40px;
  height: 40px;
}
 
.dialog-header .mic-icon {
  width: 20px;
  height: 20px;
}
 
textarea {
  width: 100%;
  height: 60px;
  margin-top: 10px;
  resize: none;
}
 
.option-buttons div {
  cursor: pointer;
  color: #acafb6;
  display: flex;
  flex-direction: column;
  background: transparent;
  border: none;
  height: 30px;
  line-height: 30px;
  padding-left: 6px;
}
 
.option-buttons .active {
  background-color: #42495a;
  color: white;
}
 
.checkbox-buttons {
  border-top: 1px solid #444b5c;
 
  img {
    width: 20px;
    height: 20px;
    margin-left: 6px;
    cursor: pointer;
  }
 
  display: flex;
  align-items: center;
 
  ::v-deep .el-checkbox__input {
    display: none;
  }
}
 
.chart-iframe {
  width: 94%;
  height: 300px; /* 设置合适的高度 */
  border: none;
  border-radius: 10px;
  margin-left: 22px;
}
</style>
<style>
/* marked数据 表格格式样式 */
.markdown-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}
 
.markdown-table th,
.markdown-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
 
/* 隐藏拖拽时默认白色虚线  拖拽完成默认黑色虚线 */
.vdr.active:before {
  display: none;
}
.custom-draggable.active:focus {
  outline: none;
}
 
/* 四个角的拉伸点 */
.resizer {
  width: 10px;
  height: 10px;
  background-color: blueviolet;
  border-radius: 50%;
  position: absolute;
  cursor: pointer;
}
/* 各个方向的拉伸点 */
.bottom-right {
  right: 0;
  bottom: 0;
  cursor: se-resize;
}
.bottom-left {
  left: 0;
  bottom: 0;
  cursor: sw-resize;
}
.top-right {
  right: 0;
  top: 0;
  cursor: ne-resize;
}
.top-left {
  left: 0;
  top: 0;
  cursor: nw-resize;
}
 
.el-textarea__inner::placeholder {
  color: gray !important; /* 修改占位符颜色 */
  opacity: 1; /* 确保颜色生效 */
}
</style>