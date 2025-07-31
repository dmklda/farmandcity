import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  ScrollText, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  AlertTriangle,
  Info,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface SystemLog {
  id: string;
  event_type: string;
  event_description: string;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: any;
  severity: 'info' | 'warning' | 'error' | 'critical';
  created_at: string;
}

export const SystemLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const pageSize = 50;

  useEffect(() => {
    fetchLogs(true);
  }, [searchTerm, severityFilter, eventTypeFilter]);

  const fetchLogs = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 0 : page;
      const offset = currentPage * pageSize;

      let query = supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (searchTerm) {
        query = query.or(`event_description.ilike.%${searchTerm}%,event_type.ilike.%${searchTerm}%`);
      }

      if (severityFilter && severityFilter !== 'all') {
        query = query.eq('severity', severityFilter);
      }

      if (eventTypeFilter && eventTypeFilter !== 'all') {
        query = query.eq('event_type', eventTypeFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (reset) {
        setLogs((data || []).map((log: any) => ({
          ...log,
          ip_address: log.ip_address as string | null
        })));
        setPage(0);
      } else {
        setLogs(prev => [...prev, ...(data || []).map((log: any) => ({
          ...log,
          ip_address: log.ip_address as string | null
        }))]);
      }

      setHasMore((data || []).length === pageSize);
      if (!reset) setPage(prev => prev + 1);

    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportLogs = async () => {
    // Simular exportação de logs
    // console.log('Exportando logs...', { searchTerm, severityFilter, eventTypeFilter });
    // Em produção, implementar download real
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Logs do Sistema</h1>
          <p className="text-muted-foreground">Monitoramento e auditoria de eventos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchLogs(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por severidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as severidades</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="auth">Autenticação</SelectItem>
                  <SelectItem value="admin">Administração</SelectItem>
                  <SelectItem value="game">Jogo</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            Logs do Sistema ({logs.length} registros)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getSeverityIcon(log.severity)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{log.event_type}</span>
                        <Badge className={getSeverityColor(log.severity)}>
                          {log.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {log.event_description}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(log.created_at)}
                  </span>
                </div>

                {(log.ip_address || log.user_agent || log.metadata) && (
                  <div className="text-xs text-muted-foreground space-y-1 pl-7">
                    {log.ip_address && (
                      <div>IP: {log.ip_address}</div>
                    )}
                    {log.user_agent && (
                      <div>User Agent: {log.user_agent}</div>
                    )}
                    {log.metadata && (
                      <details className="cursor-pointer">
                        <summary>Metadados</summary>
                        <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-auto">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Carregando logs...</p>
              </div>
            )}

            {!loading && logs.length === 0 && (
              <div className="text-center py-12">
                <ScrollText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum log encontrado</h3>
                <p className="text-muted-foreground">
                  Nenhum log corresponde aos filtros aplicados.
                </p>
              </div>
            )}

            {!loading && hasMore && logs.length > 0 && (
              <div className="text-center pt-4">
                <Button variant="outline" onClick={() => fetchLogs(false)}>
                  Carregar mais logs
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
