# SCRATCH URLS 暫存網址

![Imgur](https://i.imgur.com/gxpu6mP.png)
[套件下載](https://)

## 專案架構

```
├── dist // 打包檔案
├── options.html // 選項頁
├── popup.html // 主頁-套件彈跳視窗
├── public
│   ├── images // 靜態圖片
│   ├── manifest.json // 套件設定檔
│   └── vite.svg
├── src
│   ├── assets
│   │   ├── styles // 樣式
│   │   └── vue.svg
│   ├── background.ts // 套件功能撰寫檔
│   ├── components // 共用元件
│   ├── composable // 有狀態邏輯方法
│   ├── options // 選項頁進入點與檔案
│   ├── popup // 主頁進入點與檔案
│   ├── types // 型別
│   └── utils // 無狀態邏輯方法
```

## 專案安裝與執行

```bash
# Setup 安裝
pnpm install

# Development 執行
pnpm dev

# Production 生產
pnpm build
pnpm preview
```
