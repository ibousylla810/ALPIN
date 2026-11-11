# Voix off FR + timings. Usage: python3 tts.py [voix] [rate]
import certifi; certifi.where=lambda:'/root/.ccr/ca-bundle.crt'
import asyncio, edge_tts, json, subprocess, sys
VOICE=sys.argv[1] if len(sys.argv)>1 else 'fr-FR-HenriNeural'
RATE=sys.argv[2] if len(sys.argv)>2 else '+6%'
LINES={
 's1':"Dans huit jours, tout change.",
 's2':"Le dix-neuf novembre deux mille vingt-six, GTA six débarque.",
 's3':"Retour à Vice City, dans l'état de Leonida. Soleil, néons, et chaos.",
 's4':"Deux héros, Lucia et Jason. Des braquages, de la loyauté, et aucun retour en arrière.",
 's5':"Sur PlayStation cinq et Xbox Series. Le lancement le plus attendu de la décennie.",
 's6':"Charge ta manette, prépare ta console, libère ton week-end.",
 's7':"Dix-neuf novembre. Abonne-toi pour ne rien rater.",
}
PAD=0.55; LEAD=0.35
async def main():
    D={}; W={}
    for k,t in LINES.items():
        c=edge_tts.Communicate(t,VOICE,rate=RATE,boundary='WordBoundary'); wb=[]
        with open(f'audio/{k}.mp3','wb') as f:
            async for ch in c.stream():
                if ch['type']=='audio': f.write(ch['data'])
                elif ch['type']=='WordBoundary': wb.append([ch['text'],round(ch['offset']/1e7,2),round(ch['duration']/1e7,2)])
        W[k]=wb
        D[k]=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'audio/{k}.mp3']))
    START={}; t=0.0
    for k in LINES: START[k]=round(t,2); t+=LEAD+D[k]+PAD
    T={'START':START,'LEAD':LEAD,'END':round(t,2),'D':{k:round(v,2) for k,v in D.items()}}
    json.dump(T,open('audio/timing.json','w'))
    open('words.js','w').write('window.W='+json.dumps(W,ensure_ascii=False)+';window.T='+json.dumps(T)+';')
    print(json.dumps(T))
asyncio.run(main())
