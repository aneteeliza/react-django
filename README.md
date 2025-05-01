# 🚀 Karavīru meklētājs

This repository contains a full stack web application with:

- **Frontend**: React app (in `/frontend`) managed using [PM2](https://pm2.keymetrics.io/).
- **Backend**: Django application (in `/project`).

---

## 🔧 Frontend Setup (React + PM2)

### 1. Navigate to the frontend directory:
cd frontend

### 2. Install dependencies:
npm install

### 2. Build the project:
npm run build

### 2. Launch server using pm2
pm2 start server.js


---

## 🔧 Backend Setup (Django)

### 1. Navigate to the project directory:
cd project

### 2. Activate virtual environment for python3:
python3 -m venv env
source env/bin/activate

### 3. Install dependencies
pip install -r requirements.txt

### 4. Update settings.py with hosting info
project/project/settings.py
Change SITE_URL to new domain url

### 5. Update smtp email to a new email
Project sends confirmation email using smtp
Currentlty the project is set up to send the registration
email using a dummy gmail.
This email should be changed to a more presentable email

EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'

### 6. Use gunicorn to launch the django project in 0.0.0.0:8000
nohup gunicorn project.asgi:application \
  --workers {worker_count} \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile - \


---

## 🔧 Configuration(nginx or similar)
Frontend runs at http://127.0.0.1:3000; and must be forwarded to /
Backend runs at http://127.0.0.1:8000; and must be forwarded to /api

### Example configuration with nginx
server {
	listen       80;
        listen       [::]:80;
        server_name  {your_domain};
        root         /usr/share/nginx/html;
        location / {
                proxy_pass http://127.0.0.1:3000;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
 }

location /api/ {
    rewrite ^/api(/.*)$ $1 break;  # Remove /api prefix for Django
    proxy_pass http://127.0.0.1:8000;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}


