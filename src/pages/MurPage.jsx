import React, { useEffect, useState } from 'react';
import TargetaPoble from '../components/ui/TargetaPoble';
import { supabase } from '../supabaseClient';

export default function MurPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <section aria-label="Mur del poble">
      {loading && <p className="text-center opacity-50 p-4 font-bold">Connectant amb el poble...</p>}
      {!loading && posts.length === 0 && <p className="text-center opacity-50 p-4">El mur està buit. Esperant històries...</p>}
      
      {!loading && posts.map(post => {
        // En Supabase, les columnes poden ser diferents depenent de l'esquema
        const title = post.title || post.seo_title || 'Publicació';
        const content = post.content || post.seo_description || '';
        // Si no hi ha autor, fiquem un genèric
        const author = post.author_name || (post.author_role === 'company' ? 'Entitat' : 'Sóc de Poble');
        
        return (
          <TargetaPoble 
            key={post.id}
            id={post.id}
            author={author}
            title={title}
            content={content}
            date={new Date(post.created_at).toLocaleDateString('ca-ES')}
            category="mur"
          />
        );
      })}
    </section>
  );
}
