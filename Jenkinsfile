pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "sehaj07/bluegreen-app:v1"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %DOCKER_IMAGE% app'
            }
        }

        stage('Push Docker Image') {
            steps {
                bat 'docker push %DOCKER_IMAGE%'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f app/deployment.yaml'
                bat 'kubectl apply -f app/service.yaml'
            }
        }
    }
}