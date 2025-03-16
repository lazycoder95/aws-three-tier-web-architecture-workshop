FROM ubuntu

WORKDIR /app

COPY package*.json ./
RUN apt update && apt install -y curl bash npm && rm -rf /var/lib/apt/lists/*


ENV NVM_DIR /root/.nvm
RUN curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash && \
    echo 'export NVM_DIR="$HOME/.nvm"' >> /root/.bashrc && \
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> /root/.bashrc

RUN bash -c "source /root/.nvm/nvm.sh && nvm install 18 && nvm use 18"

COPY . .

EXPOSE 3000

CMD ["bash", "-c", "npm install && npm start"]