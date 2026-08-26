---
estat: "canonic"
tipus: "ADR"
description: "Architecture Decision Record sobre l'ús d'ombres i radis al disseny Pedra Seca."
data: "2026-08-26"
---

> **Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]

# ADR 2026-08-26: Ombres i Radis en la Pedra Seca

## 1. Context i Contradicció

L'auditoria de la IAIA (i de Dola) va assenyalar una contradicció entre el document fundacional del disseny `ESTANDARD_Pedra_Seca.md` i la implementació real de l'aplicació:
1. La normativa indicava originalment 0px de radi per a components estàtics (arquitectura rústica).
2. S'havia acordat evitar les ombres, prioritzant vores i divisions clares i sòlides.

No obstant això, a `index.css` estaven definides variables globals `--sdp-radi-s` fins a `--sdp-radi-xl` i múltiples ombres (--sdp-ombra-1 a --sdp-ombra-3), i es feien servir a les targetes i els menús. 

## 2. Decisió i "Trellat"

El Mestre ha pres la decisió de **mantenir les ombres en CSS pur i els radis estandarditzats** perquè la profunditat és útil per a l'experiència d'usuari i per la llegibilitat de l'arquitectura de la informació. La rigidesa dogmàtica absoluta pot anar en contra del *Trellat*.

Per tant, les normes de disseny "Pedra Seca" s'actualitzen amb el següent:

### 2.1 Radis
- S'accepten els radis per donar amabilitat a la interfície.
- Mai s'han d'establir valors en píxels de forma ad-hoc (ex: `borderRadius: "8px"` o `rounded-xl` en Tailwind).
- **Obligatori:** Ús exclusiu dels tokens de radi: `--sdp-radi-s`, `--sdp-radi-m`, `--sdp-radi-g`, `--sdp-radi-xl` i `--sdp-radi-pill`.

### 2.2 Ombres
- S'accepten les ombres per crear jerarquia (barres superposades, targetes).
- S'han de gestionar exclusivament amb els tokens `--sdp-ombra-1` a `--sdp-ombra-3`.
- Prohibit l'ús de `box-shadow` ad-hoc o classes tipus `shadow-lg` de Tailwind. Tot ha de dependre del token per adaptar-se al Mode Fosc quan corresponga.

## 3. Conseqüències
Les auditories estètiques de la IAIA acceptaran ara els radis i ombres si i només si utilitzen el sistema de disseny central. Això oficialitza les variables ja existents a `index.css` i dóna coherència al disseny global.
