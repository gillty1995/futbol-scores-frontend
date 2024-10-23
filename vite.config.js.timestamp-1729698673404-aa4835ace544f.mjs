// vite.config.js
import { defineConfig } from "file:///Users/gooee/Desktop/vscode_files/futbol-scores-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///Users/gooee/Desktop/vscode_files/futbol-scores-frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    )
  },
  server: {
    port: 3e3
    // Uncomment and configure the proxy if needed
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:3001",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZ29vZWUvRGVza3RvcC92c2NvZGVfZmlsZXMvZnV0Ym9sLXNjb3Jlcy1mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2dvb2VlL0Rlc2t0b3AvdnNjb2RlX2ZpbGVzL2Z1dGJvbC1zY29yZXMtZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2dvb2VlL0Rlc2t0b3AvdnNjb2RlX2ZpbGVzL2Z1dGJvbC1zY29yZXMtZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICBkZWZpbmU6IHtcbiAgICBcInByb2Nlc3MuZW52Lk5PREVfRU5WXCI6IEpTT04uc3RyaW5naWZ5KFxuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgfHwgXCJkZXZlbG9wbWVudFwiXG4gICAgKSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogMzAwMCxcbiAgICAvLyBVbmNvbW1lbnQgYW5kIGNvbmZpZ3VyZSB0aGUgcHJveHkgaWYgbmVlZGVkXG4gICAgLy8gcHJveHk6IHtcbiAgICAvLyAgIFwiL2FwaVwiOiB7XG4gICAgLy8gICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjMwMDFcIixcbiAgICAvLyAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgIC8vICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgXCJcIiksXG4gICAgLy8gICB9LFxuICAgIC8vIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFYsU0FBUyxvQkFBb0I7QUFDdlgsT0FBTyxXQUFXO0FBR2xCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixRQUFRO0FBQUEsSUFDTix3QkFBd0IsS0FBSztBQUFBLE1BQzNCLFFBQVEsSUFBSSxZQUFZO0FBQUEsSUFDMUI7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBU1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
