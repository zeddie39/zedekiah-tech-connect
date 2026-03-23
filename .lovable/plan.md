

## Plan: Page Transitions, Hero Background, Shop Design Polish, and Security Fixes

### 1. Security Fixes (Error-level only)

Two error-level findings remain:

**A. M-Pesa STK Push endpoint has no authentication**
- Edit `supabase/functions/mpesa-stk/index.ts` to verify the JWT `Authorization` header using `supabase.auth.getUser()` before processing. Reject unauthenticated requests with 401.

**B. Message Replies publicly exposed (read and insert)**
- Create a Supabase migration to drop the two overly permissive policies:
  - `DROP POLICY "Admins can insert message replies" ON public.message_replies;`
  - `DROP POLICY "Admins can read message replies" ON public.message_replies;`
- The remaining role-checked policies already provide correct access.

---

### 2. Smooth Page Transitions

The project already has `framer-motion` installed and a `PageTransition` component, but it is **not used** in `App.tsx`.

- Wrap the `<Routes>` block in `App.tsx` with the `PageTransition` component so every route change gets a smooth animated transition.
- Fix the `PageTransition` component to add TypeScript typing (`children: React.ReactNode`).

---

### 3. Landing Page Hero Background Photo

Currently the Hero uses a CSS gradient pattern (`hero-pattern`). Will enhance it with a real motherboard/circuit board background image behind the gradient overlay for a premium tech feel.

- Update `Hero.tsx` to add an `<img>` tag with a motherboard photo (Unsplash) as an absolute background, with the existing gradient overlay on top to maintain text readability.

---

### 4. Shop Page Design Polish

The Shop page already has a good structure. Will improve:

- **ShopHeroCarousel**: Already has a motherboard background -- will keep as-is.
- **Product cards**: Add subtle entrance animations using framer-motion `motion.div` with staggered fade-in as products appear in the grid.
- **Overall spacing and polish**: Add a footer or "back to top" feel, ensure consistent card hover effects.

---

### Technical Details

**Files to modify:**
- `supabase/functions/mpesa-stk/index.ts` -- add JWT auth check
- New migration SQL -- drop 2 permissive message_replies policies
- `src/App.tsx` -- wrap Routes with PageTransition
- `src/components/PageTransition.tsx` -- add TypeScript prop type
- `src/components/Hero.tsx` -- add background motherboard image
- `src/pages/Shop.tsx` -- add framer-motion staggered product card animations

**No new dependencies needed** -- framer-motion is already installed.

