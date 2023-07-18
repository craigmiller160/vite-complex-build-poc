import fs from 'fs';
import path from 'path';

export type PackageJson = Readonly<{
	name: string;
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
}>;

export const getPackageJson = (): PackageJson => {
	const packageJsonFile = path.join(process.cwd(), 'package.json');
	return JSON.parse(fs.readFileSync(packageJsonFile, 'utf8')) as PackageJson;
};
