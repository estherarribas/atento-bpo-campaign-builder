# Documento de Requisitos de Producto (PRD)
## BPO Campaign Builder — Atento
**Versión:** 1.0  
**Fecha:** Septiembre 2026  
**Estado:** Propuesta de Definición / Aprobación  
**Autor:** Dirección de Producto & Transformación Digital / Desarrollo de Negocio Atento  
**Audiencia:** Equipo de Desarrollo de Negocio (KAMs, Presales Solution Designers, Directores Comerciales), Finanzas / Pricing, Operaciones BPO y Equipo de Ingeniería de Software.

---

## 1. Visión Ejecutiva y Objetivos Estratégicos

### 1.1 Visión del Producto
**BPO Campaign Builder** es una plataforma web interactiva y modular de uso interno diseñada para los **Key Account Managers (KAMs)** y equipos de **Preventa / Soluciones** de Atento. Permite configurar, dimensionar, simular financieramente y presentar en tiempo real propuestas operativas de Contact Center y BPO omnicanal (Voz, WhatsApp, Redes Sociales, Email, Backoffice e Inteligencia Artificial / Bots) delante del cliente en reuniones presenciales o remotas.

### 1.2 Declaración del Problema
Actualmente, el proceso de diseño y cotización de campañas BPO en Atento presenta los siguientes cuellos de botella:
1. **Lentitud en el ciclo de preventa:** El dimensionamiento operativo y el modelo de costes dependen de complejas hojas de cálculo manuales (Excel con macros Erlang-C), requiriendo iteraciones de varios días entre el KAM, Operaciones (WFM) y el departamento de Pricing.
2. **Incapacidad de cotizar interactivamente en vivo:** Durante las reuniones ejecutivas con prospectos, el KAM no puede ajustar parámetros (ej. "¿qué pasa con el coste si automatizamos el 25% de las llamadas con un Voicebot?") sin detener la reunión y solicitar un re-dimensionamiento.
3. **Disparidad de costes entre geografías y convenios laborales:** Atento opera en múltiples geografías (España, México, Colombia, Brasil, Perú, Chile, EE.UU., etc.), cada una con diferentes convenios laborales, recargos nocturnos/festivos, costes de facilities y esquemas fiscales que complican un cálculo rápido y seguro.
4. **Dificultad para monetizar y visualizar el impacto de la IA:** A los clientes les cuesta visualizar el ROI tangible de sustituir o complementar agentes con agentes virtuales generativos (GenAI) y Voicebots.

### 1.3 Objetivos de Negocio (Business Goals)
* **Reducir el tiempo de generación de propuestas preliminares:** De 3-5 días laborables a **menos de 15 minutos** (incluso en vivo durante la reunión con el cliente).
* **Incrementar el Win Rate comercial en un 18%:** Mediante propuestas visuales, personalizadas y con simulaciones comparativas de escenarios en tiempo real.
* **Aumentar la penetración de soluciones de IA / Automatización en un 35%:** Evidenciando de forma gráfica el ahorro de costes y optimización de FTEs con agentes virtuales.
* **Eliminar errores de cálculo y fuga de márgenes:** Estandarizar fórmulas de WFM (Erlang-C, shrinkage, ocupación) y matrices de costes aprobadas por Finanzas.

---

## 2. Personas y Casos de Uso

| Rol / Persona | Descripción y Contexto | Necesidad Clave en la Herramienta |
| :--- | :--- | :--- |
| **Key Account Manager (KAM)** *(Ej. Carlos, Senior Sales Director)* | Lidera las reuniones de captación y renovación de clientes corporativos (Banca, Telco, Retail, Seguros). | Interfaz visual e intuitiva tipo "wizard" que permita mover sliders de volumen y ver el impacto en FTEs y precio al instante, exportando un deck en 1 clic. |
| **Solution Architect / Preventa BPO** *(Ej. Elena, Solution Designer)* | Modela el detalle técnico de la operación: turnos, perfiles de agentes, niveles de servicio (SLA), canales y arquitectura de bots. | Acceso a parámetros avanzados (AHT, shrinkage por país, concurrencia en chat, curvas intradía, deflection de bots). |
| **Pricing & Finance Manager** *(Ej. Marcos, Head of Financial Planning)* | Valida márgenes brutos, costes laborales cargados (loaded labor rates), costes de licencias CCaaS y ratios de supervisión. | Configuración de tablas de costes por país, reglas de margen mínimo (guardrails) y vista confidencial interna con EBITDA. |
| **Cliente / Stakeholder en reunión** *(Ej. Directora de Experiencia de Cliente de un Banco)* | Espectador durante la demo/reunión comercial en vivo. | Visualización clara de escenarios: "Modelo Tradicional 100% Humano" vs. "Modelo Eficiente Atento con IA Híbrida". |

---

## 3. Alcance Funcional y Módulos del Sistema

```
┌────────────────────────────────────────────────────────────────────────┐
│                      BPO CAMPAIGN BUILDER                              │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ 1. Contexto &     │ 2. Dimensionador  │ 3. Capa de IA &                │
│    Sector         │    Omnicanal      │    Automatización (Bots)       │
│ • País / Mercado  │ • Voz Inbound     │ • IVR / Voicebot Generativo    │
│ • Sector          │ • Outbound        │ • Chatbot FAQ & Transaccional   │
│ • Tipo de Campaña │ • WhatsApp & Chat │ • Copilot Asistente de Agente  │
│ • SLA & Horario   │ • Email / Tickets │ • Deflection & AHT Reduction   │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ 4. Motor de       │ 5. Simulador      │ 6. Generador de Propuesta      │
│    Costes         │    "What-If"      │    & Exportación               │
│ • Coste Laboral   │ • Comparador de   │ • Resumen Ejecutivo Cliente    │
│ • Overhead & IT   │   Escenarios      │ • Desglose Financiero Confid.  │
│ • Modelos Pricing │ • Gráficos ROI    │ • Exportación PDF / Deck       │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

### Módulo 1: Contexto de Campaña y Configuración de Negocio
* **Selección Geográfica (País de Prestación & Delivery Center):**
  * España (Madrid, Barcelona, Sevilla, etc.)
  * México (CDMX, Monterrey)
  * Colombia (Bogotá, Medellín)
  * Brasil (São Paulo, etc.)
  * Perú (Lima)
  * Opción de delivery **Onshore**, **Nearshore** o **Blended / Offshore**.
* **Sector Económico (Templates pre-configurados con KPIs típicos):**
  * *Banca & Fintech:* Alto requerimiento de seguridad, AHT medio-alto (360s), SLA estricto (80/20).
  * *Telecomunicaciones:* Gran volumen, AHT corto (240s), alta rotación/shrinkage.
  * *Retail & E-commerce:* Estacionalidad fuerte (Black Friday/Navidad), multicanal chat/WhatsApp alto.
  * *Salud & Seguros:* Trámites complejos, validación de pólizas, calidad prioritaria.
  * *Utilities (Energía / Agua):* Picos por facturación, resolución en primer contacto (FCR).
* **Tipología de Operación:**
  * Atención al Cliente (Customer Care) / N1 & N2
  * Ventas / Telemarketing (Inbound / Outbound con marcador predictivo)
  * Cobranzas (Early stage / Late stage)
  * Soporte Técnico (Helpdesk / Service Desk)
  * Backoffice & Tramitación Documental
* **Ventana Operativa:** Horario comercial (8x5, 12x6), Extendido (16x7) o Continuo (24x7).

---

### Módulo 2: Motor de Dimensionamiento Omnicanal (Workload & Headcount Engine)
Cálculo en tiempo real del personal operativo necesario (FTEs - *Full Time Equivalents*):

#### A. Canal Voz Inbound
* **Inputs:**
  * Volumen mensual/diario de llamadas recibidas.
  * Distribución horaria (pico vs. valle) o % de llamadas en hora punta.
  * AHT (*Average Handling Time* / TMO) en segundos: tiempo de conversación + retención + ACW (*After Call Work*).
  * Nivel de Servicio deseado (ej. 80% atendidas en menos de 20 segundos).
* **Algoritmo de Cálculo:**
  * Implementación nativa de **Erlang-C** para determinar agentes requeridos en hora punta.
  * Aplicación de **Factor de Ocupación Máxima** (target 80% - 85% para prevenir *burnout*).
  * Aplicación de **Shrinkage Total** (Pérdida de tiempo por pausas, bajas médicas, vacaciones, formación, absentismo) segmentado por país (ej. España ~30-35%, Colombia ~25-28%).
  * Resultado: **Agentes Teóricos vs. Agentes Contratados Requeridos**.

#### B. Canal Voz Outbound
* **Inputs:** Contactos a emitir, tipo de marcador (Predictivo / Progresivo / Preview), tasa de contacto estimada (RPC - *Right Party Contact*), AHT de venta o gestión.
* **Cálculo:** Modelo de capacidad por línea y hora de emisión, con estimación de agentes en ráfaga.

#### C. Canales Digitales Escritos (WhatsApp, Webchat, Mensajería Social)
* **Inputs:** Volumen de conversaciones iniciadas al mes, AHT de resolución, **ratio de concurrencia simultánea** (ej. 1 agente gestiona 2 a 3 chats en paralelo).
* **Cálculo:** Corrección de Erlang para interacciones semi-síncronas o modelo de throughput por hora agente.

#### D. Canal Email / Backoffice / Ticketing Asíncrono
* **Inputs:** Volumen de tickets/correos al mes, tiempo medio de tramitación (Handling Time por ticket), SLA de resolución (ej. < 4 horas o < 24 horas).
* **Cálculo:** Capacidad lineal por hora productiva efectiva de agente backoffice.

---

### Módulo 3: Capa de Automatización y Bots de IA (AI & Deflection Modeler)
Simulación interactiva del impacto de la tecnología conversacional en la operación:

#### A. Tipologías de Automatización
1. **Voicebot / IVR Conversacional (GenAI / NLU):**
   * Automatización de triaje y enrutamiento inteligente.
   * Resolución de consultas transaccionales de voz (ej. consulta de saldo, estado de pedido, bloqueo de tarjeta).
2. **Chatbot / WhatsApp Bot Generativo:**
   * Respuestas contextuales instantáneas basadas en base de conocimiento (RAG).
   * Ejecución de flujos mediante APIs transaccionales.
3. **Agent Copilot (IA Asistente en tiempo real):**
   * Agente humano atendiendo, pero asistido por IA: transcripción en vivo, sugerencia de respuestas y resumen automático de llamada (Auto-ACW).

#### B. Palancas de Simulación (Sliders en Vivo)
* **Tasa de Contención / Deflection Rate (0% - 60%):** % de interacciones resueltas de punta a punta por el bot sin transferir a un agente humano.
* **Reducción de AHT por Copilot (0% - 35%):** Ahorro de tiempo en post-llamada (ACW) y búsqueda de información.
* **Tasa de Abandono y Reintento:** Impacto en la satisfacción percibida del cliente.
* **Cálculo de FTEs Ahorrados:** Reducción neta de posiciones humanas requeridas.
* **Estructura de Costes de la IA:** Coste por interacción/minuto de bot o cuota mensual por bot vs. coste de FTE humano.

---

### Módulo 4: Estructura de Costes y Pricing Dinámico (Financial Engine)

#### A. Estructura de Costes Base (Parametrizable por Finanzas de Atento)
1. **Coste Laboral Directo (Loaded Labor Cost):**
   * Salario base según convenio local de Contact Center.
   * Cargas sociales e impuestos patronales por país.
   * Plus de nocturnidad, festivos, idiomas o perfiles especializados (N2 / Supervisor).
   * Coste de incentivos / comisiones comerciales (si aplica).
2. **Estructura Operativa Indirecta (Ratios):**
   * Supervisores (Ratio estándar: 1 supervisor por cada 12-15 agentes).
   * Calidad / QA (Ratio: 1 analista QA por cada 30-40 agentes).
   * Formadores / Workforce Management (WFM).
   * Coordinador de Servicio / Service Manager.
3. **Infraestructura y Tecnología:**
   * Modalidad: Puesto Físico en Site Atento (Facilities, puesto de trabajo, electricidad, enlace) vs. Teletrabajo (Work from Home - kit de conectividad y equipo).
   * Licenciamiento tecnológico CCaaS (Genesys Cloud, Amazon Connect, Twilio, Nice inContact, Avaya) por agente/mes.
   * Telecomunicaciones (minutos de entrada/salida y numeración).

#### B. Modelos de Tarificación Comercial (Pricing Models para el Cliente)
El KAM puede seleccionar el modelo que mejor se adapte al pliego o preferencia del cliente:
* **Modelo 1: Tarifa por Agente FTE / Mes:** Coste fijo mensual por puesto contratado.
* **Modelo 2: Precio por Hora Logada / Hora Operativa (Per Productive Hour):** Facturación por horas efectivas de servicio.
* **Modelo 3: Precio por Interacción Gestionada (Per Contact):** Tarifa unitaria diferenciada (Coste por llamada atendida, coste por WhatsApp atendido, coste por bot resuelto).
* **Modelo 4: Híbrido con Incentivo por Éxito / SLA:** Fee base + bonus/malus por cumplimiento de NPS, FCR o ventas conseguidas.

#### C. Guardrails Financieros (Control de Márgenes)
* Cálculo automático de:
  * **Margen Bruto (%)**
  * **EBITDA Operativo (%)**
* Sistema de alertas visuales (Semáforo):
  * 🟢 Margen dentro del objetivo comercial (> 18%).
  * 🟡 Margen ajustado (requiere validación de Director Comercial: 12% - 18%).
  * 🔴 Margen inferior al umbral mínimo (< 12%): Bloquea la aprobación sin visto bueno de Dirección Financiera.

---

### Módulo 5: Simulador "What-If" y Comparativa de Escenarios
Permite al KAM mostrar al cliente hasta 3 escenarios en paralelo en una sola pantalla:

| Parámetro | Escenario A: Tradicional (100% Humano) | Escenario B: Híbrido Recomendado (IA + Humano) | Escenario C: Eficiencia Nearshore (Blended) |
| :--- | :--- | :--- | :--- |
| **Ubicación** | Onshore (España) | Onshore (España) | 70% Colombia + 30% España |
| **Volumen Total** | 100.000 interacciones | 100.000 interacciones | 100.000 interacciones |
| **Deflection Bot** | 0% | 30% (30.000 resueltas por bot) | 30% (30.000 resueltas por bot) |
| **FTEs Requeridos** | 52 Agentes | 34 Agentes (-35%) | 34 Agentes (24 Colombia / 10 España) |
| **Coste Mensual** | 135.000 € | 98.500 € | 76.200 € |
| **Ahorro Cliente** | Base (0%) | **-27% Ahorro** | **-43% Ahorro** |
| **SLA Estimado** | 82% en 20s | 94% resolución inmediata (24/7 bot) | 91% en 20s |

* **Gráficos interactivos:**
  * Curva de ramp-up de agentes durante la puesta en marcha (Mes 1 a Mes 6).
  * Distribución de costes (Personal vs. Tecnología vs. Estructura).
  * Gráfico de ROI acumulado a 12, 24 y 36 meses.

---

### Módulo 6: Generador de Propuesta Ejecutiva & Exportación
* **Modo Presentación (Client Mode):**
  * Oculta datos sensibles internos (margen bruto de Atento, salarios desagregados de agentes, ratios de coste de personal).
  * Interfaz limpia y con imagen de marca Atento lista para proyectar.
* **Exportación en 1 Clic:**
  * **Dossier Ejecutivo en PDF:** Documento maquetado profesionalmente con branding corporativo de Atento, incluyendo portada, resumen de la solución, arquitectura omnicanal, dimensionamiento de agentes, matriz de precios y compromisos de SLA.
  * **Ficha Técnica Interna (Excel/PDF Confidencial):** Desglose P&L detallado con costes directos, indirectos, licencias, margen de contribución y EBITDA para comités de aprobación internos.
  * **Enlace Compartible (Shareable Proposal):** Enlace web protegido por contraseña donde el cliente puede consultar la propuesta en formato interactivo.

---

## 4. Requisitos No Funcionales (NFR)

### 4.1 Rendimiento y Reactividad
* **Tiempo de respuesta en cálculos:** El motor de cálculo (Erlang-C + finanzas) debe recalcular el headcount y costes en **menos de 100 ms** ante cualquier cambio en un slider o campo numérico.
* **Carga inicial de la aplicación:** Tiempo inferior a **1.5 segundos**.

### 4.2 Usabilidad y Diseño (UX/UI)
* Diseño optimizado para resoluciones de portátil corporativo (1366x768 a 1920x1080) y tablets (iPad/Surface).
* Sistema de diseño alineado con la identidad corporativa de **Atento** (paleta de colores: azul marino corporativo, cian tecnológico, blanco y acentos de contraste, tipografía clara sans-serif).
* Soporte para modo oscuro / claro conmutable.

### 4.3 Seguridad, Permisos y Roles (RBAC)
* **Autenticación:** Integración con Single Sign-On (SSO) corporativo de Atento (Microsoft Azure AD / Entra ID o Google Workspace).
* **Niveles de Acceso:**
  * *KAM / Comercial:* Diseña campañas, modifica volúmenes y precios dentro del rango de márgenes autorizado. No puede modificar tablas de costes base ni salarios.
  * *Preventa / WFM:* Configura y afina parámetros operativos (shrinkage, AHT, distribuciones Erlang).
  * *Pricing / Finanzas (Admin):* Actualiza salarios por país, cargas impositivas, precios de licencias y define los márgenes mínimos de aprobación.
  * *Solo Lectura / Cliente:* Visualización restringida a la propuesta final en modo cliente.

### 4.4 Integraciones Futuras
* **CRM Salesforce:** Sincronización de propuestas con la Oportunidad de venta correspondiente en Salesforce (Pipeline, importe de ARR/TCV, fecha estimada de cierre).
* **WFM / Herramientas de Planificación:** Exportación de requerimientos de personal para la planificación de selección y formación (HR/Recruitment de Atento).

---

## 5. Arquitectura Técnica Recomendada

* **Frontend:**
  * React 19 / Next.js (App Router) con TypeScript para máxima robustez de tipos.
  * Tailwind CSS + componentes de Radix UI / Shadcn para una interfaz moderna, limpia y accesible.
  * Recharts o Chart.js para gráficos interactivos en tiempo real (distribución de canales, comparativa de escenarios, rampa de FTEs).
* **Lógica de Cálculo (State & Engines):**
  * Motor Erlang-C optimizado ejecutado en el cliente (Browser-side) para respuesta a latencia cero sin saturar llamadas al backend.
  * Store de estado con Zustand o React Context para sincronización instantánea entre módulos.
* **Backend & Almacenamiento (Para persistencia de propuestas):**
  * Node.js / FastAPI en Google Cloud Run o infraestructura serverless.
  * Base de datos PostgreSQL / Cloud SQL para almacenar templates de clientes, propuestas guardadas, histórico de versiones y tablas de costes por país.
* **Generación de Documentos:**
  * Puppeteer / React-PDF para renderizado fiel y estilizado de propuestas en PDF.

---

## 6. Métricas de Éxito del Producto (KPIs)

1. **Eficiencia Comercial:** Reducción del tiempo medio de preparación de una propuesta formal de 4 días a menos de 30 minutos.
2. **Adopción de Usuarios:** > 80% de los KAMs y preventas activos en Atento utilizando la herramienta semanalmente en el primer trimestre tras lanzamiento.
3. **Cross-Selling de IA:** > 40% de las propuestas generadas deben incluir al menos un componente de automatización (Voicebot o Chatbot).
4. **Calidad de Datos:** Disminución a cero de discrepancias entre el pricing cotizado en la propuesta comercial y el coste real de implantación en Operaciones.

---

## 7. Roadmap de Entrega por Fases

### Fase 1: MVP Operativo (4-6 semanas)
* Configuración de campañas para 3 geografías principales (España, México, Colombia).
* Motor de dimensionamiento para Voz Inbound (Erlang-C básico) y WhatsApp/Chat.
* Slider de automatización de bots básica (% de reducción de volumen).
* Estructura de costes estándar por FTE y precio por hora.
* Comparador de 2 escenarios (Humano vs. Híbrido).
* Exportación a PDF con branding de Atento.

### Fase 2: Omnicanalidad Avanzada & Guardrails Financieros (6-8 semanas)
* Incorporación de todas las geografías de Atento (Brasil, Perú, Chile, EE.UU.).
* Canales Outbound con marcador predictivo y Backoffice/Ticketing.
* Módulo avanzado de Agent Copilot (reducción de ACW y AHT).
* Roles RBAC con aprobación de márgenes por Finanzas.
* Exportación de ficha financiera interna confidencial.

### Fase 3: Integración Ecosistema & Copilot Comercial (8+ semanas)
* Conexión bidireccional con Salesforce CRM.
* Generador de texto comercial con IA (redacción automática del resumen ejecutivo y propuesta de valor basada en el sector del cliente).
* Portal cliente interactivo ("Digital Proposal Portal").
