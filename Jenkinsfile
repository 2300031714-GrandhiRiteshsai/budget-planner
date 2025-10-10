pipeline {
    agent any

    environment {
        JAVA_HOME = 'C:\\Program Files\\Java\\jdk-21'
        MAVEN_HOME = 'C:\\Users\\rites\\Downloads\\Telegram Desktop\\apache-maven-3.9.9-bin\\apache-maven-3.9.9'
        NODE_HOME = 'C:\\Program Files\\nodejs'
        PATH = "${env.MAVEN_HOME}\\bin;${env.NODE_HOME};${env.JAVA_HOME}\\bin;${env.PATH}"
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
                echo 'Building backend...'
                dir('backend') {
                    bat '"%MAVEN_HOME%\\bin\\mvn" clean package -DskipTests'
                }
            }
        }

        stage('Run Backend') {
            steps {
                echo 'Starting backend on port 8081...'
                dir('backend') {
                    // Start backend in background and log output
                    bat 'start /B java -jar target\\*.jar --server.port=8081 > backend.log 2>&1'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building frontend...'
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Run Frontend') {
            steps {
                echo 'Starting frontend on port 5173...'
                dir('frontend') {
                    // Start frontend in background and log output
                    bat 'start /B npm start > frontend.log 2>&1'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished. Check backend.log and frontend.log for details.'
        }
    }
}
