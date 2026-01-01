import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	target: "es2022",
	clean: true,
	sourcemap: true,
	splitting: false,
	platform: "node",
	banner: {
		js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
	},
});
