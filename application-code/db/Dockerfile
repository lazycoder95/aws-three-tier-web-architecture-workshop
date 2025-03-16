FROM mysql:8

# Set environment variables for MySQL
ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=mydatabase
ENV MYSQL_USER=myuser
ENV MYSQL_PASSWORD=mypassword

# Expose MySQL port
EXPOSE 3306

# Use a volume to persist data
VOLUME ["/var/lib/mysql"]