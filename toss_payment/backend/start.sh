#!/bin/bash

# 토스페이먼츠 결제 서버 시작 스크립트

echo "🚀 토스페이먼츠 결제 서버를 시작합니다..."

# Node.js 버전 확인
echo "📋 Node.js 버전 확인 중..."
node --version
npm --version

# 의존성 설치
echo "📦 의존성 설치 중..."
npm install

# 서버 시작
echo "🌟 서버 시작 중..."
npm start
