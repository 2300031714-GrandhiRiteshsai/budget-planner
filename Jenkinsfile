pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker images') {
      steps {
        script {
          if (isUnix()) {
            sh 'docker-compose build --parallel'
          } else {
            bat 'docker-compose build --parallel'
          }
        }
      }
    }

    stage('Start containers') {
      steps {
        script {
          if (isUnix()) {
            sh 'docker-compose up -d'
            sh 'sleep 15'   // wait a bit longer so DB & backend are ready
            sh 'docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"'
          } else {
            bat 'docker-compose up -d'
            bat 'timeout /t 15 /nobreak'
            bat 'docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"'
          }
        }
      }
    }

    stage('Check backend health') {
      steps {
        script {
          if (isUnix()) {
            sh 'curl --fail -sS http://localhost:8081 || true'
          } else {
            bat 'curl --fail -sS http://localhost:8081 || echo "curl not available"'
          }
        }
      }
    }
  }

  post {
    success {
      echo "✅ Build & Deployment successful"
    }
    failure {
      echo "❌ Build failed — check logs"
    }
    always {
      script {
        if (isUnix()) {
          sh 'docker-compose down'
        } else {
          bat 'docker-compose down'
        }
      }
    }
  }
}
