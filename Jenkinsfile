pipeline {
    agent any

    environment {
        JAVA_HOME = 'C:\\Program Files\\Java\\jdk-21'
        MAVEN_HOME = 'C:\\Users\\rites\\Downloads\\Telegram Desktop\\apache-maven-3.9.9-bin\\apache-maven-3.9.9'
        NODE_HOME = 'C:\\Program Files\\nodejs'
        TOMCAT_HOME = 'C:\\Program Files\\Apache Software Foundation\\Tomcat 9.0'
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
                echo 'Building backend WAR...'
                dir('backend') {
                    bat '"%MAVEN_HOME%\\bin\\mvn" clean package -DskipTests'
                }
            }
        }

        stage('Deploy Backend to Tomcat (/api)') {
            steps {
                echo 'Deploying backend WAR to Tomcat under /api...'
                dir('backend') {
                    bat "copy /Y target\\*.war \"${env.TOMCAT_HOME}\\webapps\\api.war\""
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

        stage('Deploy Frontend as ROOT') {
            steps {
                echo 'Deploying React frontend as ROOT...'
                dir('frontend') {
                    // Remove existing ROOT safely
                    bat "rmdir /S /Q \"${env.TOMCAT_HOME}\\webapps\\ROOT\" || echo ROOT not existing"
                    // Copy new build to ROOT
                    bat "xcopy /E /I /Y dist \"${env.TOMCAT_HOME}\\webapps\\ROOT\""
                }
            }
        }

        stage('Start Tomcat') {
            steps {
                echo 'Stopping any existing Tomcat...'
                bat 'taskkill /F /IM java.exe || echo No java process running'

                echo 'Starting Tomcat on port 9090...'
                dir("${env.TOMCAT_HOME}\\bin") {
                    bat 'startup.bat'
                }

                echo 'Tomcat started successfully!'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}
