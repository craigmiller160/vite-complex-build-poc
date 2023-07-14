import { defineConfig } from 'vite';
import path from 'path';
import packageJson from './package.json';
import dts from 'vite-plugin-dts';

const dependencies = Object.entries(packageJson.dependencies)
    .map(([key]) => key);

export default defineConfig({
    plugins: [
        dts({
            entryRoot: path.join(process.cwd(), 'src')
        })
    ],
    build: {
        outDir: path.join(process.cwd(), 'build'),
        emptyOutDir: true,
        lib: {
            entry: path.join(process.cwd(), 'src'),
            name: 'config',
            fileName: 'config'
        },
        rollupOptions: {
            external: dependencies
        }
    }
});