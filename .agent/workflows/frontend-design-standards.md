# Sóc de Poble: Frontend Architecture & Design Standards

To ensure consistency and prevent architectural drift, all development must adhere to the following standards.

## 1. Card Header Standard (The "Universal Header")

All content cards (Posts, Market Items, Town Cards, Search Results) MUST use the following structure and styling.

### Visual specs

- **Background**: `var(--bg-warm-card)` (Vibrant Orange).
- **Text Color**: `#000000` (Black) for high contrast.
- **Border**: `2px solid #000000` bottom border.
- **Height**: Minimum `70px`.
- **Vertical Alignment**: Centered content.

### Structure (JSX)

```jsx
<div className="card-header clickable" onClick={handleNavigateToProfile}>
  <div className="header-left">
    <Avatar src={src} role={role} name={name} size={44} />
    <div className="post-meta">
      <div className="post-author-row">
        <span className="post-author">{authorName}</span>
        {/* Optional Badges (e.g., IAIA) */}
      </div>
      <div className="post-town">{townName || "Al teu poble"}</div>
    </div>
  </div>
  <div className="header-right">
    {/* Date, Price, or Nav Icon (e.g., ChevronRight) */}
  </div>
</div>
```

### Behavior

- **Clickable**: The **ENTIRE** header must be a link or trigger navigation to the publisher's public profile/entity page.
- **No Fallbacks to "La Comunitat"**: Always strive to show the publisher's specific town. Use `'Al teu poble'` or similar localized strings if the specific town is missing, but prioritize data-driven town names.

## 2. Avatar System

- Always use the `<Avatar />` component.
- Do not implement custom avatar logic in individual components.
- The component handles roles (user, official, business, group) and provides role-based fallbacks.

## 3. Data Normalization

- Normalization of data (author name, avatar URLs, town names) should happen at the **Service Layer** (`supabaseService.js`).
- Components should receive "clean" data.
- **Fallback Hierarchy for Town**:
  1. `item.towns.name` (Direct join)
  2. `item.town_name` (Snapshot/Denormalized)
  3. `author.town_name` (From publisher's profile)
  4. Localized string like `'Al teu poble'` (General fallback, NEVER 'La Comunitat' unless explicitly requested).

## 4. Protection against regressions

- **CSS Hierarchy**: Standard card styles reside in `index.css` under `.universal-card` and `.card-header`. Component-specific CSS must NOT use `!important` to override these unless absolutely necessary for theme variants.
- **Review before Deleting**: Architectural elements like the `.header-right` container or specific meta rows must not be deleted during UI cleanups.

## 5. The "Escaparate" (Display Window) Pattern

- **Cards are strictly for display**: In feeds/lists, structural cards (`UniversalCard`) act as a storefront window.
- **Accidental Click Prevention**: To prevent erroneous inputs while scrolling on mobile, direct state-changing interactions (like "Liking", "Connecting", or complex tagging) are **STRICTLY PROHIBITED** on the card itself.
- **Navigation over Action**: The primary action button (e.g., "Connectar", heart icon, main image) MUST navigate to the item's dedicated detail page where true interaction takes place. Always ensure every element has a dedicated detail route (`/post/:id`).
- **Allowed Direct Actions**: The only actions permitted directly on the flow of the feed are opening the text entry for Comments, and the Share button. All other actions must bridge to a detail page.
- **Avatar Profile Routing**: Clicking the 'capucha naranja' (Avatar/Header) of any UniversalCard must ALWAYS open the publisher's profile (`/perfil/:id` or `/entitat/:id`).
  - _Exception_: If the card variant is `pobles`, the header click must route to the Town community dashboard (`/pobles/:id`) representing everyone from that town, with the specific author listed secondary.
