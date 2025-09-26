pipeline {
    agent any

    environment {
        JAVA_HOME = 'C:\\Program Files\\Java\\jdk-17'
        MAVEN_HOME = 'C:\\Program Files\\Apache\\apache-maven-3.9.4'
        NODE_HOME = 'C:\\Program Files\\nodejs'
        PATH = "${env.JAVA_HOME}\\bin;${env.MAVEN_HOME}\\bin;${env.NODE_HOME};${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    echo 'Building backend...'
                    bat 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    echo 'Installing frontend dependencies...'
                    bat 'npm install'
                    echo 'Building frontend...'
                    bat 'npm run build'
                }
            }
        }

        stage('Run Backend') {
            steps {
                dir('backend') {
                    echo 'Starting backend...'
                    bat 'start /B java -jar target\\budget-planner-backend-0.0.1-SNAPSHOT.jar > backend.log 2>&1'
                }
            }
        }

        stage('Check Backend Health') {
            steps {
                echo 'Waiting 10 seconds for backend to start...'
                bat 'timeout /t 10 /nobreak'
                echo 'Checking backend health...'
                bat 'curl http://localhost:8081/actuator/health'
            }
        }

        stage('Run Frontend') {
            steps {
                dir('frontend') {
                    echo 'Starting frontend...'
                    bat 'start /B npm run preview > frontend.log 2>&1'
                }
            }
        }
    }

    post {
        always {
            echo 'CI/CD pipeline finished.'
        }
        success {
            echo '✅ Build & deploy succeeded!'
        }
        failure {
            echo '❌ Build or deploy failed — check logs!'
        }
    }
}
