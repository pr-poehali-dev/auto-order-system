import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Order {
  id: string;
  date: string;
  supplier: string;
  status: 'draft' | 'sent' | 'confirmed' | 'awaiting';
  sum: number;
  creationType: 'auto' | 'manual' | 'mixed';
}

const OrdersJournal = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const mockJournalOrders: Order[] = [
    { id: 'ORD-2024-001', date: '05.12.2024', supplier: 'МолокоПром', status: 'confirmed', sum: 450000, creationType: 'auto' },
    { id: 'ORD-2024-002', date: '05.12.2024', supplier: 'ХлебКомбинат', status: 'sent', sum: 320000, creationType: 'mixed' },
    { id: 'ORD-2024-003', date: '04.12.2024', supplier: 'АгроПоставка', status: 'awaiting', sum: 680000, creationType: 'auto' },
    { id: 'ORD-2024-004', date: '04.12.2024', supplier: 'МясоКомплекс', status: 'draft', sum: 210000, creationType: 'manual' },
    { id: 'ORD-2024-005', date: '03.12.2024', supplier: 'СиФуд Трейд', status: 'confirmed', sum: 540000, creationType: 'auto' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'awaiting': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Черновик';
      case 'sent': return 'Отправлен';
      case 'confirmed': return 'Подтвержден';
      case 'awaiting': return 'Ожидается поставка';
      default: return status;
    }
  };

  const getCreationTypeColor = (type: string) => {
    switch (type) {
      case 'auto': return 'bg-primary/10 text-primary border-primary/20';
      case 'manual': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'mixed': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCreationTypeLabel = (type: string) => {
    switch (type) {
      case 'auto': return 'Авто';
      case 'manual': return 'Ручной';
      case 'mixed': return 'Смешанный';
      default: return type;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return 'FileEdit';
      case 'sent': return 'Send';
      case 'confirmed': return 'CheckCircle';
      case 'awaiting': return 'Truck';
      default: return 'Circle';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Icon name="FileText" size={20} className="mr-2" />
              Журнал заказов
            </CardTitle>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Фильтр по статусу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="draft">Черновик</SelectItem>
                  <SelectItem value="sent">Отправлен</SelectItem>
                  <SelectItem value="confirmed">Подтвержден</SelectItem>
                  <SelectItem value="awaiting">Ожидается поставка</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Фильтр по источнику" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все источники</SelectItem>
                  <SelectItem value="auto">Автозаказ</SelectItem>
                  <SelectItem value="manual">Ручной заказ</SelectItem>
                  <SelectItem value="mixed">Смешанный</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b">
                <tr>
                  <th className="p-3 text-left font-semibold">№ Заказа</th>
                  <th className="p-3 text-left font-semibold">Дата</th>
                  <th className="p-3 text-left font-semibold">Поставщик</th>
                  <th className="p-3 text-left font-semibold">Статус</th>
                  <th className="p-3 text-right font-semibold">Сумма</th>
                  <th className="p-3 text-left font-semibold">Способ создания</th>
                  <th className="p-3 text-left font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody>
                {mockJournalOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-3 font-mono font-semibold">{order.id}</td>
                    <td className="p-3 text-muted-foreground">{order.date}</td>
                    <td className="p-3 font-medium">{order.supplier}</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(order.status)}>
                        <Icon name={getStatusIcon(order.status)} size={12} className="mr-1" />
                        {getStatusLabel(order.status)}
                      </Badge>
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {order.sum.toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="p-3">
                      <Badge className={getCreationTypeColor(order.creationType)}>
                        {getCreationTypeLabel(order.creationType)}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" title="Просмотр состава">
                          <Icon name="Eye" size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" title="Отправить поставщику">
                          <Icon name="Send" size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" title="Печать PDF">
                          <Icon name="Printer" size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" title="Клонировать">
                          <Icon name="Copy" size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="GitBranch" size={20} className="mr-2" />
            Процесс заказа
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-8">
            {[
              { status: 'Сформирован', icon: 'FileEdit', color: 'primary', active: true },
              { status: 'Отправлен', icon: 'Send', color: 'primary', active: true },
              { status: 'Подтвержден', icon: 'CheckCircle', color: 'success', active: true },
              { status: 'Ожидается поставка', icon: 'Truck', color: 'muted', active: false }
            ].map((step, idx) => (
              <div key={idx} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      step.active 
                        ? `bg-${step.color} text-white` 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon name={step.icon} size={20} />
                  </div>
                  <span className={`text-sm font-medium text-center ${
                    step.active ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.status}
                  </span>
                </div>
                {idx < 3 && (
                  <div className={`h-0.5 flex-1 mx-2 ${
                    step.active ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersJournal;
