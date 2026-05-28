@echo off
chcp 65001 >nul
title 막탄맛집 - 웹 미리보기 서버
cd /d "%~dp0"

echo.
echo  ========================================
echo    막탄 맛집 가이드 - 웹 미리보기 시작
echo  ========================================
echo.

if not exist "node_modules\" (
  echo [1/2] 처음 실행이라 패키지 설치 중... 잠시만 기다려 주세요.
  call npm install
  if errorlevel 1 (
    echo.
    echo  설치 실패. Node.js가 설치되어 있는지 확인해 주세요.
    echo  https://nodejs.org/
    pause
    exit /b 1
  )
) else (
  echo [1/2] 패키지는 이미 설치되어 있습니다.
)

echo [2/2] 개발 서버를 켭니다. 이 창을 닫지 마세요.
echo.
echo  준비되면 브라우저에서 아래 주소를 열어 주세요:
echo.
echo       http://localhost:8086
echo.
echo  (잠시 후 브라우저가 자동으로 열릴 수도 있습니다.)
echo  ========================================
echo.

start "" cmd /c "timeout /t 8 /nobreak >nul && start http://localhost:8086"
call npm run web

pause
