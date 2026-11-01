<p align="center"><img src="素材/机械拆解封面v1.0.png" width="100%" alt="Mechanical exploded-view concept artwork"></p>

<h1 align="center">三维拆解 · Teardown for Codex</h1>
<p align="center"><strong>让原理动起来，让结构看得见。</strong><br>面向 Codex 的交互式 3D 拆解技能：从真实参考到可探索的离线原理页面。</p>
<p align="center"><a href="README.md">简体中文</a> · <a href="文档/英文说明v1.0.md">English</a></p>
<p align="center"><a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT"></a></p>
<p align="center"><code>Codex</code> · <code>Interactive 3D</code> · <code>Offline HTML</code> · <code>Three.js</code></p>
<p align="center"><a href="#use-cases">使用场景</a> ｜ <a href="#showcase">成果展示</a> ｜ <a href="#quick-start">快速开始</a> ｜ <a href="#capabilities">能力状态</a> ｜ <a href="#contribute">参与共创</a></p>
<p align="center"><sub>封面为 AI 生成的机械拆解概念图，不代表实际程序画面或工程图纸。</sub></p>

---

<a id="use-cases"></a>
## 使用场景

| 想做什么 | 从哪里开始 |
| --- | --- |
| 展示活塞、气门与燃烧循环 | V8 发动机示例 |
| 讲清收放机构的联动 | Cessna 起落架示例 |
| 观察连杆如何产生步态 | Strandbeest 行走机构示例 |

新对象仍需建模与核验；这是指导 Codex 执行的技能，不是自动重建 CAD 的软件。

<a id="showcase"></a>
## 成果展示

![V8 runtime screenshot](素材/发动机实机截图v1.0.png)

上游 V8 示例的真实截图：本地构建，断网后以软件 WebGL 渲染。原始示例为英文界面。[下载 HTML](示例/发动机示例v1.0.html)，使用 GitHub 下载按钮保存后，在支持 WebGL 的浏览器打开；GitHub 文件预览不会执行页面。

<a id="quick-start"></a>
## 快速开始

需要 Node.js 20+、npm 和 Git。若目标目录已存在，请更新原副本，不要覆盖安装。

```sh
git clone https://github.com/TUANZIDING/teardown-codex.git "${CODEX_HOME:-$HOME/.codex}/skills/teardown-codex"
cd "${CODEX_HOME:-$HOME/.codex}/skills/teardown-codex/upstream"
npm ci
npx playwright install chromium
```

新开 Codex 聊天后调用：

> 使用 $teardown-codex，制作中文齿轮传动 3D 教学页面，支持旋转、拆解、调速和部件说明，输出离线 HTML。

在 upstream 目录构建随附示例：

```sh
node sims/build.mjs v8-live
```

`teardown-out/dist/v8-live.html`

## 工作流

真实参考 → 参数与单位 → 统一状态模型 → 几何与交互 → 离线构建 → 视觉检查

<a id="capabilities"></a>
## 能力状态

| 状态 | 范围 |
| --- | --- |
| 已验证 | 技能格式、锁文件依赖安装、V8 构建、离线加载和截图 |
| 已随附 | 上游模型、视频捕获工具和程序化音频引擎 |
| 尚未完整测试 | 全部交互、移动布局、硬件 GPU 性能及完整影音导出 |
| 已写入工作流 | 中文输出、版本命名、来源记录与教学示意声明 |

<details>
<summary>技术配置与视频导出</summary>

`TEARDOWN_OUT` 设置输出目录，`CHROMIUM` 指定浏览器。视频另需 ffmpeg，程序化音频需要 Python 3。详见 [upstream guide](upstream/SKILL.md).

</details>

<a id="contribute"></a>
## 参与共创

欢迎贡献新机构、有依据的参数、中文界面及交互测试。

[Skill](SKILL.md) · [Provenance](来源记录v1.0.md) · [Issues](https://github.com/TUANZIDING/teardown-codex/issues)

---

基于 [elvarofficial/teardown](https://github.com/elvarofficial/teardown) 适配，底层来源包括 [whaleyxbt/claude-motion](https://github.com/whaleyxbt/claude-motion)。保留 MIT 上游代码与音效归属，详见 [sound sources](upstream/sfx/samples/SOURCES.md).

<p align="center"><a href="https://github.com/TUANZIDING">TUANZIDING</a> · <a href="LICENSE">MIT</a> · v1.0</p>
