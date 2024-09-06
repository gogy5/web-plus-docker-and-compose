server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;

    location / {
        # Исправляем роутинг на фронтенде
        try_files $uri $uri/ /index.html;
    }
}
