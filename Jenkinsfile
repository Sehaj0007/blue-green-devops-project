pipeline {
    agent any

    environment {
        IMAGE_NAME = "sehaj07/bluegreen-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
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
                timeout(time: 2, unit: 'MINUTES') {
                    bat "kubectl rollout status deployment/green-app"
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    // Forward GREEN deployment
                    bat 'start /B kubectl port-forward deployment/green-app 8081:3000'

                    sleep 5

                    def response = bat(
                        script: "curl http://localhost:8081",
                        returnStdout: true
                    )

                    if (!response.contains("Version")) {
                        error("Green deployment is not healthy!")
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

            bat "kubectl rollout undo deployment/green-app"
        }

        success {
            echo "✅ Deployment successful! Running on GREEN"
        }
    }
}