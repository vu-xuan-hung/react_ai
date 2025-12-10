import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'

export default defineConfig({
  plugins: [
    react(),
    obfuscatorPlugin({
      include: [/\.js$/, /\.jsx$/, /\.ts$/, /\.tsx$/],
      exclude: [/node_modules/],
      apply: 'build', // chỉ áp dụng khi build
      options: {
        compact: true,
        controlFlowFlattening: true,
        deadCodeInjection: true,
        stringArray: true,
        stringArrayEncoding: ['rc4'],
        stringArrayThreshold: 0.75,
      },
    }),
  ],
  build: {
    sourcemap: false,
    minify: false,
  },
  server: {
    host: true,
    port: 5173,
    open: true,
    historyApiFallback: true,
  },
})
