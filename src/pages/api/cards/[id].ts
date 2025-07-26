import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Card ID is required' });
  }

  try {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Card not found'
        });
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
} 