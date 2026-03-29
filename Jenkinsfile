pipeline {
    agent any

    environment {
        IMAGE_NAME = "sehaj07/bluegreen-app"
        IMAGE_TAG = "v4"
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
                bat '''
                kubectl set image deployment/green-app green-app-container=%IMAGE_NAME%:%IMAGE_TAG%
                '''
            }
        }

        stage('Wait for Pods') {
            steps {
                bat "ping 127.0.0.1 -n 15 > nul"
            }
        }

        stage('Health Check') {
            steps {
                bat '''
                kubectl get pods
                '''
            }
        }

        stage('Switch Traffic to Green') {
            steps {
                bat '''
                kubectl patch service blue-service -p "{\\"spec\\":{\\"selector\\":{\\"app\\":\\"green-app\\"}}}"
                '''
            }
        }

    }
}