module.exports = {
    apps: [
        {
            // ---------------------------------------------
            // $ pm2 start --env production
            // ---------------------------------------------
            // pm2 process name
            //
            name: "SERVER-SERVER",
            script: "./app.js",
            env_stage: {
                "PORT": 3000,
                "NODE_ENV": "development"
            },
            // 배포환경시 적용될 설정 지정
            env_production: {
                "PORT": 8080,
                "NODE_ENV": "production"
            }
        }
    ]
};