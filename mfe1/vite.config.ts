import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
    root: path.join(process.cwd(), 'src'),
    server: {
        port: 3001
    },
    plugins: [
        react(),
        federation({
            name: 'mfe1',
            filename: 'remoteEntry.js',
            exposes: {
                './App': './src/App.tsx'
            }
        })
    ],
    build: {
        outDir: path.join(process.cwd(), 'build'),
        emptyOutDir: true
    }
})