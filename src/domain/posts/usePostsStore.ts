import { create } from 'zustand';
export interface Post {
  id?: string | number;
  uuid: string;
  content: string;
  author: string;
  author_user_id: string;
  town_uuid: string;
  created_at?: string;
  isOptimistic?: boolean;
  hasConflict?: boolean;
}
interface PostsState {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addOptimisticPost: (post: Post) => void;
  confirmPost: (tempId: string, finalPost: Post) => void;
  markConflict: (tempId: string) => void;
  removePost: (id: string) => void;
}
export const usePostsStore = create<PostsState>(set => ({
  posts: [],
  setPosts: posts => set({
    posts
  }),
  addOptimisticPost: post => set(state => ({
    posts: [{
      ...post,
      isOptimistic: true,
      created_at: new Date().toISOString()
    }, ...state.posts]
  })),
  confirmPost: (tempId, finalPost) => set(state => ({
    posts: state.posts.map(p => p.uuid === tempId || p.id === tempId ? {
      ...finalPost,
      isOptimistic: false,
      hasConflict: false
    } : p)
  })),
  markConflict: tempId => set(state => ({
    posts: state.posts.map(p => p.uuid === tempId || p.id === tempId ? {
      ...p,
      hasConflict: true
    } : p)
  })),
  removePost: id => set(state => ({
    posts: state.posts.filter(p => p.uuid !== id && p.id !== id)
  }))
}));