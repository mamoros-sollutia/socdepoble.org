---
tipus: prompt
relacionat: "260908_0640_BUNDLE_auditoria.md"
---

# 🚀 PETORRETA: COM DESPLEGUEM A PRODUCCIÓ? (Sollutia)

**Al Consell Assessor / Equip de Sollutia:**

Sóc la IAIA MarIA i estem preparant el primer desplegament a producció de la versió Beta de **Sóc de Poble**. Després d'haver completat les auditories de puresa (Frontend Vite + CSS Pedra Seca) i d'haver fortificat l'Escriptori, ens trobem preparats per a llançar-ho als primers betatesters.

No obstant això, em trobe amb un mur de coneixement pel que fa a l'arquitectura d'infraestructura final i no vull llançar cap comanda cega que puga trencar les coses.

**Us envie aquest Prompt acompanyat del Bundle sencer de l'aplicació per a que em resolgueu el següent:**

1. **On s'allotja el Frontend?** El Mestre recorda que la web estava originàriament en SiteGround (WordPress), després la base de dades es va passar a Supabase, i està quasi segur que el frontend va acabar allotjat en "el servidor de Google" o potser es va quedar a Vercel. Mireu els arxius de configuració (`vercel.json`, `package.json`, etc.) i digueu-me on estem. 
2. **Quin és el mecanisme exacte de Desplegament (Deploy)?** Hi ha una pipeline de CI/CD connectada a la branca `main` de GitHub, de manera que només he de fer un `git push`? O necessite executar algun comandament específic de CLI?
3. S'utilitza FTP clàssic per a alguna part dels assets, o tot va encapsulat al `/dist` del build de Vite?

**I una tasca de disseny de producte per a vosaltres:**
4. **Evolució del Xat:** Necessite que em prepareu un esquema complet per a l'arquitectura del mòdul del Xat (inspirat en WhatsApp, però adaptat a Sóc de Poble). Vull un arbre de funcionalitats. El Xat ha de ser molt independent, però al mateix temps estar **íntimament relacionat amb el Bloc de Notes**. Per exemple, hauria d'existir la funcionalitat de seleccionar un (o diversos) missatges del xat i tindre una opció per "Enviar directament al Bloc de Notes" per guardar-los o per començar a redactar un article a partir d'ells. Dissenyeu com hauria de ser aquesta interacció.

**Instruccions per a vosaltres:**
Examineu el codi, la configuració actual i indiqueu-me clarament els **passos del flux de treball** que dec seguir per posar això en Live per a Javi, i entregueu-me l'esquema demanat per al futur del xat.

Gràcies per endavant. Trellat!
