# Brief : vidéo motion design typographique « Rythme » (Brahim Design 221)

Réponds en français. Style éditorial typographique, 9:16, 1080x1920, 30 i/s, environ 15 s.
Compétence à utiliser : motion-typo-editorial.

## Script (option B : pas de voix, texte animé + musique)
1. 3 secondes pour accrocher.
2. 1 mot par image.
3. Zéro remplissage.
4. Garde le rythme.
Carte finale : BRAHIM DESIGN 221 (police fine, centrée, sur noir).

Script à enregistrer plus tard par l'utilisateur (téléphone ou app Motion, en français) :
« 3 secondes pour accrocher. 1 mot par image. Zéro remplissage. Garde le rythme. »

## Règles de style
- Fonds qui alternent : gris clair (229,223,226) et noir pur. Coupes sèches, pas de fondu.
- Un seul accent : rouge (208,15,18) en cercle, rectangle, cadre fin ou anneau en pointillés. Pas de néon, de lueur, de dégradé ni de violet/cyan.
- Texte : Inter Display Bold, interlettrage négatif (-3 à -5 %), dessiné lettre par lettre. Petite ligne légère au-dessus, grosse ligne en gras dessous. Mot géant gris à 30-40 % d'opacité, coupé par les bords, derrière le sujet.
- Calques : fond, forme rouge, texte arrière, sujet, texte avant.
- Sujets : silhouettes et formes originales dessinées en code (pas de photo, pas de personnage protégé, pas d'interface TikTok).
- Détails minuscules (10 à 14 px) : codes-barres, QR, étiquettes, flèches, traits de cadre.
- Mouvements : pop avec dépassement (ease_out_back), glissement court, flou de mouvement (18 px à 0 sur 6 images), push-in 100 à 108 %, formes révélées par masque, grain fixe (amplitude 4 à 6 sur fond clair).
- Les mots apparaissent un par un.

## Storyboard proposé
| Plan | Temps | Fond | Contenu | Mouvement |
|---|---|---|---|---|
| 1 | 0,0 à 2,2 s | gris clair | petit « 3 secondes » + gros « pour accrocher. » ; grand cercle rouge derrière | pop, flou, push-in |
| 2 | 2,2 à 5,0 s | noir | « 1 mot » / « par image. » ; mot géant fantôme « MOT » ; cadre fin rouge | mots un par un, glissement |
| 3 | 5,0 à 8,1 s | gris clair | « Zéro » + « remplissage. » ; rectangle rouge révélé par masque ; silhouette originale | révélation par masque |
| 4 | 8,1 à 12,4 s | noir | « Garde » / « le rythme. » ; anneau en pointillés rouge ; barres de rythme | pop + push-in |
| 5 | 12,4 à 15,0 s | noir | carte finale « BRAHIM DESIGN 221 » en police fine | apparition simple |

## Zones sûres
Libres : 250 px en haut, 380 px en bas, 140 px à droite. Texte principal entre y=450 et y=1450. Aucun texte plus large que 1000 px. Le mot fantôme peut déborder.

## Audio (sans voix)
FFmpeg ne génère pas de voix. Musique simple générée avec aevalsrc/sine (battement régulier, volume modéré), AAC.

## Rendu
- Pré-rendre chaque élément en RGBA, puis par image : alpha, décalage y, alpha_composite.
- Tube rawvideo vers FFmpeg : -f rawvideo -pix_fmt rgb24 -s 1080x1920 -r 30 -i - -i audio.m4a -map 0:v -map 1:a -c:v libx264 -crf 18 -preset veryfast -pix_fmt yuv420p -c:a aac -t 15 -movflags +faststart sortie.tmp.mp4, puis renommer en .mp4 si le code de sortie est 0.
- Avant le rendu : dessiner 5 ou 6 images clés, les regarder, vérifier lisibilité et zones interdites.
- Après : ffprobe (15 s, 1080x1920, h264/aac) et extraire une image de la vidéo finale.

## Ce qui manque à la livraison
La voix (à ajouter par l'utilisateur) et d'éventuelles images détourées. Ne rien inventer de factuel.
