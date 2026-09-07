---
tipus: estudi_ia
estat: actiu
description: Anàlisi de la resposta de Codex sobre orfes i identitats
---

# 🧠 ESTUDI DE IA: Resposta de Codex

**IA Auditada:** Codex
**Font:** Resposta a la Petorreta `260906_1942_BUNDLE_base_dades_empresa_usuari.md`
**Tema:** Neteja de perfils zombis i Arquitectura d'Identitats (Persona vs. Entitat)

## 1. Avaluació de la Neteja SQL (Orfes)

Codex ha dissenyat un escut PL/pgSQL defensiu (SDP-LOCK) impressionant. 

- **El Gran Descobriment:** Codex assenyala que tot i que el nostre arxiu `schema.sql` teòricament posa `ON DELETE CASCADE` en la relació de `profiles` amb `auth.users`, **en la BBDD real eixa cascada devia fallar o estar desactivada quan vas esborrar els usuaris des del panell d'Auth**. Per això van quedar penjats a `profiles`!
- **Protecció Quirúrgica:** Ens prohibix llançar un simple `DELETE WHERE username IS NULL` perquè un usuari real podria tindre eixe camp buit per accident. Exigix traure primer els 3 UUIDs orfes (Bloc A) i posar-los en un bloqueig de transacció (Bloc B) per matar exactament els que toquen, comprovant que no tinguen dependències que trenquen res en cascada. Brillant.

## 2. Avaluació del Model d'Identitats (Arquitectura BBDD)

Codex resol el problema de "moure dades entre el teu compte personal i l'empresa" amb una proposta sòlida:
- Tota dada (ex: una nota) tindrà només **UN** amo. O té un `owner_profile_id` (Persona) o un `owner_organization_id` (Empresa/Grup). S'ha d'evitar el Frankenstein de dades barrejades.
- Per a moure eixa dada d'un amo a l'altre, NO farem un `UPDATE` ràpid de Javascript. Crearem una Funció RPC (ex: `transfer_note()`) dins de PostgreSQL que verificarà que tens permisos per a moure eixa dada abans de canviar-li l'amo. Això garanteix seguretat absoluta.

## 3. Descomposició de React (El Gran AppDataContext)

Açò és or pur per a la refacció que havíem de fer hui. La seua recepta per trossejar l'enorme `AppDataContext.jsx` assegura una màquina indestructible:
1. `AuthContext`: Només gestiona si hi ha una sessió vàlida viva (token).
2. `TenantContext`: Gestiona exclusivament de quin poble estem traient les dades (Sollutia/Torre).
3. `ProfileContext`: Gestiona la identitat base (La teua Persona, el teu correu).
4. `OrganizationsContext`: Llista les empreses i associacions on participes.
5. **`ActiveIdentityContext`**: (La novetat estrella). L'interruptor de "Actuar com a". Gestiona si ara mateix estàs interactuant amb el sistema com a Persona o com a Empresa. Tota l'App reaccionarà a este context sense haver de recarregar el perfil.

## 4. Veredicte Final i Passos a Seguir

El diagnòstic de Codex està totalment en línia amb la filosofia *Pedra Seca* de Sóc de Poble: modularitat, seguretat i sense dependències externes estranyes. Li atorguem el segell de Trellat.

**El nostre Pla d'Acció derivat d'este Estudi hauria de ser:**
1. **Acció Humana (Mestre):** Vas al panell SQL de Supabase i llances l'script defensiu de Codex (només el BLOC A per traure els UUIDs, i després el BLOC B per rematar).
2. **Acció IA (IAIA):** Mentrestant, puc preparar el Pla d'Implementació (*Implementation Plan*) per començar a trossejar l'actual `AppDataContext.jsx` en estos 5 sub-contextos que Codex ha estructurat de forma tan nítida.
