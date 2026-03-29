pipeline {
    agent any

    environment {
        IMAGE_NAME = "sehaj07/bluegreen-app"
        IMAGE_TAG = "final"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                bat "docker build --no-cache -t %IMAGE_NAME%:%IMAGE_TAG% ."
            }
        }

        stage('Push Docker Image') {
            steps {
                bat "docker push %IMAGE_NAME%:%IMAGE_TAG%"
            }
        }

        stage('Deploy Green') {
            steps {
                bat "kubectl set image deployment/green-app green-app-container=%IMAGE_NAME%:%IMAGE_TAG%"
            }
        }

        stage('Wait for Green Ready') {
            steps {
                bat "kubectl rollout status deployment/green-app"
            }
        }

        stage('Health Check') {
            steps {
                script {
                    def response = bat(
                    script: 'curl http://127.0.0.1:64920',
                    returnStdout: true
                )

                if (!response.contains("Version 2")) {
                    error("App is not healthy!")
                }
            }
        }
    }

        stage('Switch Traffic') {
            steps {
                bat '''
                kubectl patch service blue-service -p "{\\"spec\\":{\\"selector\\":{\\"app\\":\\"green-app\\"}}}"
                '''
            }
        }

    }

    post {
        failure {
            echo "❌ Deployment failed! Rolling back..."

            bat '''
            kubectl patch service blue-service -p "{\\"spec\\":{\\"selector\\":{\\"app\\":\\"blue-app\\"}}}"
            '''
        }

        success {
            echo "✅ Deployment successful! Running on GREEN"
        }
    }
}