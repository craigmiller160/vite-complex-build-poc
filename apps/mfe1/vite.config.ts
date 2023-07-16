import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react-swc';
import topLevelAwait from 'vite-plugin-top-level-await';
import federation from '@originjs/vite-plugin-federation';

type PackageJson = Readonly<{
	name: string;
	dependencies: Record<string, string>;
}>;
type NodeEnv = 'development' | 'test' | 'production';

const srcDir = path.join(process.cwd(), 'src');
const buildDir = path.join(process.cwd(), 'build');
const packageJsonFile = path.join(process.cwd(), 'package.json');

const nodeEnv: NodeEnv = process.env.NODE_ENV as NodeEnv;

const packageJson: PackageJson = JSON.parse(
	fs.readFileSync(packageJsonFile, 'utf8')
);

export default defineConfig({
	root: srcDir,
	server: {
		port: 3001
	},
	plugins: [
		react(),
		topLevelAwait(),
		federation({
			name: packageJson.name,
			exposes: {
				'./App': './src/App.tsx'
			},
			shared: ['react']
		})
	],
	build: {
		outDir: buildDir,
		emptyOutDir: true,
		minify: nodeEnv === 'production' ? 'terser' : false,
		cssMinify: nodeEnv === 'production' ? undefined : false,
		cssCodeSplit: nodeEnv === 'production',
		rollupOptions: {
			treeshake: nodeEnv === 'production' ? 'recommended' : false
		}
	}
});
