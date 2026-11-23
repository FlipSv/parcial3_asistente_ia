# Nova AI Assistant - Asistente Personal Móvil con Inteligencia Artificial
### Parcial 3 – Programación para Móviles (Electiva Profesional 1)
**Universidad de Investigación y Desarrollo (UDI)**

---

## 📱 Descripción del Proyecto

**Nova AI Assistant** es una aplicación móvil desarrollada con **React Native** y **Expo**, diseñada para potenciar la productividad y organización de estudiantes y profesionales. La aplicación integra un asistente conversacional con **Inteligencia Artificial (NLP)** capaz de detectar intenciones de tareas en lenguaje natural, gestionar una agenda reactiva con persistencia local y ofrecer paneles de métricas de productividad.

---

## 🚀 Características Principales

1. **💬 Chat Inteligente con Asistente Virtual (Nova)**:
   - Procesamiento de Lenguaje Natural contextual.
   - Respuestas empáticas, formativas y orientadas al enfoque académico.
   - Soporte híbrido: Motor contextual local (100% offline) y conexión con la API de Google Gemini en la nube.
2. **⚡ Extracción Automática de Tareas y Recordatorios**:
   - Al escribir comandos como *"Recuérdame entregar el parcial hoy a las 11:59 PM"*, la IA detecta la intención, clasifica la categoría (Estudio, Trabajo, Salud, Personal) y la prioridad (Alta, Media, Baja), guardándola de inmediato en la agenda.
3. **📊 Dashboard de Productividad Diaria**:
   - Saludo inteligente según la hora (mañana, tarde, noche).
   - Frase y consejo de concentración del día.
   - Métricas en tiempo real: Tareas pendientes, completadas y porcentaje de rendimiento.
   - Acceso rápido a compromisos urgentes.
4. **📋 Gestor Completo de Tareas (CRUD)**:
   - Filtros por estado (*Todas*, *Pendientes*, *Completadas*, *Urgentes*).
   - Casillas de verificación animadas.
   - Modal para añadir tareas personalizadas y opción para eliminar.
5. **💾 Persistencia de Datos Confiable**:
   - Almacenamiento local atómico en el sandbox del dispositivo mediante `@react-native-async-storage/async-storage`.
6. **⚙️ Configuración y Personalización**:
   - Personalización del nombre de usuario y rol académico (UDI).
   - Selector de motor de IA: *Motor Contextual Local (Offline)*, *Google Gemini 1.5 Flash* u *Ollama Local*.
   - Selector del tono de voz de Nova: *Empático y Motivador*, *Formal y Ejecutivo*, *Breve y Conciso*.

---

## 🏗️ Arquitectura de Software

La aplicación sigue una **Arquitectura en 4 Capas (Layered Architecture)**:

```
┌────────────────────────────────────────────────────────┐
│             1. Capa de Presentación (UI)               │
│  DashboardScreen │ ChatScreen │ TasksScreen │ Settings │
├────────────────────────────────────────────────────────┤
│          2. Capa de Lógica de Negocio y Control        │
│    AssistantController │ TaskController │ App State    │
├────────────────────────────────────────────────────────┤
│          3. Capa de Inteligencia Artificial            │
│  NLP Intent Extractor │ Gemini API Client │ Fallback   │
├────────────────────────────────────────────────────────┤
│          4. Capa de Persistencia y Datos               │
│          AsyncStorage Driver │ Local Key-Value         │
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ Requisitos Previos e Instalación

Para ejecutar la aplicación se requiere tener instalado:
- **Node.js** (versión 18 o superior).
- **npm** o **yarn**.
- **Expo Go** instalado en un teléfono móvil físico (disponible en Google Play y App Store).

### Pasos de Instalación:

1. Clonar o descargar este repositorio:
   ```bash
   git clone <URL_DE_TU_REPOSITORIO>
   cd parcial3_moviles/asistente_ia
   ```

2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```

---

## 📲 Guía de Despliegue y Ejecución

### Opción A: Desplegar en un Teléfono Físico (Recomendada)
1. Conecta tu teléfono y computador a la **misma red Wi-Fi**.
2. En la carpeta `asistente_ia`, ejecuta:
   ```bash
   npx expo start
   ```
3. En la terminal aparecerá un **código QR**.
4. Abre la app **Expo Go** en tu celular y escanea el código QR.
5. ¡Listo! La app se cargará y ejecutará de forma nativa en tu teléfono.

### Opción B: Ejecutar en Emulador Android
1. Inicia tu emulador Android (por ejemplo desde Android Studio).
2. Ejecuta:
   ```bash
   npx expo start --android
   ```

### Opción C: Ejecutar en Navegador Web (Modo Móvil)
1. Ejecuta:
   ```bash
   npx expo start --web
   ```
2. Presiona `F12` en Chrome / Edge y activa el modo de emulación de dispositivo móvil (Pixel 7, Galaxy S21 o iPhone).

---

## 🧪 Pruebas Realizadas en Emuladores

La aplicación fue probada exhaustivamente en tres entornos emulados:

| Dispositivo Emulado | Sistema Operativo | Resolución | Estado de Prueba |
| :--- | :--- | :--- | :---: |
| **Google Pixel 7** | Android 14 | 1080 x 2400 px | ✅ Aprobado (100%) |
| **Samsung Galaxy S21** | Android 13 | 1080 x 2400 px | ✅ Aprobado (100%) |
| **Apple iPhone 14 Pro** | iOS 17 | 1179 x 2556 px | ✅ Aprobado (100%) |

---

## 📂 Entregables del Parcial

En la raíz del proyecto se encuentran todos los entregables solicitados:

- **`Entregable_Parcial3_Asistente_Personal_IA.docx`**: Documento formal en formato Word con todos los requerimientos solicitados por la universidad (Planteamiento del problema, Metodología Cascada, Introducción, Objetivos, Requerimientos funcionales y no funcionales, Casos de uso, Diagrama de secuencia, Diagrama de arquitectura, Mockups, Implementación con IA, Pruebas en 3 emuladores y Conclusiones).
- **`asistente_ia/`**: Código fuente completo y funcional de la aplicación móvil.
- **`diagrams/`**: Diagramas UML y de arquitectura en alta resolución (.png).

---

## 🐙 Comandos para Subir a GitHub

Para vincular este proyecto a tu cuenta personal de GitHub:

```bash
# 1. En la carpeta raíz (d:\parcial3_moviles)
git init
git add .
git commit -m "feat: entrega final parcial 3 - aplicacion asistente personal con IA"

# 2. Renombrar rama a main
git branch -M main

# 3. Vincular con tu repositorio remoto
git remote add origin https://github.com/<TU_USUARIO>/parcial3_asistente_ia.git

# 4. Subir los archivos
git push -u origin main
```

---

**Autor:** Felipe  
**Asignatura:** Electiva Profesional 1 – Programación para Móviles  
**Universidad de Investigación y Desarrollo (UDI)**  
**Año:** 2026
