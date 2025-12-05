import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import OrderDetailPanel from '@/components/OrderDetailPanel';

interface OrderItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  forecast: number;
  inTransit: number;
  rop: number;
  recommendedQty: number;
  supplier: string;
  status: 'new' | 'attention' | 'paused' | 'approved';
  comment?: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<OrderItem | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  const kpiData = {
    ordersToCheck: 23,
    potentialOOS: 15,
    todayOrdersSum: 1245680,
    autoOrderCoverage: 85
  };

  const deliverySchedule = [
    { date: '05.12', sum: 450000, status: 'confirmed' },
    { date: '06.12', sum: 320000, status: 'confirmed' },
    { date: '07.12', sum: 0, status: 'empty' },
    { date: '08.12', sum: 680000, status: 'confirmed' },
    { date: '09.12', sum: 210000, status: 'pending' },
    { date: '10.12', sum: 540000, status: 'confirmed' },
    { date: '11.12', sum: 0, status: 'empty' }
  ];

  const alerts = [
    { id: 1, type: 'warning', text: 'У 5 товаров изменился основной поставщик. Требуется проверка параметров' },
    { id: 2, type: 'info', text: 'Резкий рост продаж по категории "Молоко". Рекомендуется проверить прогноз' }
  ];

  const mockOrders: OrderItem[] = [
    {
      id: '1',
      sku: 'MLK-001',
      name: 'Молоко 3.2% 1л',
      category: 'Молочные продукты',
      currentStock: 45,
      forecast: 320,
      inTransit: 100,
      rop: 150,
      recommendedQty: 400,
      supplier: 'МолокоПром',
      status: 'new'
    },
    {
      id: '2',
      sku: 'BRD-045',
      name: 'Хлеб белый нарезной',
      category: 'Хлебобулочные',
      currentStock: 12,
      forecast: 180,
      inTransit: 0,
      rop: 80,
      recommendedQty: 250,
      supplier: 'ХлебКомбинат',
      status: 'attention'
    },
    {
      id: '3',
      sku: 'VEG-023',
      name: 'Картофель 1кг',
      category: 'Овощи',
      currentStock: 230,
      forecast: 150,
      inTransit: 50,
      rop: 120,
      recommendedQty: 100,
      supplier: 'АгроПоставка',
      status: 'new'
    },
    {
      id: '4',
      sku: 'MEA-067',
      name: 'Курица охлажденная 1кг',
      category: 'Мясо',
      currentStock: 8,
      forecast: 220,
      inTransit: 0,
      rop: 100,
      recommendedQty: 350,
      supplier: 'МясоКомплекс',
      status: 'attention'
    },
    {
      id: '5',
      sku: 'FRZ-112',
      name: 'Креветки замороженные 500г',
      category: 'Морепродукты',
      currentStock: 156,
      forecast: 85,
      inTransit: 30,
      rop: 60,
      recommendedQty: 50,
      supplier: 'СиФуд Трейд',
      status: 'paused'
    }
  ];

  const [orders, setOrders] = useState<OrderItem[]>(mockOrders);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'attention': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'paused': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'К утверждению';
      case 'attention': return 'Требует внимания';
      case 'paused': return 'На паузе';
      case 'approved': return 'Утверждено';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Package" className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Система автозаказа</h1>
                <p className="text-sm text-muted-foreground">Распределительный центр</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Icon name="Bell" size={16} className="mr-2" />
                Уведомления
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="Settings" size={16} className="mr-2" />
                Настройки
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">
              <Icon name="LayoutDashboard" size={16} className="mr-2" />
              Дашборд
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Icon name="ClipboardList" size={16} className="mr-2" />
              Рабочий стол
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Аналитика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Icon name="ClipboardCheck" size={16} className="mr-2" />
                    Заказов к проверке сегодня
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <p className={`text-4xl font-bold ${kpiData.ordersToCheck > 20 ? 'text-destructive' : 'text-foreground'}`}>
                      {kpiData.ordersToCheck}
                    </p>
                    {kpiData.ordersToCheck > 20 && (
                      <Badge variant="destructive" className="ml-2">
                        <Icon name="AlertTriangle" size={12} className="mr-1" />
                        Высокая нагрузка
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Icon name="AlertCircle" size={16} className="mr-2" />
                    Потенциальный OOS (7 дней)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-warning">{kpiData.potentialOOS}</p>
                  <p className="text-sm text-muted-foreground mt-1">SKU под угрозой</p>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Icon name="TrendingUp" size={16} className="mr-2" />
                    Сумма сегодняшних заказов
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-foreground">
                    {kpiData.todayOrdersSum.toLocaleString('ru-RU')} ₽
                  </p>
                  <p className="text-sm text-success mt-1">+12% к прошлой неделе</p>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Icon name="Target" size={16} className="mr-2" />
                    Охват автозаказа
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-foreground">{kpiData.autoOrderCoverage}%</p>
                  <p className="text-sm text-muted-foreground mt-1">SKU под управлением</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Calendar" size={20} className="mr-2" />
                  Загрузка поставок по дням
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {deliverySchedule.map((day, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        day.status === 'confirmed' ? 'border-success bg-green-50 hover:bg-green-100' :
                        day.status === 'pending' ? 'border-warning bg-amber-50 hover:bg-amber-100' :
                        'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <p className="text-sm font-semibold text-center mb-2">{day.date}</p>
                      {day.sum > 0 ? (
                        <>
                          <p className="text-lg font-bold text-center">
                            {(day.sum / 1000).toFixed(0)}к ₽
                          </p>
                          <div className="mt-2 h-16 bg-white rounded overflow-hidden">
                            <div
                              className={`h-full ${day.status === 'confirmed' ? 'bg-success' : 'bg-warning'}`}
                              style={{ width: `${(day.sum / 680000) * 100}%` }}
                            />
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center mt-2">Нет поставок</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center">
                <Icon name="Bell" size={20} className="mr-2" />
                Срочные алерты
              </h3>
              {alerts.map(alert => (
                <Alert key={alert.id} className={alert.type === 'warning' ? 'border-warning bg-amber-50' : 'border-primary bg-blue-50'}>
                  <Icon name={alert.type === 'warning' ? 'AlertTriangle' : 'Info'} size={16} />
                  <AlertDescription className="ml-2">{alert.text}</AlertDescription>
                </Alert>
              ))}
            </div>

            <div className="flex gap-3">
              <Button size="lg" className="flex-1">
                <Icon name="RefreshCw" size={18} className="mr-2" />
                Сформировать рекомендации на сегодня
              </Button>
              <Button size="lg" variant="outline" className="flex-1" onClick={() => setActiveTab('orders')}>
                <Icon name="ArrowRight" size={18} className="mr-2" />
                Перейти к проверке
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Icon name="ClipboardList" size={20} className="mr-2" />
                    Рабочий стол проверки заказов
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Icon name="Filter" size={16} className="mr-2" />
                      Фильтры
                    </Button>
                    <Button variant="outline" size="sm">
                      <Icon name="Download" size={16} className="mr-2" />
                      Экспорт
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-4 bg-muted rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedOrders.length === orders.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm font-medium">
                      Выбрано: {selectedOrders.length} из {orders.length}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" disabled={selectedOrders.length === 0}>
                      <Icon name="Check" size={16} className="mr-2" />
                      Утвердить
                    </Button>
                    <Button size="sm" variant="outline" disabled={selectedOrders.length === 0}>
                      <Icon name="X" size={16} className="mr-2" />
                      Отклонить
                    </Button>
                    <Button size="sm" variant="outline" disabled={selectedOrders.length === 0}>
                      <Icon name="Clock" size={16} className="mr-2" />
                      Отложить
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted border-b">
                        <tr>
                          <th className="p-3 text-left font-semibold w-12"></th>
                          <th className="p-3 text-left font-semibold">SKU / Название</th>
                          <th className="p-3 text-left font-semibold">Категория</th>
                          <th className="p-3 text-right font-semibold">Тек. остаток</th>
                          <th className="p-3 text-right font-semibold">Прогноз</th>
                          <th className="p-3 text-right font-semibold">В пути</th>
                          <th className="p-3 text-right font-semibold">ROP</th>
                          <th className="p-3 text-right font-semibold">Рекоменд. кол-во</th>
                          <th className="p-3 text-left font-semibold">Поставщик</th>
                          <th className="p-3 text-left font-semibold">Статус</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr 
                            key={order.id} 
                            className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={(e) => {
                              if (!(e.target as HTMLElement).closest('input, button, .select-trigger')) {
                                setSelectedOrderForDetail(order);
                                setIsDetailPanelOpen(true);
                              }
                            }}
                          >
                            <td className="p-3">
                              <Checkbox
                                checked={selectedOrders.includes(order.id)}
                                onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                              />
                            </td>
                            <td className="p-3">
                              <div>
                                <p className="font-medium text-foreground">{order.name}</p>
                                <p className="text-xs text-muted-foreground">{order.sku}</p>
                              </div>
                            </td>
                            <td className="p-3 text-muted-foreground">{order.category}</td>
                            <td className="p-3 text-right font-mono">
                              <span className={order.currentStock < order.rop ? 'text-destructive font-semibold' : ''}>
                                {order.currentStock}
                              </span>
                            </td>
                            <td className="p-3 text-right font-mono">{order.forecast}</td>
                            <td className="p-3 text-right font-mono">{order.inTransit}</td>
                            <td className="p-3 text-right font-mono text-muted-foreground">{order.rop}</td>
                            <td className="p-3 text-right">
                              <Input
                                type="number"
                                defaultValue={order.recommendedQty}
                                className="w-24 text-right font-semibold"
                              />
                            </td>
                            <td className="p-3">
                              <Select defaultValue={order.supplier}>
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={order.supplier}>{order.supplier}</SelectItem>
                                  <SelectItem value="alt1">Альтернатива 1</SelectItem>
                                  <SelectItem value="alt2">Альтернатива 2</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-3">
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusLabel(order.status)}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="BarChart3" size={20} className="mr-2" />
                  Аналитика и прогнозирование
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Icon name="TrendingUp" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Раздел аналитики в разработке</p>
                    <p className="text-sm">Здесь будут графики прогнозирования спроса и анализ сезонности</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <OrderDetailPanel
        order={selectedOrderForDetail}
        isOpen={isDetailPanelOpen}
        onClose={() => setIsDetailPanelOpen(false)}
      />
    </div>
  );
};

export default Index;