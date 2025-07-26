import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus } from 'lucide-react';

interface MonetizationPanelProps {
  onStatsUpdate: () => void;
}

export const MonetizationPanel: React.FC<MonetizationPanelProps> = ({ onStatsUpdate }) => {
  const [packs, setPacks] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch booster packs
      const { data: packsData, error: packsError } = await supabase
        .from('booster_packs')
        .select('*')
        .order('created_at', { ascending: false });

      if (packsError) throw packsError;

      // Fetch recent purchases
      const { data: purchasesData, error: purchasesError } = await supabase
        .from('pack_purchases')
        .select(`
          *,
          booster_packs (name, price_coins)
        `)
        .order('purchased_at', { ascending: false })
        .limit(10);

      if (purchasesError) throw purchasesError;

      setPacks(packsData || []);
      setPurchases(purchasesData || []);
      onStatsUpdate();
    } catch (error) {
      console.error('Error fetching monetization data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Carregando dados de monetização...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Painel de Monetização</h2>
          <p className="text-muted-foreground">Gerencie pacotes booster e vendas</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Pacote
        </Button>
      </div>

      {/* Booster Packs */}
      <Card>
        <CardHeader>
          <CardTitle>Pacotes Booster</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packs.map((pack) => (
              <Card key={pack.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{pack.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pack.description || 'Sem descrição'}
                      </p>
                    </div>
                    {!pack.is_active && (
                      <Badge variant="destructive">Inativo</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Preço:</span>
                    <span className="font-semibold">🪙 {pack.price_coins}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cartas:</span>
                    <span>{pack.cards_count}</span>
                  </div>
                  {pack.guaranteed_rarity && (
                    <div className="flex justify-between text-sm">
                      <span>Raridade Garantida:</span>
                      <Badge variant="secondary">{pack.guaranteed_rarity}</Badge>
                    </div>
                  )}
                  <div className="pt-2 border-t">
                    <Button variant="outline" className="w-full">
                      Editar Pacote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Purchases */}
      <Card>
        <CardHeader>
          <CardTitle>Compras Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium">
                      {purchase.profiles?.display_name || 'Usuário Anônimo'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {purchase.booster_packs?.name || 'Pacote Desconhecido'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">🪙 {purchase.booster_packs?.price_coins || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(purchase.purchased_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {purchases.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">Nenhuma compra realizada ainda</p>
        </div>
      )}
    </div>
  );
};