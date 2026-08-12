import React, { useState, useRef, useCallback, useEffect } from 'react';
// Removed import for 'LiveSession' as it is not an exported member of '@google/genai'.
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenAiBlob } from '@google/genai';
import { ConnectionState, TranscriptEntry } from './types';
import { encode, decode, decodeAudioData, downsampleTo16000 } from './utils/audio';
import { LoadingSpinner, MicIcon, StopIcon } from './components/icons';

//  Defined a minimal local interface for `LiveSession` to provide type safety for the session ref, as the official type is not exported.
interface LiveSession {
  close(): void;
  sendRealtimeInput(input: { media: GenAiBlob }): void;
}

// AudioWorkletProcessor code as a string URL to avoid needing a separate file
const PCM_WORKLET_CODE = `
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this.buffer = new Float32Array(this.bufferSize);
    this.bytesWritten = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (input.length > 0) {
      const channelData = input[0];
      for (let i = 0; i < channelData.length; i++) {
        this.buffer[this.bytesWritten++] = channelData[i];
        if (this.bytesWritten >= this.bufferSize) {
          this.port.postMessage(this.buffer);
          this.bytesWritten = 0;
        }
      }
    }
    return true;
  }
}
registerProcessor('pcm-processor', PCMProcessor);
`;

const App: React.FC = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.IDLE);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sessionRef = useRef<LiveSession | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [transcript]);

  const updateTranscript = useCallback((sender: 'user' | 'model', text: string) => {
    setTranscript((prev) => {
      const newTranscript = [...prev];
      let lastEntry = newTranscript.length > 0 ? newTranscript[newTranscript.length - 1] : null;

      // If the sender is different from the last entry's sender, finalize the last entry.
      if (lastEntry && lastEntry.sender !== sender && !lastEntry.isFinal) {
        newTranscript[newTranscript.length - 1] = { ...lastEntry, isFinal: true };
        lastEntry = newTranscript[newTranscript.length - 1];
      }

      // If the last entry is from the same sender and not final, append text.
      if (lastEntry && lastEntry.sender === sender && !lastEntry.isFinal) {
        newTranscript[newTranscript.length - 1] = { ...lastEntry, text: lastEntry.text + text };
      } else {
        // Otherwise, create a new entry for the current sender.
        newTranscript.push({ id: crypto.randomUUID(), sender, text, isFinal: false });
      }
      return newTranscript;
    });
  }, []);

  const finalizeLastEntry = useCallback(() => {
    setTranscript((prev) => {
      if (prev.length === 0) return prev;
      const lastEntry = prev[prev.length - 1];
      if (lastEntry.isFinal) return prev;
      
      const newTranscript = [...prev];
      newTranscript[newTranscript.length - 1] = { ...lastEntry, isFinal: true };
      return newTranscript;
    });
  }, []);
  
  const stopConversation = useCallback(async () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    mediaStreamRef.current = null;
    
    workletNodeRef.current?.disconnect();
    workletNodeRef.current = null;
    
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
      await inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
      audioSourcesRef.current.forEach(source => source.stop());
      audioSourcesRef.current.clear();
      await outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }

    setConnectionState(ConnectionState.DISCONNECTED);
  }, []);

  const startConversation = useCallback(async () => {
    setError(null);
    setTranscript([]);
    setConnectionState(ConnectionState.CONNECTING);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

      if (!apiKey) {
        setError('API key is missing. Check your .env (VITE_GEMINI_API_KEY).');
        setConnectionState(ConnectionState.ERROR);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction:  'את העוזרת הווירטואלית של answer assist ai.'+
            'פתחי כל שיחה ב: "שלום, הגעתם למשרד answer assist ai, מדברת העוזרת הווירטואלית. במה אוכל לעזור?". '+
            'דברי רק בעברית ובטון מקצועי. '+
            'זהי את מגדר המתקשר לפי הדיבור ושמרי עליו לכל השיחה. אם אינך בטוחה – השתמשי במשפטים ללא מגדר. '+
            'אין לתת מחירים ואין לקבוע פגישה. '+
            'תפקידך הוא רק לקחת הודעה משרד. '+
            'שאלי את שלוש השאלות הבאות, כל פעם בנפרד ולאחר תשובה: '+
            '1. מה סיבת הפניה בקצרה? '+
            '2. מה השם המלא להשאיר בהודעה? '+
            '3.מה מספר הטלפון לחזרה? '+
            'סכמי ללקוח את הפרטים בקול בלבד. '+
            'אם הלקוח מתקן פרט – חזרי רק על הפרט המתוקן.',
        },
        callbacks: {
          onopen: async () => {
            setConnectionState(ConnectionState.CONNECTED);
            // Cast window to `any` to allow access to vendor-prefixed `webkitAudioContext` for older browsers.
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            inputAudioContextRef.current = new AudioContextClass();
            outputAudioContextRef.current = new AudioContextClass();
            
            nextStartTimeRef.current = 0;

            const audioCtx = inputAudioContextRef.current;
            const source = audioCtx.createMediaStreamSource(stream);

            // Initialize AudioWorklet
            const blob = new Blob([PCM_WORKLET_CODE], { type: 'application/javascript' });
            const workletUrl = URL.createObjectURL(blob);
            
            try {
                await audioCtx.audioWorklet.addModule(workletUrl);
                
                const workletNode = new AudioWorkletNode(audioCtx, 'pcm-processor');
                workletNodeRef.current = workletNode;

                workletNode.port.onmessage = (event) => {
                    const inputData = event.data as Float32Array;
                    
                    // Downsample the system audio to the API requirement (16kHz)
                    const downsampledData = downsampleTo16000(inputData, audioCtx.sampleRate);
                    
                    if (downsampledData.length === 0) return;

                    const l = downsampledData.length;
                    const int16 = new Int16Array(l);
                    for (let i = 0; i < l; i++) {
                        int16[i] = downsampledData[i] * 32768;
                    }
                    
                    const pcmBlob: GenAiBlob = {
                        data: encode(new Uint8Array(int16.buffer)),
                        mimeType: 'audio/pcm;rate=16000',
                    };
                    
                    sessionPromise.then((session) => {
                        session.sendRealtimeInput({ media: pcmBlob });
                    });
                };

                source.connect(workletNode);
                workletNode.connect(audioCtx.destination); // keep the graph alive
            } catch (e) {
                console.error("Error loading AudioWorklet:", e);
                setError("Failed to initialize audio processor.");
                stopConversation();
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcription
            if (message.serverContent?.inputTranscription) {
                const { text } = message.serverContent.inputTranscription;
                updateTranscript('user', text);
            }
            if (message.serverContent?.outputTranscription) {
                const { text } = message.serverContent.outputTranscription;
                updateTranscript('model', text);
            }
            if (message.serverContent?.turnComplete) {
                finalizeLastEntry();
            }

            // Handle Audio Playback
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
              const audioContext = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContext.currentTime);

              const audioBuffer = await decodeAudioData(decode(audioData), audioContext, 24000, 1);
              const source = audioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioContext.destination);
              
              source.addEventListener('ended', () => audioSourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              audioSourcesRef.current.add(source);
            }

            // Handle interruption
            if (message.serverContent?.interrupted) {
              audioSourcesRef.current.forEach(source => source.stop());
              audioSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (err: ErrorEvent) => {
            setError(`An error occurred: ${err.message}`);
            console.error('Gemini Live API Error:', err);
            setConnectionState(ConnectionState.ERROR);
            stopConversation();
          },
          onclose: () => {
            stopConversation();
          },
        },
      });
      sessionRef.current = await sessionPromise;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to start conversation: ${errorMessage}`);
      setConnectionState(ConnectionState.ERROR);
      console.error(err);
    }
  }, [stopConversation, updateTranscript, finalizeLastEntry]);

  useEffect(() => {
    return () => {
      if (connectionState === ConnectionState.CONNECTED || connectionState === ConnectionState.CONNECTING) {
        stopConversation();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderStatus = () => {
    switch (connectionState) {
      case ConnectionState.IDLE: return 'לחץ על התחל שיחה כדי להתחיל';
      case ConnectionState.CONNECTING: return '...מתחבר';
      case ConnectionState.CONNECTED: return 'מאזין... אתה יכול לדבר עכשיו';
      case ConnectionState.DISCONNECTED: return 'השיחה הסתיימה. לחץ על התחל כדי להתחיל מחדש';
      case ConnectionState.ERROR: return `שגיאה: ${error}`;
      default: return '';
    }
  };

  const getStatusColor = () => {
    switch (connectionState) {
        case ConnectionState.CONNECTED: return 'text-green-400';
        case ConnectionState.ERROR: return 'text-red-400';
        default: return 'text-gray-400';
    }
  }

  // Fix: Updated the condition for an active conversation to only be 'CONNECTED' state. This fixes comparison errors by allowing the 'CONNECTING' state to be handled by the start button's logic.
  const isConversationActive = connectionState === ConnectionState.CONNECTED;

  return (
    <div className="flex flex-col bg-gray-900 text-white p-4 max-w-3xl mx-auto rounded-xl"
     style={{ maxHeight: "70vh", overflow: "hidden" }}>

      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold text-cyan-400">העוזרת הוירטואלית של Answer Assist AI</h1>
        <p className={`mt-2 text-sm transition-colors duration-300 ${getStatusColor()}`}>{renderStatus()}</p>
      </header>
      
      <main className="flex-grow bg-gray-800 rounded-lg p-4 overflow-y-auto mb-4 shadow-inner">
        {transcript.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            התמלול יופיע כאן
          </div>
        )}
        <div className="space-y-4">
          {transcript.map((entry) => (
            <div key={entry.id} className={`flex ${entry.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-2xl max-w-md ${entry.sender === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'} ${!entry.isFinal ? 'opacity-70' : ''}`}>
                <p className="text-sm font-semibold mb-1 capitalize">{entry.sender === 'user' ? 'את/ה' : 'העוזרת הוירטואלית'}</p>
                <p className="text-base" dir="rtl">{entry.text}</p>
              </div>
            </div>
          ))}
          <div ref={transcriptEndRef} />
        </div>
      </main>

      <footer className="flex justify-center items-center">
        {!isConversationActive ? (
          <button 
            onClick={startConversation} 
            disabled={connectionState === ConnectionState.CONNECTING}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 rounded-full text-white font-semibold shadow-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {connectionState === ConnectionState.CONNECTING ? 
              <><LoadingSpinner className="w-5 h-5" /> ...מתחבר</> : 
              <><MicIcon className="w-6 h-6" /> התחל שיחה</>
            }
          </button>
        ) : (
          <button 
            onClick={stopConversation} 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 rounded-full text-white font-semibold shadow-lg hover:bg-red-700 active:bg-red-800 transition-all duration-200"
          >
            <StopIcon className="w-6 h-6" /> הפסק שיחה
          </button>
        )}
      </footer>
    </div>
  );
};

export default App;