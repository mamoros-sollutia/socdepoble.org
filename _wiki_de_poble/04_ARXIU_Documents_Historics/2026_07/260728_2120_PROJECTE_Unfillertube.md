---
estat: auditat
tipus: document
tags:
- arxiu
- historic
- socdepoble
---
# Unfillertube

## 📋 Introducció

**Unfillertube** és una eina dissenyada per eliminar les **muletilles** ("ehm", "uhm", "so", "doncs", "bàsicament", etc.) de l'àudio o vídeo de YouTube en llengües parlades. A més, pot crear una **playlist de YouTube** a partir de segments d'un sol vídeo de YouTube.

Es defineix com un projecte orientat al futur, amb potencial d'expansió i millora contínua.

---

## 🔧 Prerequisits

| # | Requisit | Descripció |
|---|----------|------------|
| 1 | **YouTube API Key** | Clau d'accés a l'API de YouTube per a la recuperació de metadades i processament de vídeos |
| 2 | **Servei de transcripció** | Com Deepgram, Whisper, o qualsevol servei de transcripció d'àudio a text (opcional) |
| 3 | **Software d'edició** | Filmora (Wondershare), CapCut, Adobe Premiere, iMovie, o qualsevol editor de vídeo |
| 4 | **Coneixements d'idioma** | Habilidades en llengües parlades (italià, anglès, espanyol, català, urdú, etc.) |

---

## 🏗️ Arquitectura Técnica

### Flux de Processament

```
YouTube Video
    │
    ▼
┌──────────────────┐
│  Descàrrega d'Àudio │  ← youtube-dl / yt-dlp
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Transcripció      │  ← Deepgram / Whisper / Gemini
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Detecció de       │  ← Filtratge per patrons regex
│ Muletilles        │     i NLP
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Marcatge de       │  ← Timestamps precisos
│ Timestamps        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Edició Automàtica │  ← ffmpeg / CapCut API
│ o Manual          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Exportació Final  │  ← Vídeo net + Playlist
└──────────────────┘
```

---

## 🎯 Detecció de Muletilles

### Patrons Comuns per Idioma

```python
FILLER_PATTERNS = {
    "ca": ["ehm", "uhm", "doncs", "bàsicament", "o sigui", "vull dir"],
    "es": ["ehm", "este", "pues", "o sea", "básicamente", "en plan"],
    "en": ["um", "uh", "so", "basically", "I mean", "you know"],
    "it": ["ehm", "cioè", "praticamente", "diciamo", "insomma"],
    "ur": ["یعنی", "بASICALLY", "تو", "ارے"]
}
```

### Lògica de Detecció

```python
import re

def detect_fillers(transcription: list[dict]) -> list[dict]:
    """
    Detecta muletilles en una transcripció amb timestamps.
    
    Args:
        transcription: Llista de segments amb text, start_time, end_time
    
    Returns:
        Llista de segments que contenen muletilles
    """
    filler_segments = []
    
    # Patrons regex per muletilles
    filler_regex = re.compile(
        r'\b(ehm|uhm|um|uh|doncs|o sigui|vull dir|bàsicament)\b',
        re.IGNORECASE
    )
    
    for segment in transcription:
        if filler_regex.search(segment["text"]):
            # Comprovar si el segment és només una muletilla
            # o si conté contingut vàlid
            words = segment["text"].strip().split()
            if len(words) <= 3:  # Segment curt = probablement només muletilla
                filler_segments.append({
                    "start": segment["start"],
                    "end": segment["end"],
                    "text": segment["text"],
                    "type": "pure_filler"
                })
            else:
                # Segment mixt: cal editar amb precisió
                filler_segments.append({
                    "start": segment["start"],
                    "end": segment["end"],
                    "text": segment["text"],
                    "type": "mixed"
                })
    
    return filler_segments
```

---

## 🎬 Integració amb ffmpeg per l'Edició

```python
import subprocess

def remove_fillers_with_ffmpeg(
    input_file: str,
    output_file: str,
    filler_segments: list[dict]
) -> None:
    """
    Elimina segments de muletilles d'un fitxer d'àudio/vídeo
    usant ffmpeg.
    
    Args:
        input_file: Ruta del fitxer d'entrada
        output_file: Ruta del fitxer de sortida
        filler_segments: Segments a eliminar (amb start i end)
    """
    # Construir la llista de segments a MANTENIR
    # (invertint els segments de muletilles)
    keep_segments = []
    last_end = 0.0
    
    for filler in sorted(filler_segments, key=lambda x: x["start"]):
        if filler["start"] > last_end:
            keep_segments.append((last_end, filler["start"]))
        last_end = filler["end"]
    
    # Afegir el segment final
    keep_segments.append((last_end, float('inf')))
    
    # Construir la comanda ffmpeg
    filter_parts = []
    for i, (start, end) in enumerate(keep_segments):
        if end == float('inf'):
            filter_parts.append(
                f"[0:v]trim=start={start}:end=999999,setpts=PTS-STARTPTS[v{i}];"
                f"[0:a]atrim=start={start}:end=999999,asetpts=PTS-STARTPTS[a{i}]"
            )
        else:
            duration = end - start
            filter_parts.append(
                f"[0:v]trim=start={start}:duration={duration},setpts=PTS-STARTPTS[v{i}];"
                f"[0:a]atrim=start={start}:duration={duration},asetpts=PTS-STARTPTS[a{i}]"
            )
    
    # Concatenar tots els segments
    concat_inputs = "".join(f"[v{i}][a{i}]" for i in range(len(keep_segments)))
    filter_complex = ";".join(filter_parts) + f";{concat_inputs}concat=n={len(keep_segments)}:v=1:a=1[vout][aout]"
    
    cmd = [
        "ffmpeg",
        "-i", input_file,
        "-filter_complex", filter_complex,
        "-map", "[vout]",
        "-map", "[aout]",
        "-c:v", "libx264",
        "-c:a", "aac",
        "-y",
        output_file
    ]
    
    subprocess.run(cmd, check=True)
```

---

## 📹 Creació de Playlist des de Segments

```python
from googleapiclient.discovery import build

def create_playlist_from_segments(
    youtube_api_key: str,
    video_id: str,
    segments: list[dict],
    playlist_title: str = "Unfillertube Playlist"
) -> str:
    """
    Crea una playlist de YouTube amb segments d'un vídeo.
    
    Args:
        youtube_api_key: Clau de l'API de YouTube
        video_id: ID del vídeo original
        segments: Llista de segments amb start i end
        playlist_title: Títol de la playlist
    
    Returns:
        ID de la playlist creada
    """
    youtube = build('youtube', 'v3', developerKey=youtube_api_key)
    
    # Crear la playlist
    playlist_request = youtube.playlists().insert(
        part="snippet,status",
        body={
            "snippet": {
                "title": playlist_title,
                "description": "Playlist generada per Unfillertube"
            },
            "status": {
                "privacyStatus": "private"
            }
        }
    )
    playlist_response = playlist_request.execute()
    playlist_id = playlist_response["id"]
    
    # Afegir cada segment com a vídeo amb timestamp
    for segment in segments:
        start_seconds = int(segment["start"])
        video_url = f"https://www.youtube.com/watch?v={video_id}&t={start_seconds}s"
        
        # Cercar el vídeo (en aquest cas, el mateix vídeo amb timestamp)
        # Note: YouTube Data API no suporta directament afegir segments
        # com a vídeos separats. Això requereix una aproximació diferent:
        # 1. Descarregar el vídeo
        # 2. Tallar-lo amb ffmpeg
        # 3. Pujar cada segment com a vídeo nou
        # O bé crear una playlist amb enllaços amb timestamp
        
        print(f"Segment: {start_seconds}s - {int(segment['end'])}s")
    
    return playlist_id
```

---

## 🔗 Integració amb Transcripció (Deepgram / Gemini)

```python
# Usant Deepgram per a transcripció amb timestamps precisos
from deepgram import DeepgramClient, PrerecordedOptions

DEEPGRAM_API_KEY = "your_deepgram_api_key"

async def transcribe_audio(audio_file_path: str) -> list[dict]:
    """
    Transcriu un fitxer d'àudio i retorna segments amb timestamps.
    """
    deepgram = DeepgramClient(DEEPGRAM_API_KEY)
    
    options = PrerecordedOptions(
        model="nova-2",
        language="ca",  # Català
        punctuate=True,
        diarize=False,
        utterances=True,  # Divideix per frases/segments
        smart_format=True
    )
    
    with open(audio_file_path, "rb") as audio:
        source = {"buffer": audio, "mimetype": "audio/wav"}
        response = await deepgram.listen.asyncprerecorded.v1.transcribe_file(
            source, options
        )
    
    # Processar la resposta
    segments = []
    for utterance in response.results.utterances:
        segments.append({
            "start": utterance.start,
            "end": utterance.end,
            "text": utterance.transcript
        })
    
    return segments
```

---

## 🚀 Flux Complet d'Ús

```python
async def process_youtube_video(
    youtube_url: str,
    youtube_api_key: str,
    output_dir: str = "./output"
) -> dict:
    """
    Flux complet: descàrrega → transcripció → detecció → edició → playlist
    """
    # 1. Descarregar l'àudio del vídeo de YouTube
    audio_path = download_youtube_audio(youtube_url, output_dir)
    
    # 2. Transcriure l'àudio
    segments = await transcribe_audio(audio_path)
    
    # 3. Detectar muletilles
    filler_segments = detect_fillers(segments)
    print(f"Muletilles detectades: {len(filler_segments)}")
    
    # 4. Eliminar muletilles amb ffmpeg
    cleaned_audio_path = f"{output_dir}/cleaned_audio.wav"
    remove_fillers_with_ffmpeg(audio_path, cleaned_audio_path, filler_segments)
    
    # 5. Crear playlist des dels segments vàlids
    valid_segments = [s for s in segments if s not in filler_segments]
    video_id = extract_video_id(youtube_url)
    playlist_id = create_playlist_from_segments(
        youtube_api_key, video_id, valid_segments
    )
    
    return {
        "original_audio": audio_path,
        "cleaned_audio": cleaned_audio_path,
        "fillers_removed": len(filler_segments),
        "playlist_id": playlist_id,
        "playlist_url": f"https://www.youtube.com/playlist?list={playlist_id}"
    }
```

---

## 📊 Mètriques i Resultats Esperats

| Mètrica | Valor Esperat |
|---------|---------------|
| Precisió de detecció | 85-95% |
| Reducció de durada | 10-30% (segons parlant) |
| Temps de processament | 2-5x la durada del vídeo |
| Idiomes suportats | Català, Espanyol, Anglès, Italià, Urdú |

---

> **Nota:** Unfillertube és un projecte conceptual en desenvolupament. La implementació completa requereix integració amb múltiples serveis i APIs. El codi mostrat aquí serveix com a base arquitectònica i punt de partida.


---

**Ancoratge de Seguretat:** [[00_INDEX]]