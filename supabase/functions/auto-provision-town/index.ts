import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    // Obtenim el payload enviat pel Database Webhook de Postgres
    const payload = await req.json()
    
    // Assegurem que estem escoltant 'INSERT' o 'UPDATE'
    if (payload.type !== 'INSERT' && payload.type !== 'UPDATE') {
       return new Response(JSON.stringify({ message: "Operació no processada" }), { status: 200 })
    }

    const primaryTown = payload.record?.primary_town;
    
    // Filtrem pobles especials o nuls
    if (!primaryTown || primaryTown === 'Global' || primaryTown === 'Sóc de Poble (Global)' || primaryTown === 'Illa de Tabarca' || primaryTown === 'Illa de Tabarca (Global)') {
      return new Response(JSON.stringify({ message: "Cap acció requerida" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Inicialitzem Supabase client usant el Service Role per saltar-nos RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Comprovem si el poble ja existeix a la taula towns
    const { data: existingTown, error: selectError } = await supabase
      .from('towns')
      .select('id')
      .ilike('name', primaryTown)
      .maybeSingle()

    if (selectError) {
      console.error("Error validant el poble:", selectError);
      throw selectError;
    }

    if (existingTown) {
      return new Response(JSON.stringify({ message: "El poble ja existeix" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    console.log(`Auto-aprovisionant nou poble: ${primaryTown}`);

    // 2. Consulta a la Viquipèdia (amb el Trellat)
    const searchQuery = encodeURIComponent(primaryTown);
    const userAgent = "SocDePoble/1.0 (hola@socdepoble.cat) EdgeFunction-AutoProvision";
    
    let copy_texto = 'EMPTY';
    
    try {
      const wpResponse = await fetch(`https://ca.wikipedia.org/w/api.php?action=opensearch&search=${searchQuery}&limit=1&format=json`, {
        headers: {
          "User-Agent": userAgent
        }
      });
      
      if (wpResponse.ok) {
        const data = await wpResponse.json();
        // L'API opensearch retorna un array on la posició [3] conté els enllaços
        if (data[3] && data[3].length > 0) {
          copy_texto = data[3][0];
          console.log(`URL de la Viquipèdia trobada: ${copy_texto}`);
        }
      }
    } catch (wpError) {
      console.error("Error consultant la Viquipèdia:", wpError);
      // No tirem error dur, simplement quedarà a EMPTY per a revisió manual
    }

    // 3. Inserim el nou poble a la DB de manera persistent i FSD-compliant
    const { data: newTown, error: insertError } = await supabase
      .from('towns')
      .insert({
        name: primaryTown,
        description: `Un bonic poble valencià: ${primaryTown}`,
        escudo_url: 'EMPTY',
        avatar_url: 'EMPTY',
        cover_url: 'EMPTY',
        copy_texto: copy_texto,
        copy_img: 'EMPTY'
      })
      .select()
      .single()

    if (insertError) {
      throw insertError;
    }

    return new Response(JSON.stringify({ message: "Poble aprovisionat correctament", town: newTown }), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
    
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
})
