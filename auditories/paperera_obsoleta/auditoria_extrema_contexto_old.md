# CONTEXTO DE CÓDIGO PARA AUDITORÍA EXTREMA (SÓC DE POBLE)

A continuación se adjuntan los 4 archivos críticos que forman el núcleo de la última sesión (Hardening, Gemini Proxy con bypass anónimo, Fallback del Llibre Sencer y motor de Chat Híbrido).

Proporciona este texto directamente a tu IA Auditora junto con el prompt anterior para que pueda hacer una radiografía exacta y profunda.

---

## 1. Edge Function: Gemini Proxy (`supabase/functions/gemini-proxy/index.ts`)
**Objetivo:** Interceptar las llamadas a Gemini, evitar el error 400 de \`getUser()\` para usuarios anónimos e implementar Rate Limiting para usuarios autenticados.

\`\`\`typescript
// ✅ EDGE FUNCTION - GESTIÓN SEGURA DE CLAVES API
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    let authHeader = req.headers.get('Authorization');
    if (!authHeader || authHeader === 'Bearer null' || authHeader === 'Bearer undefined') {
       authHeader = \`Bearer \${Deno.env.get('SUPABASE_ANON_KEY')}\`;
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    let user = null;
    let finalUserId = 'anonymous-guest-user';
    let isGuest = true;

    const isAnonKey = authHeader === \`Bearer \${Deno.env.get('SUPABASE_ANON_KEY')}\`;

    if (!isAnonKey) {
      try {
        const authRes = await supabaseClient.auth.getUser();
        if (!authRes.error && authRes.data?.user) {
          user = authRes.data.user;
          finalUserId = user.id;
          isGuest = false;
        } else if (authRes.error) {
          console.warn('[Gemini Proxy] getUser() error, treating as guest:', authRes.error.message);
        }
      } catch (authException) {
        console.warn('[Gemini Proxy] getUser() exception, treating as guest:', authException);
      }
    }

    if (!isGuest) {
      try {
        const { data: rateLimitData } = await supabaseClient
          .from('api_rate_limits')
          .select('request_count, last_reset')
          .eq('user_id', finalUserId)
          .single();

        const now = Date.now();
        const oneHour = 3600000;

        if (rateLimitData && rateLimitData.last_reset) {
          const lastReset = new Date(rateLimitData.last_reset).getTime();
          if (now - lastReset < oneHour) {
            if (rateLimitData.request_count >= 100) {
              return new Response(
                JSON.stringify({ error: { message: 'Límite de peticiones excedido' } }),
                { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            }
          }
        }

        await supabaseClient.from('api_rate_limits').upsert({
          user_id: finalUserId,
          request_count: (rateLimitData?.request_count || 0) + 1,
          last_reset: rateLimitData && rateLimitData.last_reset && 
                      now - new Date(rateLimitData.last_reset).getTime() < oneHour 
                      ? rateLimitData.last_reset 
                      : new Date().toISOString()
        });
      } catch (err) {
        console.warn('[Gemini Proxy] Rate limit check failed:', err.message);
      }
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) throw new Error('API key no configurada en el servidor');

    const { model, geminiPayload, personaKey } = await req.json();

    const response = await fetch(
      \`https://generativelanguage.googleapis.com/v1beta/models/\${model}:generateContent?key=\${GEMINI_API_KEY}\`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload)
      }
    );

    const data = await response.json();

    if (!isGuest) {
      try {
        await supabaseClient.from('api_usage_logs').insert({
          user_id: finalUserId,
          persona_key: personaKey,
          model: model,
          timestamp: new Date().toISOString(),
          success: !data.error
        });
      } catch (err) {
        console.warn('[Gemini Proxy] Logging failed:', err.message);
      }
    }

    return new Response(JSON.stringify(data), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('[Gemini Proxy] Error:', error);
    return new Response(
      JSON.stringify({ error: { message: error.message || 'Error del servidor' } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
\`\`\`

---

## 2. Presentación del Proyecto (\`src/pages/ProjectPresentation.jsx\`)
**Objetivo:** Renderizar el CMS, inyectar el Llibre Sencer si la BBDD no responde (offline-first o no encontrado en rutas incrustadas) y manejar el visualizador de medios.

*(Nota: Sólo se incluye la lógica core para no hacer excesivamente largo el documento, el "DefaultBookContent" es un string HTML constante).*

\`\`\`jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit2, ShieldAlert } from 'lucide-react';
import SEO from '../components/SEO';
import GlobalFooter from '../components/GlobalFooter';
import RichTextEditor from '../components/RichTextEditor';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import MediaViewerModal from '../components/MediaViewerModal';

const DefaultBookContent = \`<h1 class="uppercase text-[var(--theme-accent-primary)] font-black text-center w-full block">SÓC DE POBLE</h1>...\`;

const ProjectPresentation = ({ standAlone = true, forcedSlug = null }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSuperAdmin } = useAuth();
    // States...
    const [htmlContent, setHtmlContent] = useState('');
    const [pageId, setPageId] = useState(null);
    const [routeSlug, setRouteSlug] = useState('');
    const [title, setTitle] = useState('');
    // ...

    const fetchPageContent = useCallback(async (slug) => {
        setIsLoadingPage(true);
        try {
            const { data, error } = await supabase
                .from('cms_pages')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) {
                // FALLBACK ROBUSTO
                if (error.code === 'PGRST116' || error.message?.includes('JSON object requested')) {
                    if (!isSuperAdmin) {
                        if (slug !== '/projecte') {
                            navigate('/mur', { replace: true });
                            return;
                        } else {
                            setHtmlContent(DefaultBookContent);
                            setTitle("Sóc de Poble: El Projecte");
                        }
                    } else {
                        setHtmlContent(DefaultBookContent);
                        setTitle("Nova Pàgina");
                    }
                } else {
                    setHtmlContent(DefaultBookContent);
                    setTitle("Sóc de Poble: El Projecte");
                }
            } else if (data) {
                setPageId(data.id);
                setHtmlContent(data.html_content || '');
                setTitle(data.title || '');
            }
        } catch (error) {
            setHtmlContent(DefaultBookContent);
        } finally {
            setIsLoadingPage(false);
        }
    }, [navigate, isSuperAdmin]);

    useEffect(() => {
        let currentSlug = forcedSlug || location.pathname;
        if (!standAlone && !forcedSlug) currentSlug = '/projecte';
        else if (currentSlug === '/projecte' || currentSlug === '/manifest') currentSlug = '/projecte';
        
        setRouteSlug(currentSlug);
        fetchPageContent(currentSlug);
    }, [location.pathname, standAlone, forcedSlug, fetchPageContent]);

    // Render logic (HeroBanner, RichTextEditor or dangerouslySetInnerHTML...)
    // ...
\`\`\`

---

## 3. Chat Detail (\`src/components/ChatDetail.jsx\`)
**Objetivo:** Gestión central asíncrona de mensajes, intercepción de audios, prevención de Race Conditions.

\`\`\`jsx
// Fragmentos críticos de handleSendMessage
const handleSendMessage = useCallback(async ({ text, attachedFile, voiceData, onSuccess, onError }) => {
    if (user?.isAnonymous && !isIAIA) {
        setIsGuestInteractionModalOpen(true);
        return;
    }

    const isVoiceMessage = !!voiceData;
    let finalContent = text?.trim() || '';
    if (!finalContent && isVoiceMessage && voiceData?.transcript) finalContent = voiceData.transcript.trim();

    if (isSendingRef.current || (!finalContent && !attachedFile && !isVoiceMessage)) return;
    
    isSendingRef.current = true;
    setIsSending(true);

    if (isNPC) {
        // Redirección auto-forward para invitados intentando hablar con NPCs estáticos
        setTimeout(() => {
            if (isComponentMounted.current) {
                navigate('/chats/11111111-1a1a-0000-0000-000000000000', { 
                    state: { autoForwardParams: { text: \`...\`, attachedFile, voiceData } }
                });
            }
        }, 1000);
        return;
    }

    // Storage Upload (Audio fallback docs if voice-messages bucket fails error 400)
    let fileUrl = null;
    if (isVoiceMessage && voiceData.blob) {
        const MimeType = voiceData.blob.type || 'audio/webm';
        const extension = MimeType.includes('mp4') ? 'mp4' : (MimeType.includes('ogg') ? 'ogg' : 'webm');
        const fileName = \`voice-\${Date.now()}-\${humanId}.\${extension}\`;
        
        let uploadResult = await supabase.storage.from('voice-messages').upload(fileName, voiceData.blob, { contentType: MimeType });
        if (uploadResult.error && (uploadResult.error.statusCode === '400' || uploadResult.error.statusCode === '404')) {
            uploadResult = await supabase.storage.from('documents').upload(fileName, voiceData.blob, { contentType: MimeType });
            if (!uploadResult.error) fileUrl = supabase.storage.from('documents').getPublicUrl(fileName).data.publicUrl;
        } else if (!uploadResult.error) {
            fileUrl = supabase.storage.from('voice-messages').getPublicUrl(fileName).data.publicUrl;
        }
    } // ... else if attachment

    // Database Send
    const payload = {
        conversationId: realChatId, senderId: humanId, senderEntityId: activeEntityId,
        content: finalContent || (isVoiceMessage ? 'Veu' : ''),
        isGuest: user?.isAnonymous, attachmentUrl: fileUrl,
        attachmentType: isVoiceMessage ? 'voice' : (attachedFile ? 'image' : null),
        voice_meta: isVoiceMessage && voiceData.duration ? { duration: voiceData.duration } : null
    };

    const result = await supabaseService.sendSecureMessage(payload, controller.signal);
    
    if (!isComponentMounted.current) return;
    addMessage(result);
    if (onSuccess) onSuccess();

    // IAIA Response Generation
    if (isIAIA) {
        // ... Preparación de audioData (FileReader to Base64)
        const capturedChatId = realChatId; // Race Condition Shield
        iaiaService.generateAIAResponse(realChatId, textFinal, otherInfo?.id || id, {
            attachmentUrl: fileUrl, attachmentType: payload.attachmentType, audioData: audioData,
            onFinish: (finalMsg) => {
                if (!isComponentMounted.current || activeChatRef.current !== capturedChatId) return;
                // Add to state and trigger TTS Voice Synthesis if voice_message
                if (isVoiceMessage && finalMsg.content) speechService.speak(finalMsg.content, 'va');
            }
        });
    }
    // ...
\`\`\`

---

## 4. Gemini Service (`src/services/geminiService.js`)
**Objetivo:** Routing de llamadas al proxy. Bypass de validación local si existe Edge. Soporte Multimodal.

```javascript
  async ask(personaKey, query, imageData = null, audioData = null) {
    const persona = this.PERSONAS[personaKey];
    if (!persona) throw new Error(\`Persona \${personaKey} no trobada.\`);

    const isSimulation = localStorage.getItem("isPlaygroundMode") === "true";
    if (isSimulation) return this.getMockResponse(personaKey, query, imageData);

    try {
      const textQuery = query.trim() || (audioData ? "Atent a l'àudio adjunt." : "Hola.");
      const parts = [{ text: textQuery }];

      if (imageData) parts.push({ inline_data: { mime_type: imageData.mimeType, data: imageData.data } });
      if (audioData) parts.push({ inline_data: { mime_type: audioData.mimeType || 'audio/webm', data: audioData.data } });

      const geminiPayload = {
        contents: [{ role: 'user', parts: parts }],
        system_instruction: { parts: [{ text: persona.systemPrompt + "\\n\\nDIRECTIVA MASTER: Actua curt i al gra." }] }
      };

      let rawText = "No hi ha resposta.";

      // [CRITICAL FETCH VIA PROXY]
      const { data, error } = await supabase.functions.invoke('gemini-proxy', {
        body: { model: this.model, geminiPayload: geminiPayload, personaKey: personaKey }
      });

      if (error || data.error) throw new Error(data?.error?.message || "Error al Proxy");
      
      rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || rawText;
      
      const cleanResponse = DOMPurify.sanitize(rawText, { /* ... */ });

      return { error: false, text: cleanResponse, persona: persona.name, is_mock: false };
    } catch (err) {
      if (personaKey === "ARXIVER") return { error: false, text: "Burocràcia bloquejada...", is_mock: true };
      return { error: true, message: "Error de Connexió." };
    }
  }
```

***

**INSTRUCCIONES PARA EL AUDITOR DE IA:** Revisa estos 4 núcleos estructurales y emite tu informe de vulnerabilidades basado en el prompt anterior.
