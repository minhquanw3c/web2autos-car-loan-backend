import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	target: "es2022",
	clean: true,
	sourcemap: true,
	splitting: false,
	platform: "node",
	noExternal: [/(.*)/],
	banner: {
		js: `import { createRequire as _createRequire } from 'module';
			import { fileURLToPath as _fileURLToPath } from 'url';
			import { dirname as _dirname } from 'path';
			const require = _createRequire(import.meta.url);
			const __filename = _fileURLToPath(import.meta.url);
			const __dirname = _dirname(__filename);`,
	},
});
