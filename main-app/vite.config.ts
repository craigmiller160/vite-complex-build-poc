import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import federation from '@originjs/vite-plugin-federation';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
    root: path.join(process.cwd(), 'src'),
    server: {
        port: 3000
    },
    plugins: [
        react(),
        topLevelAwait(),
        federation({
            name: 'main-app',
            remotes: {
                mfe1: 'http://localhost:3001/assets/remoteEntry.js'
            }
        })
    ],
    build: {
        outDir: path.join(process.cwd(), 'build'),
        emptyOutDir: true
    }
})