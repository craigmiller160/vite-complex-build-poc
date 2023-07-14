import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import federation from '@originjs/vite-plugin-federation';
import packageJson from './package.json';
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
    root: path.join(process.cwd(), 'src'),
    server: {
        port: 3001
    },
    plugins: [
        react(),
        legacy({
            targets: '>0.25%, ie >= 11'
        }),
        federation({
            name: 'mfe1',
            filename: 'remoteEntry.js',
            exposes: {
                './App': './src/App.tsx'
            },
            shared: {
                ...packageJson.dependencies
            }
        })
    ],
    build: {
        outDir: path.join(process.cwd(), 'build'),
        emptyOutDir: true
    }
})