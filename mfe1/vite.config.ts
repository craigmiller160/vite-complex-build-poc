import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import federation from '@originjs/vite-plugin-federation';
import packageJson from './package.json';
import topLevelAwait from 'vite-plugin-top-level-await';

type NodeEnv = 'development' | 'test' | 'production';
const nodeEnv: NodeEnv = process.env.NODE_ENV as NodeEnv;

export default defineConfig({
    root: path.join(process.cwd(), 'src'),
    server: {
        port: 3001
    },
    plugins: [
        react(),
        topLevelAwait(),
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
        emptyOutDir: true,
        minify: nodeEnv === 'production' ? 'terser' : false,
        cssMinify: nodeEnv === 'production' ? undefined : false
    }
})