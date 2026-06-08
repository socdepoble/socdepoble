# 📋 `component-contracts.md` — Contractes de Components "Pedra Seca"

**Versió:** 1.0.0 | **Esquadró B** | **Líder Redactor:** Qwen | **Contribucions:** Copilot (GPU/Debounce), Gemini (iOS14/100dvh)

---

## 🎯 Propòsit d'Aquest Document

Aquest manuscrit defineix els **contractes inquebrantables** dels components atòmics del Sistema de Disseny Pedra Seca. Cada component té una frontera clara: què rep, què emet, què renderitza i, sobretot, **què li està prohibit fer**.

Cap component d'aquesta llista pot evolucionar sense una revisió d'aquest contracte. Si trenques el contracte, trenques l'iPad A10.

---

## 🏛️ Lleis Transversals (Aplicables a Tots els Components)

1.  **Puresa de Dades:** Cap component visual pot importar `supabaseClient`, `idb-keyval`, `yjs` o qualsevol hook que accedisca a fonts de dades. Tota dada arriba via `props`.
2.  **Zero Reflows Síncrons:** Prohibit usar `getComputedStyle`, `offsetHeight`, `getBoundingClientRect` dins de `useEffect` o renders. Si necessites mètriques, usa `ResizeObserver` o `IntersectionObserver` amb `requestAnimationFrame`.
3.  **Acceleració GPU:** Els elements que reben interacció tàctil (`active:scale-*`) han de portar `transform: translateZ(0)` o `will-change: transform` per forçar la composició per GPU.
4.  **Mode Lupa:** Tots els textos base han d'usar `font-size: calc(16px * var(--lupa-scale, 1))` en lloc de `rem` o `text-base` de Tailwind, per garantir que l'escalat siga predictible i no trenque el layout.
5.  **Safe Areas:** Qualsevol element fixat a la vora inferior (inputs de xat, botons flotants) ha d'incloure `padding-bottom: env(safe-area-inset-bottom)`.

---

## 🪨 1. `ButtonTrellat`

### Descripció
Botó d'acció principal i secundària. Dissenyat per ser polsat amb el dit polze sota el sol, amb feedback tàctil immediat i sense ombres que saturen la GPU.

### Contracte de Props (TypeScript)

```typescript
interface ButtonTrellatProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'md' | 'lg'; // md: 48px altura, lg: 56px altura
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode; // Només SVGs amb pointer-events-none
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
}
```

### Implementació de Referència

```jsx
import { memo } from 'react';

const ButtonTrellat = memo(({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  onClick,
  children,
  className = ''
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wide " +
    "transition-all duration-150 ease-out select-none " +
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--sp-accent-primary)]/50 " +
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 " +
    "active:scale-95 active:translate-z-0 " + // translateZ(0) for GPU acceleration
    "touch-manipulation"; // touch-action: manipulation

  const sizeClasses = {
    md: "min-h-[48px] px-6 py-3 text-base rounded-full",
    lg: "min-h-[56px] px-8 py-4 text-lg rounded-full"
  };

  const variantClasses = {
    primary: "bg-[var(--sp-accent-primary)] text-white border-2 border-black/10 " +
             "hover:bg-[var(--sp-accent-hover)] active:bg-[var(--sp-accent-hover)]",
    secondary: "bg-[var(--sp-bg-panel)] text-[var(--sp-text-main)] border-2 border-[var(--sp-border)] " +
               "hover:bg-black/5 active:bg-black/10",
    ghost: "bg-transparent text-[var(--sp-text-main)] border-2 border-transparent " +
           "hover:bg-black/5 active:bg-black/10",
    danger: "bg-[var(--sp-error)] text-white border-2 border-black/10 " +
            "hover:bg-red-700 active:bg-red-800"
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={{ transform: 'translateZ(0)' }} // Força GPU layer
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" style={{ pointerEvents: 'none' }}>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon && iconPosition === 'left' ? (
        <span style={{ pointerEvents: 'none' }}>{icon}</span>
      ) : null}
      
      <span className="font-[var(--sp-font-base)]">{children}</span>
      
      {icon && iconPosition === 'right' && !loading && (
        <span style={{ pointerEvents: 'none' }}>{icon}</span>
      )}
    </button>
  );
});

ButtonTrellat.displayName = 'ButtonTrellat';
export default ButtonTrellat;
```

### Què NO pot fer `ButtonTrellat`
- ❌ No pot contenir lògica de navegació (ni `useNavigate`, ni `<Link>`).
- ❌ No pot tenir `box-shadow` amb difuminació superior a `4px`.
- ❌ No pot usar `backdrop-blur` en cap estat (`hover`, `active`, `focus`).
- ❌ No pot canviar de mida dinàmicament (prohibit animar `width` o `height`).

---

## 📝 2. `BancalInput`

### Descripció
Camp de text optimitzat per a formularis. La seva característica crítica és que **mai provoca auto-zoom a iOS** gràcies al `font-size: 16px` mínim, i sobreviu al teclat virtual gràcies a `100dvh` i `flex-1 min-h-0` en el contenidor pare.

### Contracte de Props (TypeScript)

```typescript
interface BancalInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'search';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}
```

### Implementació de Referència

```jsx
import { memo, useId } from 'react';

const BancalInput = memo(({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  helperText,
  disabled = false,
  required = false,
  placeholder,
  icon,
  className = ''
}) => {
  const id = useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className={`w-full ${className}`}>
      <label 
        htmlFor={id}
        className="block text-sm font-bold uppercase tracking-wider text-[var(--sp-text-muted)] mb-2"
        style={{ fontSize: 'calc(14px * var(--lupa-scale, 1))' }}
      >
        {label}
        {required && <span className="text-[var(--sp-error)] ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sp-text-muted)]"
            style={{ pointerEvents: 'none' }}
          >
            {icon}
          </div>
        )}

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`
            w-full min-h-[48px] px-4 py-3 bg-[var(--sp-bg-panel)] 
            border-2 rounded-xl outline-none transition-all
            touch-manipulation
            ${icon ? 'pl-12' : ''}
            ${error 
              ? 'border-[var(--sp-error)] focus:border-[var(--sp-error)] focus:ring-2 focus:ring-[var(--sp-error)]/20' 
              : 'border-[var(--sp-border)] focus:border-[var(--sp-accent-primary)] focus:ring-2 focus:ring-[var(--sp-accent-primary)]/20'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          style={{
            fontSize: 'calc(16px * var(--lupa-scale, 1))', // Mínim 16px per evitar auto-zoom iOS
            WebkitTextSizeAdjust: '100%',
            textSizeAdjust: '100%'
          }}
        />
      </div>

      {error && (
        <p id={errorId} className="mt-2 text-sm text-[var(--sp-error)] font-medium" role="alert">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p id={helperId} className="mt-2 text-sm text-[var(--sp-text-muted)]">
          {helperText}
        </p>
      )}
    </div>
  );
});

BancalInput.displayName = 'BancalInput';
export default BancalInput;
```

### Què NO pot fer `BancalInput`
- ❌ No pot tenir `font-size` inferior a `16px` (encara que sigui per disseny).
- ❌ No pot usar `backdrop-blur` en el contenidor ni en estats de focus.
- ❌ No pot validar dades internament (la validació ve de fora via `error` prop).
- ❌ No pot accedir a `localStorage` o `sessionStorage` directament.

---

## 💬 3. `PedraMissatge`

### Descripció
Bafarada de xat optimitzada per a llistes virtualitzades. Usa `border-radius` natiu (sense `::after` ni `::before` per a fletxes) i està dissenyada per a ser renderitzada dins d'un contenidor amb `content-visibility: auto` i `contain-intrinsic-size`.

### Contracte de Props (TypeScript)

```typescript
interface PedraMissatgeProps {
  text: string;
  timestamp: string; // Format "HH:MM"
  isMine: boolean;
  status?: 'sending' | 'sent' | 'error';
  avatar?: string; // URL de l'avatar (opcional)
  className?: string;
}
```

### Implementació de Referència

```jsx
import { memo } from 'react';

const PedraMissatge = memo(({
  text,
  timestamp,
  isMine,
  status = 'sent',
  avatar,
  className = ''
}) => {
  const statusIcon = {
    sending: '⏳',
    sent: '✓',
    error: '⚠️'
  };

  return (
    <div 
      className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'} ${className}`}
      style={{
        containIntrinsicSize: 'auto 80px', // Per a content-visibility: auto
        contentVisibility: 'auto'
      }}
    >
      {!isMine && avatar && (
        <img 
          src={avatar} 
          alt="" 
          className="w-10 h-10 rounded-full mr-2 self-end mb-6 object-cover"
          loading="lazy"
          decoding="async"
        />
      )}

      <div 
        className={`
          max-w-[min(80%,42rem)] px-5 py-3 shadow-sm
          break-words
          ${isMine 
            ? 'bg-[var(--sp-accent-primary)] text-white rounded-[24px] rounded-br-lg' 
            : 'bg-[var(--sp-bg-panel)] text-[var(--sp-text-main)] border border-[var(--sp-border)] rounded-[24px] rounded-bl-lg'
          }
        `}
        style={{ wordBreak: 'break-word' }}
      >
        <p 
          className="m-0 leading-relaxed"
          style={{ fontSize: 'calc(18px * var(--lupa-scale, 1))' }}
        >
          {text}
        </p>
        
        <div className={`flex items-center gap-2 mt-1 text-xs ${isMine ? 'justify-end' : 'justify-start'}`}>
          <span className={isMine ? 'text-white/70' : 'text-[var(--sp-text-muted)]'}>
            {timestamp}
          </span>
          {isMine && status !== 'sent' && (
            <span className="text-white/70" aria-label={`Estat: ${status}`}>
              {statusIcon[status]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

PedraMissatge.displayName = 'PedraMissatge';
export default PedraMissatge;
```

### Contenidor Pare (Llista de Missatges)

```jsx
<main 
  className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar"
  style={{
    contentVisibility: 'auto',
    containIntrinsicSize: 'auto 500px'
  }}
>
  <div className="space-y-4"> {/* Usa gap, NO margins individuals */}
    {missatges.map(msg => (
      <PedraMissatge key={msg.id} {...msg} />
    ))}
  </div>
</main>
```

### Què NO pot fer `PedraMissatge`
- ❌ No pot usar `::after` o `::before` per a fletxes de bafarada (prohibit per rendiment).
- ❌ No pot tenir `margin-bottom` individual (el contenidor pare ha d'usar `gap`).
- ❌ No pot accedir a la llista completa de missatges (només rep el seu propi contingut).
- ❌ No pot animar la seva aparició (prohibit `animate-in` o `fade-in` en llistes llargues).

---

## 🚨 4. `AlertTrellat`

### Descripció
Notificació d'estat o error. Dissenyada per a ser llegida ràpidament sota el sol, amb contrast AAA per al text i accent d'identitat per a la vora lateral.

### Contracte de Props (TypeScript)

```typescript
interface AlertTrellatProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}
```

### Implementació de Referència

```jsx
import { memo } from 'react';
import { X } from 'lucide-react';

const AlertTrellat = memo(({
  variant = 'info',
  title,
  description,
  onClose,
  className = ''
}) => {
  const variantClasses = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-900 dark:text-blue-100',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-900 dark:text-green-100',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-500 text-amber-900 dark:text-amber-100',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-100'
  };

  return (
    <div 
      className={`
        w-full max-w-[70ch] p-4 border-l-4 rounded-r-lg
        flex items-start gap-3
        ${variantClasses[variant]}
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-1">
        <p className="font-bold text-base m-0">{title}</p>
        {description && (
          <p className="text-sm mt-1 m-0 opacity-90">{description}</p>
        )}
      </div>
      
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
          aria-label="Tancar alerta"
        >
          <X className="w-5 h-5" style={{ pointerEvents: 'none' }} />
        </button>
      )}
    </div>
  );
});

AlertTrellat.displayName = 'AlertTrellat';
export default AlertTrellat;
```

### Què NO pot fer `AlertTrellat`
- ❌ No pot usar `backdrop-blur` en cap cas.
- ❌ No pot tenir `max-width` superior a `70ch` (llegibilitat).
- ❌ No pot auto-ocultar-se sense una acció de l'usuari (prohibit `setTimeout` per tancar).

---

## 🚫 LLISTA NEGRA D'ANTIPATRONS (Prohibicions Globals)

Aquests patrons estan **estrictament prohibits** en qualsevol component que forme part del Sistema Pedra Seca. Si els detectes en una PR, has de rebutjar-la.

### 🚫 Prohibicions de Rendiment (iPad A10)
1.  **`backdrop-filter: blur()`** — En qualsevol element, en qualsevol estat.
2.  **`box-shadow` amb difuminació > 10px** — Prohibit `shadow-2xl`, `shadow-[0_20px_50px_...]`.
3.  **Animar propietats de layout** — Prohibit animar `width`, `height`, `top`, `left`, `margin`, `padding`. Només `transform` i `opacity`.
4.  **`getComputedStyle` en renders** — Prohibit dins de `useEffect` o funcions de render.
5.  **`::after` / `::before` per a fletxes** — Prohibit en bafarades de xat o tooltips.
6.  **Lectura directa del viewport** — Prohibit usar `window.innerWidth`, `window.innerHeight` o `clientWidth` dins de components visuals per a calcular distribucions. Tota adaptació ha de ser purament CSS.

### 🚫 Prohibicions d'Arquitectura
1.  **Accés directe a dades** — Cap component visual pot importar `supabaseClient`, `idb-keyval`, `yjs`.
2.  **Validació interna** — Cap input pot validar dades per si mateix (la validació ve de fora).
3.  **Navegació interna** — Cap botó pot contenir lògica de `useNavigate` o `<Link>`.
4.  **Estat global en components atòmics** — Prohibit usar Context API o Redux dins d'un component atòmic.

### 🚫 Prohibicions d'Accessibilitat
1.  **Eliminar `outline` sense substitut** — Prohibit `outline-none` sense `focus-visible:ring-*`.
2.  **`font-size` < 16px en inputs** — Prohibit per evitar auto-zoom iOS.
3.  **Àrees de toc < 48px** — Prohibit per a qualsevol element interactiu.
4.  **Imatges sense `alt`** — Prohibit (encara que sigui `alt=""` per a decoratives).

---

## 🔄 Integració amb Mode Lupa

Tots els components que usen `font-size` han de seguir aquest patró:

```css
/* ✅ CORRECTE */
font-size: calc(16px * var(--lupa-scale, 1));

/* ❌ INCORRECTE */
font-size: 1rem; /* Es veurà afectat per canvis a :root */
@apply text-base; /* Tailwind no respecta --lupa-scale */
```

El Mode Lupa només modifica `--lupa-scale` a l'arrel. Els components que usen `calc(16px * var(--lupa-scale, 1))` s'escalaran predictiblement sense trencar el layout.

---

## 📱 Integració amb iOS 14/15 i 100dvh

### Inputs i Teclat Virtual
Quan un `BancalInput` està fixat a la part inferior (com al xat), el contenidor pare ha de:

```jsx
<footer 
  className="fixed bottom-0 left-0 right-0 bg-[var(--sp-bg-panel)] border-t border-[var(--sp-border)] p-4"
  style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
>
  <BancalInput {...props} />
</footer>
```

### Contenidor de Xat
El contenidor principal del xat ha d'usar `100dvh` i `flex-1 min-h-0`:

```jsx
<div className="flex flex-col h-[100dvh]">
  <header className="shrink-0">...</header>
  <main className="flex-1 min-h-0 overflow-y-auto">...</main>
  <footer className="shrink-0">...</footer>
</div>
```

Això garanteix que el teclat virtual d'iOS no trenque el layout ni oculte l'input.

---

## ✅ CHECKLIST D'AUDITORIA PER A PRs

Abans de fusionar qualsevol component nou o modificat, verifica:

- [ ] No usa `backdrop-blur` en cap lloc.
- [ ] No usa `box-shadow` amb difuminació > 10px.
- [ ] Tots els SVGs interns tenen `pointer-events: none`.
- [ ] Els inputs tenen `font-size: calc(16px * var(--lupa-scale, 1))` mínim.
- [ ] Els botons tenen `min-h-[48px]` o `min-h-[56px]`.
- [ ] No hi ha `getComputedStyle` en `useEffect` o renders.
- [ ] No hi ha accés directe a `supabaseClient`, `idb-keyval` o `yjs`.
- [ ] Tots els elements interactius tenen `focus-visible:ring-*`.
- [ ] Les imatges tenen `alt` (encara que sigui buit per a decoratives).
- [ ] Els elements fixats a la vora inferior usen `env(safe-area-inset-bottom)`.
- [ ] Les llistes virtualitzades usen `gap` en lloc de margins individuals.
- [ ] Les bafarades de xat usen `contain-intrinsic-size: auto 80px`.

---

**Fi del Document `component-contracts.md`**

Aquest document és la llei. Qualsevol desviació requereix una justificació tècnica per escrit i l'aprovació de l'Esquadró B complet.
