import dts from 'vite-plugin-dts';
import { defineConfig, UserConfigExport } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { getPackageJson } from './PackageJson';

const rootDir = path.join(process.cwd(), 'src');
const buildDir = path.join(process.cwd(), 'build');

export type ViteLibraryConfig = Readonly<{
	name: string;
}>;

export const configureVite = (config: ViteLibraryConfig): UserConfigExport => {
	const packageJson = getPackageJson();
	return defineConfig({
		plugins: [
			dts({
				entryRoot: rootDir,
				insertTypesEntry: true
			}),
			react()
		],
		build: {
			outDir: buildDir,
			emptyOutDir: true,
			lib: {
				entry: rootDir,
				name: config.name,
				fileName: config.name
			},
			rollupOptions: {
				external: [
					...Object.keys(packageJson.dependencies ?? {}),
					...Object.keys(packageJson.devDependencies ?? {})
				]
			}
		}
	});
};
