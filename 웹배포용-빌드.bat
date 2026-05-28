@echo off
chcp 65001 >nul
title 막탄맛집 - 웹 배포용 빌드
cd /d "%~dp0"

echo.
echo  ========================================
echo    웹 배포용 파일 만들기 (dist 폴더)
echo  ========================================
echo.

if not exist "node_modules\" (
  echo 패키지 설치 중...
  call npm install
  if errorlevel 1 goto :fail
)

echo 빌드 중... 1~3분 걸릴 수 있습니다.
call npm run build:web
if errorlevel 1 goto :fail

echo.
echo  완료! 아래 폴더를 Netlify Drop에 끌어다 놓으세요:
echo.
echo    %cd%\dist
echo.
explorer "%cd%\dist"
goto :end

:fail
echo.
echo  빌드 실패. 터미널 위쪽의 빨간 에러를 확인해 주세요.
pause
exit /b 1

:end
pause
