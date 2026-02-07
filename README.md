# 📡 IPTV Streaming Web App

A production-ready, mobile-friendly IPTV streaming application built with Next.js 16, TypeScript, and HLS.js.

## ✨ Features

- 📺 **Live HLS Streaming** - Stream .m3u8 channels with auto-quality adaptation
- 📱 **Mobile-First Design** - Fully responsive, touch-friendly interface
- 🎯 **Direct Channel Links** - Share specific channels with `/watch/[id]` routes
- 🌙 **Dark Theme** - Modern, eye-friendly dark UI
- ⚡ **Fast Loading** - Optimized streaming with minimal buffering
- 🔄 **Auto-Fallback** - Native HLS for Safari/iOS, hls.js for other browsers
- 💾 **Client-Side Only** - No server-side processing required

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Streaming:** hls.js (with native Safari fallback)
- **Video Format:** HLS (.m3u8)

## 📂 Project Structure

```
strean/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with header/footer
│   │   ├── page.tsx            # Home page (player + channels)
│   │   ├── globals.css         # Global styles
│   │   └── watch/
│   │       └── [id]/
│   │           └── page.tsx    # Dynamic channel page
│   ├── components/
│   │   ├── VideoPlayer.tsx     # HLS video player component
│   │   └── ChannelList.tsx     # Channel grid component
│   └── data/
│       └── channels.ts         # Channel configuration
├── public/                     # Static assets
├── package.json
└── README.md
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 📺 Adding Channels

Edit [src/data/channels.ts](src/data/channels.ts) to add or modify channels:

```typescript
export const CHANNELS: Channel[] = [
  {
    id: 'my-channel',          // Unique ID for routing
    name: 'My Channel',        // Display name
    streamUrl: 'http://...',   // HLS stream URL (.m3u8)
    logo: '📺',                // Optional emoji or icon
  },
  // Add more channels...
];
```

## 🎨 Customization

### Theme Colors
Modify Tailwind colors in [src/app/globals.css](src/app/globals.css):
```css
:root {
  --background: #020617;  /* Dark background */
  --foreground: #f1f5f9;  /* Light text */
}
```

### App Name & Branding
Update [src/app/layout.tsx](src/app/layout.tsx):
```tsx
<h1>📡 Your App Name</h1>
```

### Metadata (SEO)
Edit metadata in [src/app/layout.tsx](src/app/layout.tsx):
```tsx
export const metadata: Metadata = {
  title: "Your Title",
  description: "Your description",
};
```

## 🌐 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Deploy automatically

### Deploy to Other Platforms
- **Netlify:** Use `npm run build` and deploy the `.next` folder
- **Docker:** Create a Dockerfile with Next.js standalone output
- **AWS/GCP:** Use containerization or serverless functions

## 📱 Mobile Considerations

- ✅ Touch-friendly buttons (44px min height)
- ✅ Responsive video player (16:9 aspect ratio)
- ✅ Native HLS on iOS Safari
- ✅ Sticky header for easy navigation
- ✅ Optimized for portrait & landscape

## 🔧 Troubleshooting

### Stream Not Playing
- ✅ Check stream URL is accessible
- ✅ Verify CORS is enabled on stream server
- ✅ Test stream URL in VLC or another player
- ✅ Check browser console for errors

### CORS Issues
If streams are blocked by CORS, configure your stream server to allow your domain:
```
Access-Control-Allow-Origin: *
```

### Safari/iOS Issues
Safari supports HLS natively. If issues persist:
- Ensure stream is HTTPS (required for iOS)
- Check stream codec compatibility (H.264 + AAC recommended)

## 📝 API Routes (Optional Future Enhancement)

Currently, this app uses client-side streaming only. To add server-side features:
- Create `/api` routes in `src/app/api/`
- Add channel management endpoints
- Implement authentication
- Add analytics tracking

## 🎯 Key Features Breakdown

### VideoPlayer Component
- Auto-detects Safari for native HLS
- Uses hls.js for other browsers
- Loading & error states
- Responsive 16:9 container
- Auto-play support (respects browser policies)

### ChannelList Component
- Grid layout (responsive)
- Active channel highlighting
- Touch-friendly buttons
- Link-based navigation

### Dynamic Routing
- `/` - Home page with default channel
- `/watch/[id]` - Watch specific channel
- Shareable direct links

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a Pull Request

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [hls.js](https://github.com/video-dev/hls.js/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

**Made with ❤️ for IPTV streaming enthusiasts**
