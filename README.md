# 🐝 HoneyNotes

> **Un refugio digital para parejas que buscan trascender la inmediatez de la mensajería instantánea.**

![Version](https://img.shields.io/badge/version-1.5-crimson)
![Status](https://img.shields.io/badge/status-v1.5.0-success)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![Firebase](https://img.shields.io/badge/Firebase-11.9-orange)

## 🎯 Visión

HoneyNotes nace como una plataforma de **comunicación profunda para parejas**, recuperando el poder de la carta escrita como herramienta de introspección y conexión emocional. La aplicación no solo facilita el envío de mensajes, sino que actúa como un mediador tecnológico que fomenta prácticas de comunicación sana, asertiva y empática.

## ✨ Características Principales

### 📝 Editor de Cartas

- Lienzo digital con textura de papel auténtico
- 10 colores de fondo personalizables
- 12 tipografías cursivas y manuscritas
- 9 estampas decorativas (incluyendo emojis)
- 4 estilos de borde (simple, airmail, punteado, floral)

### 🐝 La Abeja Guía (IA)

- Asistente de escritura potenciado por **Google Gemini**
- Dos personalidades: **Amistosa** (empatía) y **Racional** (claridad)
- Análisis de sentimiento y sugerencias de mejora
- Predictor de reacción del destinatario

### 📬 Buzón de Cartas

- Animación de apertura de sobre
- Indicadores de cartas no leídas
- Diseño estilo correo postal clásico

### 🎮 Gamificación

- **Polen**: Moneda de esfuerzo ganada al completar tareas
- **Tienda de la Colmena**: Desbloquea estampas y colores premium
- **Tareas Semanales**: Retos para mejorar la comunicación en pareja

## 🛠️ Stack Tecnológico

### Frontend

- **Next.js 15.5** con App Router y Turbopack
- **React 19** con Server Components
- **Tailwind CSS** + **shadcn/ui** para componentes
- **Framer Motion** para animaciones
- **PWA Ready** para experiencia nativa

### Backend (Firebase Ecosystem)

- **Cloud Firestore**: Base de datos NoSQL en tiempo real
- **Firebase Auth**: Autenticación con Google y email
- **Firebase GenAI Extension**: Conexión directa con Gemini
- **Cloud Functions**: Cron jobs para tareas semanales

### IA Generativa

- **Genkit** para orquestación de flujos de IA
- **Google Gemini 1.5 Flash** para análisis de texto

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/sjaquer/honeynotes.git
cd honeynotes

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Firebase

# Ejecutar en desarrollo
npm run dev
```

## 📁 Estructura del Proyecto

```text
src/
├── ai/                    # Flujos de IA con Genkit
│   └── flows/             # letter-content-feedback, generation
├── app/                   # Next.js App Router
│   ├── (app)/             # Rutas autenticadas
│   │   ├── inbox/         # Buzón de cartas
│   │   ├── new-letter/    # Editor de cartas
│   │   ├── tasks/         # Tareas semanales
│   │   └── shop/          # Tienda de la Colmena
│   └── letter/[id]/       # Vista de lectura
├── components/            # Componentes UI
│   ├── ui/                # shadcn/ui components
│   └── icons/             # Iconos personalizados
├── hooks/                 # Custom hooks
└── lib/                   # Utilidades y tipos
    ├── firebase/          # Configuración Firebase
    └── locales/           # Traducciones i18n
```

## 🎨 Diseño "Stylized Crimson"

El diseño se basa en el concepto de **Papelería Digital de Lujo**:

- **Paleta**: Carmsí (#DC143C) como color principal
- **Contenedores**: Bordes redondeados de 24-32px
- **Sombras**: Profundas pero suaves en carmsí translúcido
- **Micro-interacciones**: Botones que se "hunden" al presionar
- **Tipografía**: Dancing Script, Great Vibes, Indie Flower

## 📈 Roadmap

### Fase 1: MVP (Actual)

- [x] Editor de texto con personalización completa
- [x] Integración con IA (Abeja Guía)
- [x] Diseño responsive móvil-first
- [x] Almacenamiento en Firebase

### Fase 2: Conectividad

- [x] Firebase Auth (Google + Email)
- [x] Vinculación de parejas por código
- [ ] Notificaciones Push (FCM)

### Fase 3: Economía

- [x] Tienda de la Colmena funcional (Básico)
- [ ] Sistema de tareas semanales automatizado
- [ ] Jalea Real (moneda premium)

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar HoneyNotes, no dudes en:

1. Abrir un **Issue** para discutir cambios.
2. Hacer un **Fork** del repositorio.
3. Crear una **Pull Request** con tus mejoras.

## 💛 Creado con amor

HoneyNotes es un proyecto personal creado para mejorar la comunicación en las relaciones.

---

*"Recuperando el arte de escribir cartas, una nota a la vez."* 🐝
