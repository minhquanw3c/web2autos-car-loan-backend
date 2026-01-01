module.exports = {
	apps: [
		{
			name: "web2autos-backend-api",
			script: "node",
			args: "index.js",
			cwd: "/home/web2autos/public_html/api.web2autos.com",
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: "1000M",
			env: {
				NODE_ENV: "production",
				PORT: 3000,
			},
		},
	],
};
