import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import federation from '@originjs/vite-plugin-federation';
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
    root: path.join(process.cwd(), 'src'),
    server: {
        port: 3000
    },
    plugins: [
        react(),
        legacy({
            targets: '>0.25%, ie >= 11'
        }),
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