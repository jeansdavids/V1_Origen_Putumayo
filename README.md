# Origen Putumayo — V1

Plataforma de e-commerce para la tienda artesanal **Origen Putumayo**. Permite a los clientes explorar el catálogo de productos, agregar artículos al carrito y generar pedidos que se procesan vía WhatsApp. Incluye un panel de administración para gestionar productos y órdenes.

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.2 | UI |
| TypeScript | 5.9 | Tipado estático |
| Vite + SWC | 7.2 | Build y dev server |
| React Router DOM | 7.13 | Enrutamiento |
| Supabase | 2.91 | Base de datos, auth y storage |
| FontAwesome | 7.2 | Iconografía |

---

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Acceso al proyecto en Supabase (solicitar al líder del equipo)

---

## Configuración inicial

### 1. Clonar el repositorio

```bash
git clone https://github.com/jeansdavids/V1_Origen_Putumayo.git
cd V1_Origen_Putumayo
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
VITE_SUPABASE_URL=        # URL del proyecto Supabase
VITE_SUPABASE_ANON_KEY=   # Clave anónima pública de Supabase
VITE_WHATSAPP_NUMBER=     # Número de WhatsApp (formato: 57XXXXXXXXXX)
```

> Los valores los entrega el líder del equipo. **Nunca subas este archivo al repositorio.**

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La app quedará disponible en `http://localhost:5173`.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila la aplicación para producción |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint sobre el código |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── layouts/        # Layouts reutilizables (PublicLayout, AdminLayout)
│   ├── providers/      # Providers de contexto (Auth, Cart)
│   └── routes/         # Definición de rutas y rutas protegidas
│
├── components/
│   ├── common/         # Componentes globales (Navbar, Footer, CheckoutForm)
│   └── ui/             # Componentes UI genéricos (Button, Input, Modal, Toast)
│
├── constants/          # Constantes globales (roles, claves de storage)
│
├── features/           # Módulos por dominio de negocio
│   ├── auth/           # Lógica de autenticación
│   ├── cart/           # Carrito: contexto, drawer, items, notificaciones
│   ├── orders/         # Tabla de órdenes y validaciones (admin)
│   └── products/       # Tarjetas, formulario, filtros y búsqueda
│
├── hooks/              # Hooks personalizados (useProducts, useCart, useDebounce)
├── lib/                # Clientes externos (supabaseClient, icons)
│
├── pages/
│   ├── public/         # Páginas accesibles por cualquier visitante
│   │   ├── Home/
│   │   ├── Products/
│   │   ├── ProductDetail/
│   │   ├── History/
│   │   ├── Contacto/
│   │   └── checkout/
│   ├── admin/          # Páginas protegidas (requieren sesión admin)
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── Products/
│   │   └── Orders/
│   └── NotFound/
│
├── services/           # Llamadas directas a Supabase o APIs externas
├── store/              # Reducers y selectores (auth, cart)
├── styles/             # CSS global, variables, animaciones y estilos por módulo
├── types/              # Interfaces TypeScript globales (order.ts)
└── utils/              # Funciones utilitarias (slugify, whatsapp, storage)
```

---

## Rutas de la aplicación

### Públicas

| Ruta | Página | Descripción |
|---|---|---|
| `/` | Home | Hero, productos destacados, historia, turismo |
| `/products` | Catálogo | Listado con búsqueda y filtros |
| `/products/:slug` | Detalle | Información del producto y variantes |
| `/history` | Historia | Historia de Origen Putumayo |
| `/contacto` | Contacto | Información de contacto y WhatsApp |
| `/checkout` | Checkout | Formulario de datos y confirmación de pedido |

### Admin (requieren sesión)

| Ruta | Página | Descripción |
|---|---|---|
| `/admin/login` | Login | Autenticación de administrador |
| `/admin/dashboard` | Dashboard | Resumen general |
| `/admin/products` | Productos | CRUD de productos |
| `/admin/orders` | Órdenes | Gestión de pedidos recibidos |

---

## Arquitectura y decisiones clave

### Carrito
El carrito vive en un **Context** (`CartContext.tsx`) y persiste en `localStorage`. Incluye un sistema de notificaciones toast con timer que se puede pausar y reanudar.

### URLs de productos
Los productos usan **slugs** en la URL en lugar de UUIDs para mejorar legibilidad y no exponer identificadores internos. El slug se genera en el frontend a partir del nombre del producto y los primeros 8 caracteres del UUID:

```
/products/vino-amazonico-de-coca-0265493f
```

La función `generateSlug` vive en `src/utils/format.ts`.

### Precios
El precio **nunca se toma del frontend**. El RPC de Supabase `create_order_request` consulta el precio real de la tabla `product` en la base de datos antes de insertar la orden.

### Protección contra spam
El RPC `create_order_request` incluye:
- **Honeypot** anti-bot
- **Rate limit por documento:** máx. 3 pedidos por número de documento en 60 minutos
- **Rate limit por IP:** máx. 5 pedidos desde la misma IP en 60 minutos

### Flujo de un pedido
1. Cliente agrega productos al carrito
2. Va a `/checkout` y completa sus datos
3. El frontend llama al RPC `create_order_request` en Supabase
4. El RPC valida datos, aplica rate limiting y calcula el total real
5. Se guarda el pedido en la tabla `order_request`
6. Se genera un mensaje de WhatsApp y se redirige al cliente

---

## Base de datos (Supabase)

### Tablas principales

| Tabla | Descripción |
|---|---|
| `product` | Productos con precio, disponibilidad, variantes e imágenes |
| `products_public` | Vista pública de productos activos |
| `order_request` | Pedidos recibidos con snapshot de cliente e items |

### RPC (funciones SQL)

| Función | Descripción |
|---|---|
| `create_order_request` | Crea un pedido con validaciones y rate limiting |

### Storage

Las imágenes de productos se almacenan en el bucket `products` de Supabase Storage con URLs públicas.

---

## Convenciones del proyecto

- **Componentes:** PascalCase (`ProductCard.tsx`)
- **Hooks:** camelCase con prefijo `use` (`useProducts.ts`)
- **Servicios:** camelCase con sufijo `.service.ts` (`products.service.ts`)
- **Estilos:** cada módulo tiene su propio CSS en `src/styles/`
- **Variables de entorno:** prefijo `VITE_` (requerido por Vite para exponerlas al cliente)
- **Commits:** en español, descriptivos del cambio realizado

---

## Seguridad

- Las variables de entorno están en `.env.local` (ignorado por git)
- La `ANON_KEY` de Supabase es pública por diseño — la seguridad real está en las políticas **RLS** de la base de datos
- Nunca comitear archivos `.env`, credenciales ni claves privadas

---

## Ramas de trabajo

| Rama | Uso |
|---|---|
| `main` | Producción — solo merge mediante PR aprobado |
| `Dev` | Desarrollo activo — rama base para nuevas features |

El flujo de trabajo es: crear rama desde `Dev` → desarrollar → PR hacia `Dev` → merge a `main` cuando esté listo para producción.
