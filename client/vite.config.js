import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // server: {
    /** This one will only work along dist folder */
  //   proxy: {
  //     "/": {
  //       target: "http://localhost:8888",
  //       changeOrigin: true,
  //       onProxyRes(proxyRes, req, res) {
  //         proxyRes.headers["Content-Security-Policy"] = "script-src 'self'";
  //       },
  //     },
  //   },
  // },
});
