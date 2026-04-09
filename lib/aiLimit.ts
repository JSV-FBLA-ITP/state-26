import { createClient } from '@/utils/supabase/client';

export type AIUsageType = 'chatbot' | 'image_gen';

export async function checkAIUsage(type: AIUsageType): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // For guests, we could use localStorage, but the request says "per user"
    // Let's assume guests have 0 uses for now or just allow 1? 
    // Usually "per user" implies authenticated users.
    // For guests, let's use localStorage.
    const guestUsage = JSON.parse(localStorage.getItem('guest_ai_usage') || '{"chatbot": 0, "image_gen": 0}');
    const count = guestUsage[type === 'chatbot' ? 'chatbot' : 'image_gen'];
    return { allowed: count < 3, remaining: 3 - count };
  }

  // Check the user_ai_usage table
  const { data, error } = await supabase
    .from('user_ai_usage')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error fetching AI usage:', error);
    return { allowed: false, remaining: 0 };
  }

  const count = data ? (type === 'chatbot' ? data.chatbot_count : data.image_gen_count) : 0;
  return { allowed: count < 3, remaining: 3 - count };
}

export async function incrementAIUsage(type: AIUsageType): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const guestUsage = JSON.parse(localStorage.getItem('guest_ai_usage') || '{"chatbot": 0, "image_gen": 0}');
    if (type === 'chatbot') guestUsage.chatbot = (guestUsage.chatbot || 0) + 1;
    else guestUsage.image_gen = (guestUsage.image_gen || 0) + 1;
    localStorage.setItem('guest_ai_usage', JSON.stringify(guestUsage));
    return;
  }

  // Check if record exists
  const { data } = await supabase
    .from('user_ai_usage')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (data) {
    const update = type === 'chatbot' 
      ? { chatbot_count: data.chatbot_count + 1 } 
      : { image_gen_count: data.image_gen_count + 1 };
    
    await supabase
      .from('user_ai_usage')
      .update({ ...update, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
  } else {
    const insert = type === 'chatbot' 
      ? { user_id: user.id, chatbot_count: 1, image_gen_count: 0 } 
      : { user_id: user.id, chatbot_count: 0, image_gen_count: 1 };
    
    await supabase
      .from('user_ai_usage')
      .insert([insert]);
  }
}
