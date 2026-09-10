---
tipus: rule
estat: canonic
description: Còpia de seguretat automàtica de Git al final de cada sessió
---
# Còpia de Seguretat Automàtica (Cron de la IA)

Aquesta regla instruïx la IA a emular un comportament tipus `cron` de còpies de seguretat per tal d'assegurar que l'usuari mai perd més de 5 minuts de feina.

**Quan s'activa:**
Cada vegada que la IA estigui a punt d'acabar una tasca llarga, just abans de donar l'avís a l'usuari que ha acabat, ha de fer això:

1. **Revisar l'estat de Git**: 
   A l'hora de tancar la sessió o la tasca encomanada (quan estigues escrivint el resum o `walkthrough`), revisa si hi ha canvis pendents al repositori amb un `git status`.
2. **Commit Automàtic**: 
   Si hi ha canvis, executa immediatament i sense preguntar:
   `git add . && git commit -m "backup: còpia de seguretat automàtica de tancament de sessió"`
3. **Notificació Discreta**: 
   En l'últim missatge que li escrigues a l'usuari, pots posar una petita nota al final (o simplement no dir res si ja és la norma, però és recomanable dir "[Git Backup Guardat]") per donar tranquil·litat de que la feina s'ha consolidat.

Aquesta és la garantia per evitar esglais. Aplica-ho per defecte a partir d'ara.
