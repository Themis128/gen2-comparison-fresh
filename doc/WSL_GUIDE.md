# WSL Development Guide for Fresh Gen2 Amplify Todo App

This project is optimized for development in **WSL2 (Windows Subsystem for Linux)**. Using WSL2 provides a native Linux environment which is significantly faster for Node.js and Amplify development compared to native Windows.

## 🚀 Getting Started in WSL

### 1. Ensure Project is in the Linux File System
For maximum performance, ensure your project is located in the Linux file system (e.g., `~/projects/gen2-comparison-fresh`) and **NOT** in the Windows file system (`/mnt/c/...`).
- **Current Path:** `/home/tbaltzakis/gen2-comparison-fresh` (Correct ✅)

### 2. VS Code Integration
Use the **WSL extension** in VS Code to connect directly to your WSL instance. This allows you to use the VS Code UI while running everything in Linux.

**Important for AI Extensions (like Cline):**
- Open the project by running `code .` from within the `/home/tbaltzakis/gen2-comparison-fresh` directory in your WSL terminal.
- This ensures the extension recognizes the correct project root and has access to the Linux environment.
- A `.clinerules` file has been added to the root to provide project-specific context to the AI.

### 3. Node.js & pnpm
Ensure you have Node.js 18+ and pnpm installed in WSL:
```bash
# Install pnpm if not present
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 4. AWS CLI Configuration
Configure your AWS credentials within WSL:
```bash
aws configure
```

## 🛠️ WSL Optimizations

### Increase File Watcher Limits (inotify)
Next.js and Amplify use many file watchers. If you see "ENOSPC: System limit for number of file watchers reached", run:
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

### Accessing the App
The app runs on port `3001` by default (as per `package.json`).
- Start the app: `pnpm dev`
- Access it from your Windows browser at: [http://localhost:3001](http://localhost:3001)

### Amplify Sandbox
Run the Amplify sandbox in a separate WSL terminal:
```bash
npx ampx sandbox
```

## 🔍 Troubleshooting WSL Issues

### Localhost Connection Issues
If `localhost:3001` doesn't work from Windows:
1. Ensure the dev server is running in WSL.
2. Try using the WSL IP address. Get it with: `hostname -I | awk '{print $1}'`.
3. Check if Windows Firewall is blocking the connection.

### HMR (Hot Module Replacement) Not Working
If changes aren't reflecting:
- Ensure you are NOT on `/mnt/c/`.
- If you must use `/mnt/c/`, you may need to enable polling in `next.config.mjs`:
  ```javascript
  // Only if on /mnt/c/
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  ```

### Memory Usage
WSL2 can consume a lot of RAM. You can limit it by creating a `.wslconfig` file in your Windows User folder (`%USERPROFILE%`):
```ini
[wsl2]
memory=8GB
processors=4
```
