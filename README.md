Aplicación backend que retorna las traducciones en español de una palabra en inglés como entrada junto al tipo y definición.

Base de datos generada en MySQL a partir de una base de datos sqlite3 disponible en WikDict

Instalación:

docker compose up --build #expone el puerto 3000 por defecto

Uso:

localhost:3000/api/<palabra en inglés>


Demo: 
https://54.232.26.135:8008/api/<palabra en inglés>

URL de la base de datos de origen: https://download.wikdict.com/dictionaries/sqlite/2_2024-10/en-es.sqlite3
