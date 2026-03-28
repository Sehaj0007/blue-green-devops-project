pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "sehaj07/bluegreen-app:v1"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                bat 'dir'
                bat 'docker build -t %DOCKER_IMAGE% .'
            }
        }

        stage('Push Docker Image') {
            steps {
                bat 'docker push %DOCKER_IMAGE%'
            }
        }

        stage('Test Kubernetes Access') {
            steps {
                bat 'kubectl get nodes'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f deployment.yaml'
                bat 'kubectl apply -f service.yaml'
            }
        }
    }
}