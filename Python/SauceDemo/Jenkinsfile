pipeline {
    agent {
        docker {
            image 'selenium/standalone-chrome:latest'
            args '-u 0:0'
        }
    }
    options {
        buildDiscarder(logRotator(
            artifactNumToKeepStr: '5',
            numToKeepStr: '5'
        ))
    }
    stages {
        stage('Install') {
            steps {
                sh '''
                    ls -F
                    pip install uv
                    uv venv .venv --clear
                    uv pip install -r requirements.txt
                '''
            }
        }
        stage('Tests') {
            parallel {
                stage('Login') {
                    steps {
                        sh '''
                            export CI=true
                            export PYTHONPATH=src
                            uv run pytest tests/test_login.py 
                        '''
                    }
                }
                stage('Products') {
                    steps {
                        sh '''
                            export CI=true
                            export PYTHONPATH=src
                            uv run pytest tests/test_products.py
                        '''
                    }
                }
                stage('Concurrent') {
                    steps {
                        sh '''
                            export CI=true
                            export PYTHONPATH=src
                            uv run pytest -n 2 --html=reports/report.html --cov=src --cov-report=html:reports/coverage --junitxml=reports/test-results.xml
                        '''
                    }
                }
            }
        }
    }
    post {
      always {
        archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true
      }  
    }
}