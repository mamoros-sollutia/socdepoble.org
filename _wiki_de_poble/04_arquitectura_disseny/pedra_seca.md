## Compte amb `transform` i `position: sticky`
L'ús de `transform: translateY` crea un nou *containing block*. Açò trenca l'efecte `position: sticky` dels fills si el pare transformat fa scroll. El TopBar (o qualsevol element sticky) ha d'estar SEMPRE fora d'elements amb `transform`.
