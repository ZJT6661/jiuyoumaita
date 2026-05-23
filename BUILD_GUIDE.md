
# 就要买它 - 攒钱目标应用

## 项目介绍
「就要买它」是一款功能完整的攒钱目标管理应用，帮助用户设定并实现自己的储蓄目标。

## 核心功能
✅ 创建和管理多个攒钱目标
✅ 存入资金并记录流水
✅ 进度可视化展示
✅ 目标自动完成检测和祝贺
✅ 日历签到功能
✅ 月度图表分析
✅ 5种主题皮肤切换
✅ 本地数据持久化存储

## 技术栈
- React 18 + TypeScript
- Vite 构建工具
- Tailwind CSS
- Zustand 状态管理
- Chart.js 图表库
- Lucide React 图标库
- Capacitor (用于安卓打包)

## 开发和运行

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
访问 http://localhost:5173/ 即可查看应用

### 构建生产版本
```bash
npm run build
```
构建产物会输出到 `dist` 目录

## 安卓打包指南

### 前置要求
- JDK 11 或更高版本
- Android Studio
- Android SDK (API 22 或更高)

### 构建和运行安卓应用

#### 1. 同步 Capacitor
每次修改代码并构建后，需要同步到安卓项目：
```bash
npm run build
npx cap sync android
```

#### 2. 打开 Android Studio
```bash
npx cap open android
```

#### 3. 在 Android Studio 中构建 APK
- 在 Android Studio 中打开项目
- 等待 Gradle 同步完成
- 点击 Build -> Build Bundle(s) / APK(s) -> Build APK(s)
- 构建完成后会提示 APK 位置

或者使用命令行构建：
```bash
cd android
./gradlew assembleDebug
```
APK 文件位置：`android/app/build/outputs/apk/debug/app-debug.apk`

### 构建发布版本 APK
```bash
cd android
./gradlew assembleRelease
```
发布版本 APK 位置：`android/app/build/outputs/apk/release/app-release.apk`

## 项目结构
```
/workspace
├── src/
│   ├── components/      # 组件目录
│   │   ├── GoalCard.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── DepositModal.tsx
│   │   ├── CreateGoalModal.tsx
│   │   ├── CompletionModal.tsx
│   │   ├── CalendarView.tsx
│   │   ├── MonthlyChart.tsx
│   │   └── ThemeSwitcher.tsx
│   ├── pages/          # 页面目录
│   │   ├── Home.tsx
│   │   ├── GoalDetail.tsx
│   │   └── Settings.tsx
│   ├── hooks/          # 自定义 Hooks
│   │   └── useStore.ts
│   ├── types/          # 类型定义
│   │   └── index.ts
│   ├── utils/          # 工具函数
│   │   └── formatters.ts
│   ├── App.tsx
│   └── main.tsx
├── android/           # Capacitor 安卓项目
├── dist/             # 构建产物
└── ...
```

## 主题系统
应用支持 5 种主题：
- 🟠 活力橙 (默认)
- 🌿 薄荷绿
- 🔵 天空蓝
- 🟣 浪漫紫
- 🖤 深邃黑

在设置页面可以切换主题。

## 数据存储
所有数据存储在浏览器的 LocalStorage 中，使用 zustand-persist 中间件实现，关闭应用后数据不会丢失。
