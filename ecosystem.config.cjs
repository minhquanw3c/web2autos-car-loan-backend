module.exports = {
	apps: [
		{
			name: "web2autos-backend-api",
			script: "npm",
			args: "run start",
			cwd: "/home/web2autos/public_html/web2autos-car-loan-backend",
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
