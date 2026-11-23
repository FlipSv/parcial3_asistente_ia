import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

os.makedirs(r"d:\parcial3_moviles\diagrams", exist_ok=True)
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.family'] = 'sans-serif'

def draw_waterfall():
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 7)
    ax.axis('off')

    phases = [
        ("1. Análisis de Requisitos", "Definición de necesidades, requerimientos\nfuncionales y no funcionales de la app de IA.", "#4F46E5"),
        ("2. Diseño del Sistema", "Modelado de casos de uso, secuencias,\narquitectura en capas y mockups de UI.", "#2563EB"),
        ("3. Implementación (Codificación)", "Desarrollo en React Native/Expo, motor de\ninteligencia contextual y persistencia local.", "#0D9488"),
        ("4. Pruebas y Validación", "Pruebas funcionales en 3 emuladores móviles,\nvalidación de UI adaptativa y persistencia.", "#D97706"),
        ("5. Despliegue y Mantenimiento", "Preparación para despliegue móvil (Expo Go),\ncontrol de versiones Git y documentación.", "#059669")
    ]

    for i, (title, desc, color) in enumerate(phases):
        x = 0.5 + i * 1.5
        y = 5.2 - i * 1.1
        
        # Box
        rect = patches.FancyBboxPatch((x, y), 4.2, 0.9, boxstyle="round,pad=0.1,rounding_size=0.15",
                                      facecolor=color, edgecolor='none', alpha=0.92)
        ax.add_patch(rect)
        
        # Text
        ax.text(x + 0.2, y + 0.62, title, fontsize=10.5, fontweight='bold', color='white', va='center')
        ax.text(x + 0.2, y + 0.25, desc, fontsize=7.8, color='#F8FAFC', va='center')

        # Cascading Arrow to next phase
        if i < len(phases) - 1:
            ax.annotate('', xy=(x + 2.1, y - 0.2), xytext=(x + 2.1, y),
                        arrowprops=dict(arrowstyle="->", lw=2, color="#475569", mutation_scale=14))
            ax.annotate('', xy=(x + 2.8, y - 0.2), xytext=(x + 2.1, y - 0.2),
                        arrowprops=dict(arrowstyle="->", lw=2, color="#475569", mutation_scale=14))

    ax.text(5.5, 6.6, "Metodología Cascada (Waterfall) - Ciclo de Desarrollo", fontsize=14, 
            fontweight='bold', color='#1E293B', ha='center')
    plt.tight_layout()
    plt.savefig(r"d:\parcial3_moviles\diagrams\metodologia_cascada.png", bbox_inches='tight')
    plt.close()
    print("Metodología Cascada diagram generated.")

def draw_use_cases():
    fig, ax = plt.subplots(figsize=(10.5, 7), dpi=300)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 9)
    ax.axis('off')

    # System Boundary
    boundary = patches.FancyBboxPatch((3.2, 0.6), 5.6, 7.8, boxstyle="round,pad=0.1,rounding_size=0.1",
                                     facecolor='#F8FAFC', edgecolor='#64748B', lw=1.5, ls='--')
    ax.add_patch(boundary)
    ax.text(6.0, 8.1, "Sistema Móvil de Asistente Personal con IA", fontsize=12, fontweight='bold',
            color='#1E293B', ha='center')

    # Actors
    # User Actor (left)
    ax.plot([1.2, 1.2], [4.6, 4.0], color='#1E293B', lw=2.5) # spine
    circle = patches.Circle((1.2, 4.9), 0.3, facecolor='#DBEAFE', edgecolor='#1E293B', lw=2) # head
    ax.add_patch(circle)
    ax.plot([0.7, 1.7], [4.3, 4.3], color='#1E293B', lw=2.5) # arms
    ax.plot([1.2, 0.8], [4.0, 3.4], color='#1E293B', lw=2.5) # left leg
    ax.plot([1.2, 1.6], [4.0, 3.4], color='#1E293B', lw=2.5) # right leg
    ax.text(1.2, 3.0, "Usuario Móvil", fontsize=10, fontweight='bold', color='#1E293B', ha='center')

    # AI Service Actor (right)
    ax.plot([10.5, 10.5], [4.6, 4.0], color='#1E293B', lw=2.5)
    circle_ai = patches.Circle((10.5, 4.9), 0.3, facecolor='#E0E7FF', edgecolor='#4338CA', lw=2)
    ax.add_patch(circle_ai)
    ax.plot([10.0, 11.0], [4.3, 4.3], color='#1E293B', lw=2.5)
    ax.plot([10.5, 10.1], [4.0, 3.4], color='#1E293B', lw=2.5)
    ax.plot([10.5, 10.9], [4.0, 3.4], color='#1E293B', lw=2.5)
    ax.text(10.5, 3.0, "Motor IA / API\n(Gemini / Context Engine)", fontsize=9.5, fontweight='bold', color='#4338CA', ha='center')

    use_cases = [
        ("CU01: Interactuar en Chat con Asistente", 7.2, True, True),
        ("CU02: Crear y Gestionar Tareas/Recordatorios", 5.8, True, False),
        ("CU03: Generar Resumen Diario con IA", 4.4, True, True),
        ("CU04: Configurar Preferencias y Modelo de IA", 3.0, True, False),
        ("CU05: Almacenamiento y Persistencia Local", 1.6, False, True),
    ]

    for title, y_pos, link_user, link_ai in use_cases:
        ellipse = patches.Ellipse((6.0, y_pos), 4.8, 0.95, facecolor='#EEF2FF', edgecolor='#4F46E5', lw=1.6)
        ax.add_patch(ellipse)
        ax.text(6.0, y_pos, title, fontsize=9.2, fontweight='bold', color='#1E1B4B', ha='center', va='center')
        
        if link_user:
            ax.plot([1.7, 3.6], [4.4, y_pos], color='#475569', lw=1.4)
        if link_ai:
            ax.plot([8.4, 10.0], [y_pos, 4.4], color='#6366F1', lw=1.4, ls=':')

    # include relationship
    ax.annotate('<<include>>', xy=(6.0, 2.1), xytext=(6.0, 5.3),
                arrowprops=dict(arrowstyle="->", lw=1.2, color="#94A3B8", ls='--'),
                fontsize=8, color='#64748B', ha='center')

    ax.text(6.0, 8.7, "Diagrama de Casos de Uso - Asistente Personal con IA", fontsize=13,
            fontweight='bold', color='#0F172A', ha='center')
    plt.tight_layout()
    plt.savefig(r"d:\parcial3_moviles\diagrams\casos_de_uso.png", bbox_inches='tight')
    plt.close()
    print("Casos de uso diagram generated.")

def draw_sequence():
    fig, ax = plt.subplots(figsize=(11, 7.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 10)
    ax.axis('off')

    lifelines = [
        ("Usuario", 1.2, "#3B82F6"),
        ("Interfaz Móvil\n(ChatScreen)", 3.4, "#6366F1"),
        ("Assistant\nController", 5.6, "#8B5CF6"),
        ("Motor IA\n(Gemini / Context)", 7.8, "#EC4899"),
        ("Storage\n(AsyncStorage)", 9.8, "#10B981")
    ]

    for name, x, color in lifelines:
        # Header Box
        box = patches.FancyBboxPatch((x - 0.8, 8.8), 1.6, 0.8, boxstyle="round,pad=0.1,rounding_size=0.1",
                                     facecolor=color, edgecolor='none')
        ax.add_patch(box)
        ax.text(x, 9.2, name, fontsize=8.5, fontweight='bold', color='white', ha='center', va='center')
        # Dashed Lifeline
        ax.plot([x, x], [1.0, 8.8], color='#94A3B8', lw=1.2, ls='--')

    messages = [
        (8.2, 1.2, 3.4, "1. Enviar consulta / solicitud de tarea", True),
        (7.5, 3.4, 5.6, "2. procesarMensaje(texto, contexto)", True),
        (6.8, 5.6, 7.8, "3. consultarIA(prompt, historial)", True),
        (5.9, 7.8, 5.6, "4. Retornar respuesta y tareas extraídas", False),
        (5.1, 5.6, 9.8, "5. guardarMensajeYEntidades(msg, tasks)", True),
        (4.3, 9.8, 5.6, "6. Confirmación de almacenamiento OK", False),
        (3.5, 5.6, 3.4, "7. actualizarEstado(respuesta, nuevasTareas)", False),
        (2.7, 3.4, 1.2, "8. Renderizar mensaje y tarjetas de acción", False),
    ]

    for y, x_from, x_to, label, is_call in messages:
        ls = '-' if is_call else '--'
        color = '#1E293B' if is_call else '#2563EB'
        ax.annotate('', xy=(x_to, y), xytext=(x_from, y),
                    arrowprops=dict(arrowstyle="->", lw=1.4, color=color, ls=ls, mutation_scale=12))
        x_mid = (x_from + x_to) / 2
        ax.text(x_mid, y + 0.18, label, fontsize=7.8, fontweight='semibold', color='#1E293B', ha='center')

    # Activation boxes
    activations = [(3.4, 2.5, 8.3), (5.6, 3.3, 7.6), (7.8, 5.8, 6.9), (9.8, 4.2, 5.2)]
    for x, y_min, y_max in activations:
        rect = patches.Rectangle((x - 0.08, y_min), 0.16, y_max - y_min, facecolor='#E2E8F0', edgecolor='#64748B', lw=1)
        ax.add_patch(rect)

    ax.text(5.5, 9.8, "Diagrama de Secuencia - Flujo de Interacción del Asistente IA", fontsize=13,
            fontweight='bold', color='#0F172A', ha='center')
    plt.tight_layout()
    plt.savefig(r"d:\parcial3_moviles\diagrams\diagrama_secuencia.png", bbox_inches='tight')
    plt.close()
    print("Diagrama de secuencia generated.")

def draw_architecture():
    fig, ax = plt.subplots(figsize=(10.5, 7.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 8.5)
    ax.axis('off')

    layers = [
        ("Capa de Presentación (UI / Móvil)", 6.4, "#4F46E5", [
            "DashboardScreen (Resumen Diario)",
            "ChatScreen (Conversación IA)",
            "TasksScreen (Gestión Tareas)",
            "SettingsScreen (Configuración & API)"
        ]),
        ("Capa de Lógica de Negocio y Control", 4.4, "#2563EB", [
            "AssistantController (Orquestador)",
            "TaskController (Lógica de Tareas)",
            "DailyBriefingService (Resumen y Hábitos)",
            "ContextManager (Memoria de Sesión)"
        ]),
        ("Capa de Inteligencia Artificial (AI Engine)", 2.4, "#7C3AED", [
            "Gemini API Client (Google GenAI)",
            "NLP Intent Extractor (Detección Tareas)",
            "Offline Fallback Assistant (Sin Conexión)",
            "Prompt Engineering & Persona Template"
        ]),
        ("Capa de Datos y Persistencia Local", 0.4, "#059669", [
            "AsyncStorage Driver (Almacén KV)",
            "ChatHistoryRepository (Mensajes)",
            "TaskRepository (Tareas CRUD)",
            "UserSettingsStorage (Preferencias & Keys)"
        ])
    ]

    for title, y, color, modules in layers:
        # Layer container
        rect = patches.FancyBboxPatch((0.6, y), 9.8, 1.6, boxstyle="round,pad=0.08,rounding_size=0.15",
                                     facecolor='#F8FAFC', edgecolor=color, lw=2)
        ax.add_patch(rect)
        # Layer Header
        header = patches.FancyBboxPatch((0.6, y + 1.25), 9.8, 0.35, boxstyle="round,pad=0.04,rounding_size=0.1",
                                       facecolor=color, edgecolor='none')
        ax.add_patch(header)
        ax.text(0.9, y + 1.42, title, fontsize=9.5, fontweight='bold', color='white', va='center')

        # Submodules
        for j, mod in enumerate(modules):
            mx = 0.9 + j * 2.35
            my = y + 0.25
            mod_box = patches.FancyBboxPatch((mx, my), 2.15, 0.75, boxstyle="round,pad=0.05,rounding_size=0.08",
                                            facecolor='white', edgecolor='#CBD5E1', lw=1.2)
            ax.add_patch(mod_box)
            ax.text(mx + 1.07, my + 0.37, mod, fontsize=7.2, color='#1E293B', ha='center', va='center', wrap=True)

        # Connector Arrows between layers
        if y > 1.0:
            ax.annotate('', xy=(5.5, y), xytext=(5.5, y + 0.35),
                        arrowprops=dict(arrowstyle="<->", lw=2, color="#64748B", mutation_scale=14))

    ax.text(5.5, 8.2, "Diagrama de Arquitectura de Software en Capas", fontsize=14,
            fontweight='bold', color='#0F172A', ha='center')
    plt.tight_layout()
    plt.savefig(r"d:\parcial3_moviles\diagrams\diagrama_arquitectura.png", bbox_inches='tight')
    plt.close()
    print("Diagrama de arquitectura generated.")

def draw_mockups():
    fig, axes = plt.subplots(1, 4, figsize=(14, 7), dpi=300)
    screen_titles = ["1. Dashboard / Inicio", "2. Chat Asistente IA", "3. Gestor de Tareas", "4. Configuración"]
    
    for idx, (ax, title) in enumerate(zip(axes, screen_titles)):
        ax.set_xlim(0, 10)
        ax.set_ylim(0, 20)
        ax.axis('off')

        # Phone bezel
        phone = patches.FancyBboxPatch((0.2, 0.2), 9.6, 19.6, boxstyle="round,pad=0.2,rounding_size=0.8",
                                      facecolor='#0F172A', edgecolor='#334155', lw=3)
        ax.add_patch(phone)
        # Screen area
        screen = patches.FancyBboxPatch((0.5, 0.8), 9.0, 18.2, boxstyle="round,pad=0.1,rounding_size=0.4",
                                       facecolor='#F8FAFC', edgecolor='none')
        ax.add_patch(screen)
        # Notch / Camera pill
        notch = patches.FancyBboxPatch((4.0, 18.2), 2.0, 0.35, boxstyle="round,pad=0.05,rounding_size=0.15",
                                      facecolor='#0F172A', edgecolor='none')
        ax.add_patch(notch)
        # Top title
        ax.text(5.0, 19.8, title, fontsize=10, fontweight='bold', color='#1E293B', ha='center')

        # Screen specific mockup content
        if idx == 0:  # Dashboard
            # App Bar
            ax.add_patch(patches.Rectangle((0.5, 16.6), 9.0, 1.4, facecolor='#4F46E5'))
            ax.text(1.0, 17.3, "Nova Asistente IA", fontsize=8.5, fontweight='bold', color='white')
            # Greeting card
            ax.add_patch(patches.FancyBboxPatch((1.0, 13.6), 8.0, 2.5, boxstyle="round,pad=0.1,rounding_size=0.2",
                                               facecolor='#EEF2FF', edgecolor='#C7D2FE'))
            ax.text(1.3, 15.3, "¡Hola, Felipe!", fontsize=8.5, fontweight='bold', color='#1E1B4B')
            ax.text(1.3, 14.5, "Tienes 3 tareas para hoy.", fontsize=7.2, color='#4338CA')
            ax.text(1.3, 13.9, "* 'Organizar tu dia multiplica tu foco' *", fontsize=6.5, fontstyle='italic', color='#6366F1')
            # Stats row
            ax.add_patch(patches.FancyBboxPatch((1.0, 11.2), 3.8, 1.8, boxstyle="round,pad=0.1,rounding_size=0.15",
                                               facecolor='#DCFCE7', edgecolor='#86EFAC'))
            ax.text(2.9, 12.3, "3", fontsize=12, fontweight='bold', color='#15803D', ha='center')
            ax.text(2.9, 11.5, "Pendientes", fontsize=6.8, color='#166534', ha='center')
            ax.add_patch(patches.FancyBboxPatch((5.2, 11.2), 3.8, 1.8, boxstyle="round,pad=0.1,rounding_size=0.15",
                                               facecolor='#FEF3C7', edgecolor='#FDE68A'))
            ax.text(7.1, 12.3, "5", fontsize=12, fontweight='bold', color='#B45309', ha='center')
            ax.text(7.1, 11.5, "Completadas", fontsize=6.8, color='#92400E', ha='center')
            # Quick actions
            ax.text(1.0, 10.3, "Acciones Rapidas", fontsize=7.5, fontweight='bold', color='#334155')
            ax.add_patch(patches.FancyBboxPatch((1.0, 8.4), 8.0, 1.4, boxstyle="round,pad=0.08,rounding_size=0.1",
                                               facecolor='#FFFFFF', edgecolor='#E2E8F0'))
            ax.text(1.4, 9.1, "> Iniciar conversacion con la IA", fontsize=7, color='#1E293B')
            ax.add_patch(patches.FancyBboxPatch((1.0, 6.6), 8.0, 1.4, boxstyle="round,pad=0.08,rounding_size=0.1",
                                               facecolor='#FFFFFF', edgecolor='#E2E8F0'))
            ax.text(1.4, 7.3, "> Ver agenda y recordatorios", fontsize=7, color='#1E293B')
            ax.add_patch(patches.FancyBboxPatch((1.0, 4.8), 8.0, 1.4, boxstyle="round,pad=0.08,rounding_size=0.1",
                                               facecolor='#FFFFFF', edgecolor='#E2E8F0'))
            ax.text(1.4, 5.5, "> Generar resumen inteligente", fontsize=7, color='#1E293B')

        elif idx == 1:  # Chat
            ax.add_patch(patches.Rectangle((0.5, 16.6), 9.0, 1.4, facecolor='#4F46E5'))
            ax.text(1.0, 17.3, "Chat Asistente IA (Nova)", fontsize=8.2, fontweight='bold', color='white')
            # Assistant bubble 1
            ax.add_patch(patches.FancyBboxPatch((0.9, 13.8), 7.0, 2.2, boxstyle="round,pad=0.1,rounding_size=0.2",
                                               facecolor='#F1F5F9', edgecolor='#CBD5E1'))
            ax.text(1.2, 15.2, "[Asistente IA]:", fontsize=6.8, fontweight='bold', color='#475569')
            ax.text(1.2, 14.3, "Hola! En que puedo ayudarte hoy?\nPuedo crear tareas o darte ideas.", fontsize=6.5, color='#1E293B')
            # User bubble
            ax.add_patch(patches.FancyBboxPatch((2.6, 11.4), 6.5, 1.8, boxstyle="round,pad=0.1,rounding_size=0.2",
                                               facecolor='#4F46E5', edgecolor='none'))
            ax.text(2.9, 12.4, "Recuerdame entregar el parcial", fontsize=6.8, color='white')
            ax.text(2.9, 11.7, "de moviles a las 11:59 PM.", fontsize=6.8, color='white')
            # Assistant bubble 2
            ax.add_patch(patches.FancyBboxPatch((0.9, 7.6), 7.4, 3.2, boxstyle="round,pad=0.1,rounding_size=0.2",
                                               facecolor='#EEF2FF', edgecolor='#C7D2FE'))
            ax.text(1.2, 10.0, "[Asistente IA]:", fontsize=6.8, fontweight='bold', color='#4338CA')
            ax.text(1.2, 9.3, "Anotado! He creado la tarea:", fontsize=6.5, color='#1E293B')
            ax.text(1.4, 8.5, "[*] 'Entregar parcial moviles'", fontsize=6.5, fontweight='bold', color='#4F46E5')
            ax.text(1.4, 7.9, "Prioridad: ALTA | Vence: Hoy", fontsize=6.0, color='#64748B')
            # Input bar at bottom
            ax.add_patch(patches.FancyBboxPatch((0.8, 1.8), 6.8, 1.2, boxstyle="round,pad=0.08,rounding_size=0.15",
                                               facecolor='#FFFFFF', edgecolor='#CBD5E1'))
            ax.text(1.2, 2.3, "Escribe un mensaje o tarea...", fontsize=6.5, color='#94A3B8')
            ax.add_patch(patches.Circle((8.3, 2.4), 0.55, facecolor='#4F46E5'))
            ax.text(8.3, 2.4, ">", fontsize=8, color='white', ha='center', va='center')

        elif idx == 2:  # Tasks
            ax.add_patch(patches.Rectangle((0.5, 16.6), 9.0, 1.4, facecolor='#4F46E5'))
            ax.text(1.0, 17.3, "Tareas & Recordatorios", fontsize=8.2, fontweight='bold', color='white')
            # Filter chips
            ax.add_patch(patches.FancyBboxPatch((0.9, 15.3), 2.2, 0.8, boxstyle="round,pad=0.05,rounding_size=0.15",
                                               facecolor='#4F46E5'))
            ax.text(2.0, 15.7, "Todas (3)", fontsize=6.5, color='white', ha='center', va='center')
            ax.add_patch(patches.FancyBboxPatch((3.4, 15.3), 2.5, 0.8, boxstyle="round,pad=0.05,rounding_size=0.15",
                                               facecolor='#E2E8F0'))
            ax.text(4.65, 15.7, "Pendientes", fontsize=6.5, color='#475569', ha='center', va='center')
            ax.add_patch(patches.FancyBboxPatch((6.2, 15.3), 2.6, 0.8, boxstyle="round,pad=0.05,rounding_size=0.15",
                                               facecolor='#E2E8F0'))
            ax.text(7.5, 15.7, "Completadas", fontsize=6.5, color='#475569', ha='center', va='center')
            # Task Card 1
            ax.add_patch(patches.FancyBboxPatch((0.9, 12.4), 8.2, 2.4, boxstyle="round,pad=0.08,rounding_size=0.15",
                                               facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=1.2))
            ax.add_patch(patches.Circle((1.5, 13.6), 0.35, facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1.5))
            ax.text(2.2, 14.0, "Entregar parcial de moviles", fontsize=7.2, fontweight='bold', color='#1E293B')
            ax.text(2.2, 13.2, "UDI - Electiva profesional 1", fontsize=6.2, color='#64748B')
            ax.add_patch(patches.FancyBboxPatch((2.2, 12.6), 1.8, 0.45, boxstyle="round,pad=0.03,rounding_size=0.08",
                                               facecolor='#FEE2E2'))
            ax.text(3.1, 12.8, "URGENTE", fontsize=5.5, fontweight='bold', color='#B91C1C', ha='center')
            # Task Card 2
            ax.add_patch(patches.FancyBboxPatch((0.9, 9.4), 8.2, 2.4, boxstyle="round,pad=0.08,rounding_size=0.15",
                                               facecolor='#FFFFFF', edgecolor='#E2E8F0', lw=1.2))
            ax.add_patch(patches.Circle((1.5, 10.6), 0.35, facecolor='#FFFFFF', edgecolor='#CBD5E1', lw=1.5))
            ax.text(2.2, 11.0, "Subir codigo a GitHub", fontsize=7.2, fontweight='bold', color='#1E293B')
            ax.text(2.2, 10.2, "Repositorio con commits organizados", fontsize=6.2, color='#64748B')
            # Task Card 3 (Completed)
            ax.add_patch(patches.FancyBboxPatch((0.9, 6.4), 8.2, 2.4, boxstyle="round,pad=0.08,rounding_size=0.15",
                                               facecolor='#F8FAFC', edgecolor='#E2E8F0', lw=1))
            ax.add_patch(patches.Circle((1.5, 7.6), 0.35, facecolor='#10B981', edgecolor='#10B981'))
            ax.text(1.5, 7.6, "OK", fontsize=6.0, color='white', ha='center', va='center')
            ax.text(2.2, 8.0, "Diseno de Diagramas UML", fontsize=7.2, fontweight='bold', color='#94A3B8')
            ax.text(2.2, 7.2, "Completado con exito", fontsize=6.2, color='#94A3B8')
            # FAB Button
            ax.add_patch(patches.Circle((8.0, 2.6), 0.75, facecolor='#4F46E5'))
            ax.text(8.0, 2.6, "+", fontsize=14, color='white', ha='center', va='center')

        elif idx == 3:  # Settings
            ax.add_patch(patches.Rectangle((0.5, 16.6), 9.0, 1.4, facecolor='#4F46E5'))
            ax.text(1.0, 17.3, "Configuracion del Sistema", fontsize=8.0, fontweight='bold', color='white')
            # Profile section
            ax.add_patch(patches.FancyBboxPatch((1.0, 13.8), 8.0, 2.2, boxstyle="round,pad=0.08,rounding_size=0.15",
                                               facecolor='#FFFFFF', edgecolor='#E2E8F0'))
            ax.add_patch(patches.Circle((2.0, 14.9), 0.65, facecolor='#E0E7FF'))
            ax.text(2.0, 14.9, "U", fontsize=10, fontweight='bold', color='#4338CA', ha='center', va='center')
            ax.text(3.0, 15.2, "Felipe (Usuario)", fontsize=7.5, fontweight='bold', color='#1E293B')
            ax.text(3.0, 14.4, "Modo: Estudiante UDI", fontsize=6.5, color='#64748B')
            # AI Engine selection
            ax.text(1.0, 13.0, "Motor de Inteligencia Artificial", fontsize=7.5, fontweight='bold', color='#334155')
            ax.add_patch(patches.FancyBboxPatch((1.0, 10.8), 8.0, 1.8, boxstyle="round,pad=0.08,rounding_size=0.15",
                                               facecolor='#EEF2FF', edgecolor='#6366F1'))
            ax.text(1.3, 11.9, "(*) Gemini 1.5 / Flash AI (Cloud)", fontsize=7.0, fontweight='bold', color='#4338CA')
            ax.text(1.3, 11.2, "API Key activa y verificada", fontsize=6.0, color='#6366F1')
            ax.add_patch(patches.FancyBboxPatch((1.0, 8.6), 8.0, 1.8, boxstyle="round,pad=0.08,rounding_size=0.15",
                                               facecolor='#FFFFFF', edgecolor='#E2E8F0'))
            ax.text(1.3, 9.7, "( ) Local NLP Intelligence (Offline)", fontsize=7.0, color='#1E293B')
            ax.text(1.3, 9.0, "Motor de reglas e intenciones integrado", fontsize=6.0, color='#64748B')
            # Preferences
            ax.text(1.0, 7.8, "Preferencias Generales", fontsize=7.5, fontweight='bold', color='#334155')
            ax.add_patch(patches.FancyBboxPatch((1.0, 5.6), 8.0, 1.8, boxstyle="round,pad=0.08,rounding_size=0.15",
                                               facecolor='#FFFFFF', edgecolor='#E2E8F0'))
            ax.text(1.3, 6.7, "Notificaciones de Tareas: Activo", fontsize=6.8, color='#1E293B')
            ax.text(1.3, 6.0, "Tema Visual: Modo Claro / Automatico", fontsize=6.8, color='#1E293B')
            # Save button
            ax.add_patch(patches.FancyBboxPatch((1.5, 2.2), 7.0, 1.2, boxstyle="round,pad=0.08,rounding_size=0.15",
                                               facecolor='#10B981'))
            ax.text(5.0, 2.7, "Guardar Configuracion", fontsize=7.5, fontweight='bold', color='white', ha='center', va='center')

        # Bottom Tab Bar on all screens
        ax.add_patch(patches.Rectangle((0.5, 0.8), 9.0, 0.9, facecolor='#FFFFFF', edgecolor='#E2E8F0'))
        tabs = ["[Inicio]", "[Chat]", "[Tareas]", "[Ajustes]"]
        for t_idx, icon in enumerate(tabs):
            tx = 1.6 + t_idx * 2.2
            tab_color = '#4F46E5' if t_idx == idx else '#94A3B8'
            ax.text(tx, 1.25, icon, fontsize=7.5, fontweight='bold', color=tab_color, ha='center', va='center')

    plt.tight_layout()
    plt.savefig(r"d:\parcial3_moviles\diagrams\mockups_pantallas.png", bbox_inches='tight')
    plt.close()
    print("Mockups diagram generated.")

if __name__ == '__main__':
    draw_waterfall()
    draw_use_cases()
    draw_sequence()
    draw_architecture()
    draw_mockups()
    print("All diagrams generated successfully!")
