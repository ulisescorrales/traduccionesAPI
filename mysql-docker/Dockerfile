FROM mysql

ENV MYSQL_ROOT_PASSWORD=1234
ENV MYSQL_DATABASE=playWords_db
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=1234
ENV PORT=3306

# Copy the SQL file to the init directory
COPY schema.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
CMD [ "mysqld" ]