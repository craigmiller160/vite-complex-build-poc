import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
    root: path.join(process.cwd(), 'src'),
    server: {
        port: 3000
    },
    plugins: [
        react()
    ],
    build: {
        outDir: path.join(process.cwd(), 'build'),
        emptyOutDir: true
    }
})