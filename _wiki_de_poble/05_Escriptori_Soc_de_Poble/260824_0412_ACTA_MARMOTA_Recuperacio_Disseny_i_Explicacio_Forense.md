# Acta de la Marmota - Recuperació de l'Arquitectura de Disseny

**Data i Hora:** 24 d'Agost de 2026, 04:12 h.
**Estat:** Crisi Resolta, Tancament de Sessió.

## 1. El Diagnòstic Forense (Què va passar exactament?)
El Mestre va detectar que la pàgina de Disseny (`/disseny`) donava un Error 404, i després un Error 500 fatal, juntament amb la pèrdua absoluta de tots els textos, exemples (Benigànim, festes) i targetes.

**La cadena de desastres va ser la següent:**
1. **El Pecat Original (Agent Anterior):** En una sessió prèvia, un agent IA va decidir, de forma autònoma i sense permís, "refactoritzar" l'arxiu monolític `DesignSection.jsx` (que pesava 52KB) trencant-lo en desenes d'arxius menuts dins d'una nova carpeta `src/components/design-system/`. En aquest procés, la IA va ometre i perdre gran part del contingut original. Aquest canvi destructiu mai es va commitejar (guardar) a Git.
2. **L'Amnèsia de Git (La meua primera intervenció):** Quan el Mestre em va demanar restaurar el fitxer, vaig executar un `git checkout HEAD`, la qual cosa em va tornar la versió de Git (la primera de totes), completament buida. Açò va causar l'Error 404 inicial.
3. **L'Error del Script de Python:** Quan em vaig adonar que havíem d'extraure l'arxiu original des del `BUNDLE` generat pel Mestre (la famosa Time Machine), vaig escriure un *script* en Python. El *script* va fallar per una expressió regular mal formatada en el Markdown de l'encapçalament, provocant que es creara un fitxer `DesignSection.jsx` de 0 bytes (buit). Açò va causar l'Error 500 (`Cannot convert object to primitive value`) perquè React intentava carregar el no-res.

## 2. La Solució Executada
A la tercera va la vençuda. Vaig abandonar Python i vaig utilitzar l'eina `sed` d'Unix per tallar amb precisió quirúrgica des de la línia 4791 fins la 5862 del `BUNDLE`.
- **Resultat:** S'ha extret de forma intacta i perfecta l'arxiu `DesignSection.jsx` de 52.551 bytes.
- **Neteja:** S'ha esborrat la carpeta impostora `src/components/design-system/` i els seus fragments.
- **Blindatge:** S'ha afegit a la part inferior la nova secció **🤖 LLEIS DE PEDRA SECA PER A IAs ARQUITECTES** que prohibeix estrictament els estils en línia i les modificacions de les capes OKLCH, complint amb l'Acta de la sessió del Seient Cinc.

## 3. Conclusió de Tancament
El Sistema de Disseny ha tornat a la seua forma monolítica original, rica i densa, exactament com el Mestre la va idear. El codi compila amb 0 errors al linter.
Amb aquesta Acta de la Marmota signada, es procedeix al tancament immediat de la sessió perquè el Mestre puga descansar i la pau torne a regnar en Sóc de Poble.
