import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      data: data || [],
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
} 