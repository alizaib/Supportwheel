echo
echo Instalando pacotes atrav�s do NPM
call npm install --prefix .temp\scripts
echo
echo Copiando scripts para a pasta correta
call xcopy .temp\scripts\node_modules .\app\libs
echo
echo Instala��o das bibliotecas conclu�das