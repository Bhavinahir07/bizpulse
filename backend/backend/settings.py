import os
from pathlib import Path
from decouple import config
import dj_database_url  # You need to: pip install dj-database-url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# --- PRODUCTION VS DEVELOPMENT SETUP ---
# On Render, it will use the environment variable. Locally, it defaults to True.
DEBUG = config('DEBUG', default=True, cast=bool)

# On Render, this variable is provided automatically.
RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')

# Add your Render domain to this list
ALLOWED_HOSTS = [
    '.ngrok-free.app', 
    'localhost', 
    '127.0.0.1', 
    'bizpulse-backend.onrender.com'  # <--- ADD THIS
]

if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY', default='django-insecure-local-test-key')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'whitenoise.runserver_nostatic', # Add this for WhiteNoise
    'django.contrib.staticfiles',
    'core.apps.CoreConfig',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # Add this EXACTLY after SecurityMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# --- DATABASE CONFIGURATION ---
# This automatically uses Render's Postgres if DATABASE_URL is found. 
# Otherwise, it falls back to your local XAMPP MySQL.
DATABASES = {
    'default': dj_database_url.config(
        default=f"mysql://root:@127.0.0.1:3306/bizpulse2.0",
        conn_max_age=600
    )
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# --- STATIC FILES (WhiteNoise configuration) ---
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Enable WhiteNoise's compression and caching support
if not DEBUG:
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# 1. Your fixed, permanent URLs (Manual)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://bizpulse-eta.vercel.app", 
]

# 2. Your dynamic "Automatic" URLs (The code you asked about)
VERCEL_URL = config('VERCEL_URL', default=None)
if VERCEL_URL:
    # This automatically adds any extra Vercel URLs
    CORS_ALLOWED_ORIGINS.append(f"https://{VERCEL_URL}")

# Don't forget CSRF for the main site!
# --- CHANGE THIS ---
CSRF_TRUSTED_ORIGINS = [
    "https://bizpulse-eta.vercel.app",
    "https://bizpulse-backend.onrender.com", # <--- ADD THIS LINE
]
# --- EMAIL CONFIGURATION ---
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = config('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')
ADMIN_EMAIL = config('ADMIN_EMAIL', default='bhavinmeta009@gmail.com')
