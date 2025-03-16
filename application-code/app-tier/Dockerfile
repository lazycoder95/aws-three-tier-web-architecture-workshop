FROM centos

WORKDIR /app

COPY package*.json ./
RUN sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*
RUN sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*
RUN yum install npm wget mysql -y
RUN npm install mysql2
RUN npm install cors
RUN mkdir -p /var/lib/mysql
RUN chown -R root:root /var/lib/mysql
RUN chmod -R 755 /var/lib/mysql
RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

RUN bash -c "source /root/.nvm/nvm.sh && nvm install 18 && nvm use 18"

COPY . .

EXPOSE 4000

CMD node index.js