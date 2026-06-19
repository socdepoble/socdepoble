import React, { useEffect, useState } from 'react';
import TargetaPoble from '../components/ui/TargetaPoble';
import { supabase } from '../supabaseClient';
import UniversalPageLayout from '../components/layout/UniversalPageLayout';

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
    <UniversalPageLayout
      title="EL MUR"
      subtitle="Publicacions recents"
      coverImage="/assets/media/backgrounds/landscape_placeholder.jpg"
    >
      <div className="flex flex-col gap-4">
        {loading && <p className="text-center opacity-50 p-4 font-bold">Connectant amb el poble...</p>}
        {!loading && posts.length === 0 && <p className="text-center opacity-50 p-4">El mur està buit. Esperant històries...</p>}
        
        {!loading && posts.map(post => {
          const title = post.title || post.seo_title || 'Publicació';
          const content = post.content || post.seo_description || '';
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
      </div>
    </UniversalPageLayout>
  );
}
