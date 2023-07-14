import {defineConfig, UserConfigExport} from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import topLevelAwait from 'vite-plugin-top-level-await';
import type { Exposes, Shared, Remotes } from '@originjs/vite-plugin-federation'
import packageJson from './package.json';

type NodeEnv = 'development' | 'test' | 'production';
export type ViteConfig = Readonly<{
    port: number;
    federation?: Readonly<{
        exposes?: Exposes;
        shared?: Shared;
        remotes?: Remotes;
    }>;
}>;

export const configureVite = (config: ViteConfig): UserConfigExport => {
    const nodeEnv: NodeEnv = process.env.NODE_ENV as NodeEnv;
    return defineConfig({
        root: path.join(process.cwd(), 'src'),
        server: {
            port: config.port
        },
        plugins: [
            react(),
            topLevelAwait()
        ],
        build: {
            outDir: path.join(process.cwd(), 'build'),
            emptyOutDir: true,
            minify: nodeEnv === 'production' ? 'terser' : false,
            cssMinify: nodeEnv === 'production' ? undefined : false
        }
    })
};