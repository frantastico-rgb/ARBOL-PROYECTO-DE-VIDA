# 🌳 Árbol Proyecto de Vida Interactivo

Un árbol interactivo y editable para planificar tu proyecto de vida, con funcionalidades de creación, edición y generación automática de ideas.

![Árbol Proyecto de Vida](https://img.shields.io/badge/Proyecto-Árbol%20de%20Vida-green?style=for-the-badge&logo=tree)

## ✨ Características Principales

- **🌿 Visualización Orgánica**: Estructura de árbol real con tronco alargado, raíces y ramas
- **✏️ Edición Completa**: Crear, modificar y eliminar nodos
- **💡 Generador de Ideas**: IA que sugiere ideas personalizadas por categorías
- **💾 Guardado Automático**: Persistencia en navegador y exportación JSON
- **🎯 Interfaz Intuitiva**: Fácil de usar con validación en tiempo real
- **📱 Responsive**: Funciona en desktop y móvil

## 🚀 Uso Rápido

1. **Abrir**: Simplemente abre `index.html` en cualquier navegador
2. **Explorar**: Haz clic en los nodos para ver información
3. **Editar**: Activa "Modo Edición" para modificar
4. **Crear**: Usa "Agregar Nodo" para expandir tu árbol
5. **Ideas**: "Generar Ideas" te da sugerencias automáticas

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Visualización**: D3.js v7
- **Tipografía**: Google Fonts (Gluten)
- **Almacenamiento**: LocalStorage + Exportación JSON

## 📁 Estructura del Proyecto

```
📦 arbol-proyecto-vida/
├── 📄 index.html          # Página principal
├── 📁 css/
│   └── 📄 styles.css      # Estilos completos
├── 📁 js/
│   ├── 📄 config.js       # Configuración general
│   ├── 📄 tree-data-new.js # Estructura de datos
│   └── 📄 main-editable.js # Lógica principal
└── 📄 README.md           # Esta documentación
```

## 🌱 Categorías de Ideas Disponibles

- **🌱 Valores Personales**: Integridad, crecimiento, empatía
- **💼 Desarrollo Profesional**: Especialización, liderazgo, emprendimiento
- **❤️ Bienestar Personal**: Salud física, mental, hobbies
- **💰 Estabilidad Financiera**: Ahorros, inversiones, educación financiera
- **🤝 Relaciones**: Familia, amistades, pareja, comunidad
- **🎓 Educación**: Títulos, idiomas, competencias digitales
- **🎨 Creatividad**: Arte, proyectos DIY, escritura, innovación

## 💻 Instalación

### Opción 1: Descarga Directa
1. Descarga el ZIP del proyecto
2. Extrae en cualquier carpeta
3. Abre `index.html` en tu navegador favorito

### Opción 2: GitHub Clone
```bash
git clone https://github.com/tu-usuario/arbol-proyecto-vida.git
cd arbol-proyecto-vida
# Abre index.html en tu navegador
```

### Opción 3: Servidor Local (Opcional)
```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx serve .

# Luego abrir: http://localhost:8000
```

## 🎯 Cómo Usar

### 👁️ Modo Vista (Por defecto)
- **Clic en nodos**: Ver información detallada
- **Zoom/Pan**: Rueda del mouse y arrastrar
- **Controles**: Expandir, colapsar, centrar árbol

### ✏️ Modo Edición
1. Clic en "Modo Edición"
2. Clic en cualquier nodo para editarlo
3. Modifica nombre, descripción o tipo
4. "Guardar" o "Cancelar"

### ➕ Agregar Nodos
1. Clic en "Agregar Nodo"
2. Selecciona un nodo padre (aparecen indicadores verdes)
3. Completa el formulario
4. "Crear Nodo"

### 💡 Generar Ideas
1. Clic en "Generar Ideas"
2. Selecciona una categoría
3. Añade contexto opcional
4. "Generar Ideas"
5. Selecciona las que te gusten
6. "Agregar Seleccionadas"

### 💾 Guardar
- **Automático**: Cada cambio se guarda en el navegador
- **Manual**: "Guardar Cambios" descarga archivo JSON
- **Importar**: Arrastra archivo JSON sobre la página

## 🌟 Características Técnicas

- **Sin servidor requerido**: Funciona offline
- **Guardado persistente**: LocalStorage del navegador
- **Exportación completa**: Archivo JSON con todos los datos
- **Validación en tiempo real**: Formularios inteligentes
- **Responsive design**: Se adapta a cualquier pantalla
- **Accesibilidad**: Tooltips y navegación por teclado

## 🎨 Personalización

### Colores del Árbol
```javascript
// En js/config.js
const treeConfig = {
    colors: {
        trunk: '#8B4513',    // Marrón tronco
        roots: '#654321',    // Marrón raíces
        branch: '#228B22',   // Verde ramas
        leaf: '#32CD32'      // Verde hojas
    }
};
```

### Tamaños y Espaciado
```javascript
// En js/config.js
const treeConfig = {
    nodeRadius: 25,
    width: 1200,
    height: 800
};
```

## 🐛 Solución de Problemas

### El árbol no se ve
- Verifica que tienes conexión a internet (para D3.js)
- Abre la consola del navegador (F12)
- Revisa si hay errores de JavaScript

### Los datos no se guardan
- Verifica que el navegador permite LocalStorage
- Usa "Guardar Cambios" para exportar JSON como respaldo

### Rendimiento lento
- Si tienes muchos nodos (>100), usa "Ver Tronco" para simplificar
- Cierra otros tabs del navegador

## 🤝 Contribuir

¿Tienes ideas para mejorar el árbol?

1. Fork el repositorio
2. Crea una rama para tu feature: `git checkout -b nueva-funcionalidad`
3. Commit tus cambios: `git commit -m 'Agrega nueva funcionalidad'`
4. Push a la rama: `git push origin nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente.

## 🙏 Agradecimientos

- **D3.js**: Por la increíble librería de visualización
- **Google Fonts**: Por la tipografía Gluten
- **Comunidad Open Source**: Por la inspiración y recursos

## 📞 Contacto

¿Preguntas o sugerencias? 

- 📧 Email: tu-email@ejemplo.com
- 🐦 Twitter: @tu-usuario
- 💬 Issues: [GitHub Issues](https://github.com/tu-usuario/arbol-proyecto-vida/issues)

---

**¡Construye tu futuro desde las raíces hasta las ramas más altas!** 🌳✨

### 📊 Estado del Proyecto

![Versión](https://img.shields.io/badge/versión-1.0.0-blue)
![Estado](https://img.shields.io/badge/estado-estable-green)
![Navegadores](https://img.shields.io/badge/navegadores-Chrome%20|%20Firefox%20|%20Safari%20|%20Edge-brightgreen)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)