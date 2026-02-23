# TempSongListFrontend DDD 架构文档

## 架构概述

本项目采用 **DDD（领域驱动设计）三层架构**，将业务逻辑、技术实现和 UI 展示分离，提高代码的可维护性和可测试性。

## 架构分层

```
src/
├── domain/              # 领域层 - 业务模型和接口定义
│   ├── types.ts         # 领域模型类型定义
│   └── api/             # 服务接口定义
│       └── ISongListService.ts
├── infrastructure/      # 基础设施层 - 技术实现
│   ├── api/             # API 服务实现
│   │   └── RealSongListService.ts
│   └── config/          # 配置管理
│       ├── config.ts    # 应用配置
│       └── constants.ts # 常量定义
├── presentation/        # 表现层 - UI 组件
│   └── components/      # Vue 组件
│       ├── HeadIcon.vue
│       ├── SongTable.vue
│       ├── FilterBar.vue
│       ├── RandomSongModal.vue
│       ├── LoadingState.vue
│       └── ErrorState.vue
├── shared/              # 共享层 - 工具函数
│   └── utils/
│       ├── device.ts    # 设备检测
│       ├── image.ts     # 图片处理
│       └── url.ts       # URL 处理
└── App.vue              # 根组件（组合各层）
```

## 各层职责

### 1. 领域层 (Domain Layer)

**职责**: 定义业务模型和抽象接口，不依赖任何技术实现。

**文件**:
- `types.ts`: 定义 Song、ArtistInfo、SiteSetting 等模型
- `api/ISongListService.ts`: 定义服务接口契约

**设计原则**:
- 纯 TypeScript 类型定义
- 不依赖任何框架或库
- 可独立于 UI 和技术栈进行单元测试

### 2. 基础设施层 (Infrastructure Layer)

**职责**: 实现领域层定义的接口，处理与外部系统的交互。

**文件**:
- `api/RealSongListService.ts`: HTTP API 实现
- `config/config.ts`: 应用配置（API 路径、默认值等）
- `config/constants.ts`: 业务常量

**设计原则**:
- 实现领域层接口
- 封装技术细节（HTTP、存储等）
- 可替换的实现（如 Mock、真实 API）

### 3. 表现层 (Presentation Layer)

**职责**: UI 展示和用户交互，组合领域模型和基础设施服务。

**文件**:
- `components/HeadIcon.vue`: 头像组件
- `components/SongTable.vue`: 歌曲表格
- `components/FilterBar.vue`: 筛选栏
- `components/RandomSongModal.vue`: 盲盒弹窗
- `components/LoadingState.vue`: 加载状态
- `components/ErrorState.vue`: 错误状态

**设计原则**:
- 只负责展示逻辑
- 通过 props 和 events 与父组件通信
- 不直接调用 API，由父组件通过服务层获取数据

### 4. 共享层 (Shared Layer)

**职责**: 通用的工具函数，被各层共享使用。

**文件**:
- `utils/device.ts`: 设备类型检测
- `utils/image.ts`: 图片加载和验证
- `utils/url.ts`: URL 参数处理

## 依赖关系

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│         (Vue Components)                │
└─────────────────┬───────────────────────┘
                  │ uses
                  ▼
┌─────────────────────────────────────────┐
│        Infrastructure Layer             │
│    (API Implementation, Config)         │
└─────────────────┬───────────────────────┘
                  │ implements
                  ▼
┌─────────────────────────────────────────┐
│           Domain Layer                  │
│      (Types, Interfaces)                │
└─────────────────────────────────────────┘
                  ▲
                  │ uses
┌─────────────────┴───────────────────────┐
│           Shared Layer                  │
│        (Utility Functions)              │
└─────────────────────────────────────────┘
```

**依赖原则**: 
- 上层依赖下层
- 领域层不依赖其他层
- 依赖倒置：表现层依赖领域接口，而非具体实现

## 代码示例

### 获取歌曲列表（DDD 流程）

```typescript
// 1. 领域层定义接口
domain/api/ISongListService.ts
export interface ISongListService {
  getSongs(artist: string, filters?: FilterState): Promise<Song[]>
}

// 2. 基础设施层实现
cinfrastructure/api/RealSongListService.ts
export class RealSongListService implements ISongListService {
  async getSongs(artist: string, filters?: FilterState): Promise<Song[]> {
    const response = await fetch(`/api/songlist/songs/?artist=${artist}`)
    return response.json()
  }
}

// 3. 表现层使用
App.vue
import { songListService } from './infrastructure/api/RealSongListService'

const loadSongs = async () => {
  const songs = await songListService.getSongs(currentArtist.value)
  songs.value = songs
}
```

## 优势

1. **关注点分离**: 业务逻辑、技术实现、UI 展示各司其职
2. **可测试性**: 各层可独立进行单元测试
3. **可维护性**: 修改技术实现不影响业务逻辑
4. **可扩展性**: 易于添加新功能或替换实现
5. **团队协作**: 不同开发者可同时开发不同层

## 重构对比

### 重构前（922 行的 App.vue）
- 所有逻辑集中在一个文件
- 业务逻辑和 UI 混合
- API 调用分散在各处
- 难以测试和维护

### 重构后（DDD 架构）
- 职责清晰的目录结构
- 领域模型独立定义
- 服务层封装 API 调用
- 组件只负责展示
- 易于测试和扩展
