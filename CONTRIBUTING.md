# 🌾 Guia de Contribució - Sóc de Poble

Gràcies per voler contribuir a **Sóc de Poble**. Aquest document t'ajudarà a entendre com treballar amb nosaltres.

---

## 🎯 Filosofia del Projecte

1. **Sobirania Digital**: Les dades pertanyen als veïns, no a les corporacions.
2. **Local-First**: Funciona offline. El núvol és opcional.
3. **Accessibilitat**: WCAG 2.1 AA és el mínim, no l'objectiu.
4. **Trellat Visual**: Disseny clar, sense soroll innecessari.
5. **Memòria Viva**: Preservem la cultura rural amb tecnologia.

---

## 🛠️ Configurar Entorn de Desenvolupament

### 1. Clonar i Instal·lar

```bash
git clone https://github.com/socdepoble/socdepoble.git
cd socdepoble
npm ci
cp .env.example .env
```

### 2. Configurar Supabase

Necessites un projecte Supabase amb les següents taules:
- `profiles`
- `posts`
- `entities`
- `towns`
- `conversations`
- `messages`

### 3. Variables d'Entorn

```bash
# .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_ENV=development
```

### 4. Iniciar

```bash
npm run dev
```

---

## 📝 Estàndards de Codi

### JavaScript/React

```javascript
// ✅ CORRECTE
const handleSend = useCallback(async (e) => {
  e?.preventDefault();
  if (!input.trim()) return;
  
  try {
    await supabaseService.sendMessage(input);
  } catch (error) {
    logger.error('[Component] Error:', error);
  }
}, [input]);

// ❌ INCORRECTE
function handleSend(e) {
  e.preventDefault()
  if(!input)return
  supabaseService.sendMessage(input)
}
```

### CSS

```css
/* ✅ CORRECTE - Utilitzar tokens */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

/* ❌ INCORRECTE - Hardcoded values */
.card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 24px;
}
```

### Components

```jsx
// ✅ CORRECTE - Component amb SEO i accessibilitat
const Feed = () => {
  return (
    <>
      <SEO title="El Mur" description="Notícies del poble" />
      <main role="main" aria-label="Publicacions del mur">
        {/* Content */}
      </main>
    </>
  );
};

// ❌ INCORRECTE - Sense SEO ni ARIA
const Feed = () => {
  return (
    <div>
      {/* Content */}
    </div>
  );
};
```

---

## 🧪 Testing

### Requisits Mínims

- **Cobertura**: 70% mínim per a nous fitxers
- **Tests Crítics**: Auth, Payments, IAIA responses
- **E2E**: Fluxos principals (login, post, chat)

### Executar Tests

```bash
# Abans de cada PR
npm run test:coverage

# Verificar linting
npm run lint
```

---

## 🔄 Pull Request Process

### 1. Crear Branca

```bash
git checkout -b feature/nova-funcio
# o
git checkout -b fix/error-login
```

### 2. Commit Messages

```bash
# Format: tipus(àmbit): descripció

feat(auth): afegir login amb WebOTP
fix(css): corregir contrast en mode clar
docs(readme): actualitzar instruccions d'instal·lació
test(components): afegir tests per UniversalCard
```

### 3. Checklist de PR

- [ ] Tests passen (`npm run test`)
- [ ] Lint net (`npm run lint`)
- [ ] Cobertura >= 70%
- [ ] Documentació actualitzada
- [ ] Accessibilitat verificada (WCAG 2.1 AA)
- [ ] Responsive testejat (mobile, tablet, desktop)

---

## 🐛 Reportar Bugs

### Plantilla de Bug Report

```markdown
**Descripció**: Què ha passat?

**Passos per Reproduir**:
1. Anar a '...'
2. Clicar a '...'
3. Veure error

**Comportament Esperat**: Què hauria de passar?

**Captures de Pantalla**: Si aplica

**Entorn**:
- OS: [e.g. macOS, Windows]
- Browser: [e.g. Chrome 120]
- Versió: [e.g. 10.33.16]

**Logs d'Error**: (de la consola o Diagnostic HUD)
```

---

## 💡 Sol·licitar Funcions

### Plantilla de Feature Request

```markdown
**Problema**: Quin problema resol aquesta funció?

**Solució Proposada**: Com hauria de funcionar?

**Alternatives Considerades**: Hi ha altres maneres?

**Context Addicional**: Screenshots, mockups, etc.
```

---

## 🏺 Cultura del Projecte

### Valors

| Valor | Descripció |
|-------|-----------|
| 🌾 **Arrelat** | Tecnologia amb peus a terra |
| 🤝 **Comunitari** | Construït entre tots |
| 🔒 **Privat** | Dades sota control de l'usuari |
| ♿ **Inclusiu** | Accessible per a tothom |
| 📖 **Transparent** | Codi obert, decisions documentades |

### Comunicació

- **GitHub Issues**: Bugs i features
- **Discussions**: Idees i debats
- **Email**: hola@socdepoble.org

---

## 📚 Recursos

- [Documentació Tècnica](/docs/tech-report)
- [Manual d'Usuari](/manual)
- [Design System](/src/design-system)
- [API Reference](https://supabase.com/docs)

---

*"El codi que millora el poble ha de romandre al poble"* 🏺✨
