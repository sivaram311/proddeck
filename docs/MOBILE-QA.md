# Mobile QA — ProdDeck

Baseline device frame: **Realme P2 Pro** ≈ **360×800** CSS px.

## Checklist

- [ ] First viewport: brand **ProdDeck**, one supporting line, logout, app tiles only  
- [ ] Single column at 360px; optional two columns ≥640px  
- [ ] Touch targets ≥44px (login fields, sign-in, logout, tiles)  
- [ ] No purple-on-white / cream+terracotta / Inter-only  
- [ ] Syne (brand) + DM Sans (body) load  
- [ ] Subtle gradient/grid atmosphere visible (not flat white)  
- [ ] Reduced motion: animations disabled under `prefers-reduced-motion`  
- [ ] External tile opens `baseUrl` in new tab  

## DevTools

Chrome device mode → 360×800 (or custom Realme frame). Keyboard focus should show lime focus ring on tiles.
