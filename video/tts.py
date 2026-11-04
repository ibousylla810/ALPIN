import certifi; certifi.where=lambda:'/root/.ccr/ca-bundle.crt'
import asyncio, edge_tts, json, subprocess, sys
VOICE=sys.argv[1] if len(sys.argv)>1 else 'fr-FR-VivienneMultilingualNeural'
RATE=sys.argv[2] if len(sys.argv)>2 else '+0%'
LINES={
 's1':"Votre allié logistique, c'est Paps.",
 's2':"Un seul interlocuteur, de bout en bout. Au Sénégal, en Côte d'Ivoire et au Bénin.",
 's3':"Messagerie, mise à disposition, tournées régulières, Paps Easy Colis pour les e-commerçants. Toute votre chaîne logistique, de l'approvisionnement jusqu'au dernier kilomètre.",
 's4':"Une suite d'applications performantes, un espace client, et le suivi de vos commandes, à portée de main.",
 's5':"Notre mission : aider les flottes indépendantes à se développer, et les organisations à réduire leurs coûts, grâce à une logistique plus intelligente.",
 's6':"Avec UPS, nous avons construit un réseau logistique international. Et notre ambition : nous déployer dans toute l'Afrique francophone.",
 's7':"Paps. Une expérience de logistique unique. Demandez votre devis sur papslogistics point com.",
}
async def main():
    d={}
    W={}
    for k,t in LINES.items():
        c=edge_tts.Communicate(t,VOICE,rate=RATE,boundary='WordBoundary')
        wb=[]
        with open(f'audio/{k}.mp3','wb') as f:
            async for ch in c.stream():
                if ch['type']=='audio': f.write(ch['data'])
                elif ch['type']=='WordBoundary': wb.append([ch['text'],round(ch['offset']/1e7,2),round(ch['duration']/1e7,2)])
        W[k]=wb
        dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'audio/{k}.mp3']))
        d[k]=round(dur,2)
    json.dump(W,open('audio/words.json','w'),ensure_ascii=False)
    print(json.dumps(d),sum(d.values()))
asyncio.run(main())
