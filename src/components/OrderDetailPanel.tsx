import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

interface OrderDetailPanelProps {
  order: {
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
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailPanel = ({ order, isOpen, onClose }: OrderDetailPanelProps) => {
  const [safetyStock, setSafetyStock] = useState(10);
  const [forecastAggressiveness, setForecastAggressiveness] = useState(50);
  const [minBatchSize, setMinBatchSize] = useState(50);
  const [learnFromDecision, setLearnFromDecision] = useState(true);

  if (!order) return null;

  const forecastDays = 35;
  const safetyStockQty = safetyStock * 2.5;
  const seasonalityAdjustment = 5;
  
  const calculatedOrder = Math.max(
    Math.ceil(
      (forecastDays + safetyStockQty - order.currentStock - order.inTransit + seasonalityAdjustment) / minBatchSize
    ) * minBatchSize,
    minBatchSize
  );

  const getAggressivenessLabel = (value: number) => {
    if (value < 33) return 'Консервативный';
    if (value < 66) return 'Нейтральный';
    return 'Агрессивный';
  };

  const stockForecast = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const dailySales = 2.5;
    const stock = order.currentStock - (dailySales * day);
    return {
      day,
      stock: Math.max(stock, 0),
      min: order.rop * 0.5,
      max: order.rop * 1.5,
      rop: order.rop
    };
  });

  const salesHistory = [
    { date: '01.06', sales: 320, order: 350, result: 'ok' },
    { date: '15.06', sales: 340, order: 350, result: 'ok' },
    { date: '01.07', sales: 380, order: 350, result: 'shortage' },
    { date: '15.07', sales: 360, order: 400, result: 'ok' },
    { date: '01.08', sales: 310, order: 350, result: 'ok' },
    { date: '15.08', sales: 290, order: 350, result: 'oversupply' },
    { date: '01.09', sales: 330, order: 350, result: 'ok' },
    { date: '15.09', sales: 350, order: 350, result: 'ok' },
    { date: '01.10', sales: 370, order: 350, result: 'shortage' },
    { date: '15.10', sales: 340, order: 400, result: 'ok' },
    { date: '01.11', sales: 360, order: 350, result: 'ok' },
    { date: '15.11', sales: 330, order: 350, result: 'ok' }
  ];

  const recommendations = [
    {
      date: '25.11.2024',
      systemRecommendation: 400,
      managerDecision: 350,
      reason: 'Ожидаю акцию у конкурентов',
      result: 'shortage'
    },
    {
      date: '18.11.2024',
      systemRecommendation: 350,
      managerDecision: 350,
      reason: '-',
      result: 'ok'
    },
    {
      date: '11.11.2024',
      systemRecommendation: 380,
      managerDecision: 400,
      reason: 'Подготовка к праздникам',
      result: 'ok'
    }
  ];

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'shortage':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Дефицит</Badge>;
      case 'oversupply':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Пересорт</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800 border-green-200">В норме</Badge>;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-4xl overflow-y-auto">
        <SheetHeader className="border-b pb-4 mb-4">
          <SheetTitle className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Icon name="Package" size={24} className="text-primary" />
                <div>
                  <h2 className="text-xl font-bold">{order.name}</h2>
                  <p className="text-sm text-muted-foreground">SKU: {order.sku} • {order.category}</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="calculation" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculation">
              <Icon name="Calculator" size={16} className="mr-2" />
              Расчет заказа
            </TabsTrigger>
            <TabsTrigger value="history">
              <Icon name="History" size={16} className="mr-2" />
              История и данные
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Icon name="Calculator" size={18} className="mr-2" />
                  Формула расчета
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-6 rounded-lg font-mono text-sm space-y-2">
                  <div className="flex items-center justify-between text-lg font-bold text-primary mb-4">
                    <span>Рекомендованный заказ =</span>
                    <span className="text-3xl">{calculatedOrder} шт.</span>
                  </div>
                  <div className="space-y-1 pl-4 border-l-4 border-primary/30">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Прогноз на 14 дней</span>
                      <span className="font-semibold">+{forecastDays} шт.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Страховой запас</span>
                      <span className="font-semibold">+{Math.round(safetyStockQty)} шт.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Текущий остаток</span>
                      <span className="font-semibold text-destructive">-{order.currentStock} шт.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Заказ в пути</span>
                      <span className="font-semibold text-destructive">-{order.inTransit} шт.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Поправка на сезонность</span>
                      <span className="font-semibold text-success">+{seasonalityAdjustment} шт.</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Округление до мин. партии</span>
                      <span className="font-semibold">{minBatchSize} шт.</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Icon name="Sliders" size={18} className="mr-2" />
                  Настройка параметров
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium">Страховой запас</label>
                    <span className="text-sm font-semibold text-primary">{safetyStock} дней</span>
                  </div>
                  <Slider
                    value={[safetyStock]}
                    onValueChange={(v) => setSafetyStock(v[0])}
                    min={0}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Влияет на количество дополнительного запаса для защиты от непредвиденных скачков спроса
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium">Коэффициент агрессивности прогноза</label>
                    <span className="text-sm font-semibold text-primary">
                      {getAggressivenessLabel(forecastAggressiveness)}
                    </span>
                  </div>
                  <Slider
                    value={[forecastAggressiveness]}
                    onValueChange={(v) => setForecastAggressiveness(v[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Консервативный</span>
                    <span>Нейтральный</span>
                    <span>Агрессивный</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium">Минимальная партия</label>
                    <input
                      type="number"
                      value={minBatchSize}
                      onChange={(e) => setMinBatchSize(Number(e.target.value))}
                      className="w-24 px-3 py-1 text-sm font-semibold text-right border rounded"
                      min={1}
                    />
                    <span className="text-sm text-muted-foreground ml-2">шт.</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Система автоматически округлит заказ до кратного этому значению
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Icon name="LineChart" size={18} className="mr-2" />
                  Визуализация остатков (30 дней)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-64 bg-muted/30 rounded-lg p-4">
                  <svg width="100%" height="100%" viewBox="0 0 600 200" className="overflow-visible">
                    <defs>
                      <linearGradient id="stockGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    
                    <rect x="0" y="50" width="600" height="100" fill="hsl(var(--success))" opacity="0.1" />
                    <line x1="0" y1="100" x2="600" y2="100" stroke="hsl(var(--warning))" strokeWidth="2" strokeDasharray="5,5" />
                    
                    <polyline
                      points={stockForecast.map((d, i) => 
                        `${(i / 29) * 580 + 10},${180 - (d.stock / 80) * 150}`
                      ).join(' ')}
                      fill="url(#stockGradient)"
                    />
                    
                    <polyline
                      points={stockForecast.map((d, i) => 
                        `${(i / 29) * 580 + 10},${180 - (d.stock / 80) * 150}`
                      ).join(' ')}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                    />
                    
                    <line x1="120" y1="0" x2="120" y2="200" stroke="hsl(var(--destructive))" strokeWidth="2" strokeDasharray="8,4" />
                    
                    {[0, 7, 14, 21, 28].map((day) => (
                      <text
                        key={day}
                        x={(day / 29) * 580 + 10}
                        y="195"
                        fontSize="10"
                        fill="hsl(var(--muted-foreground))"
                        textAnchor="middle"
                      >
                        День {day}
                      </text>
                    ))}
                  </svg>
                  
                  <div className="absolute top-2 right-2 space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-primary"></div>
                      <span>Прогноз остатков</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-warning border-dashed"></div>
                      <span>Точка заказа (ROP)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-destructive border-dashed"></div>
                      <span>Момент заказа</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-3 bg-success opacity-10 border border-success"></div>
                      <span>Коридор запасов</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button className="flex-1" size="lg">
                <Icon name="Check" size={18} className="mr-2" />
                Применить расчет
              </Button>
              <Button variant="outline" className="flex-1" size="lg">
                <Icon name="RotateCcw" size={18} className="mr-2" />
                Сбросить настройки
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Icon name="TrendingUp" size={18} className="mr-2" />
                  График продаж и заказов (6 месяцев)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-64 bg-muted/30 rounded-lg p-4">
                  <svg width="100%" height="100%" viewBox="0 0 700 200">
                    {salesHistory.map((item, i) => (
                      <g key={i}>
                        <rect
                          x={i * 55 + 20}
                          y={200 - (item.sales / 400) * 180}
                          width="20"
                          height={(item.sales / 400) * 180}
                          fill="hsl(var(--primary))"
                          opacity="0.6"
                        />
                        <rect
                          x={i * 55 + 45}
                          y={200 - (item.order / 400) * 180}
                          width="20"
                          height={(item.order / 400) * 180}
                          fill="hsl(var(--success))"
                          opacity="0.6"
                        />
                      </g>
                    ))}
                    
                    {salesHistory.map((item, i) => (
                      <text
                        key={i}
                        x={i * 55 + 42}
                        y="195"
                        fontSize="9"
                        fill="hsl(var(--muted-foreground))"
                        textAnchor="middle"
                      >
                        {item.date}
                      </text>
                    ))}
                  </svg>
                  
                  <div className="absolute top-2 right-2 space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-3 bg-primary opacity-60"></div>
                      <span>Фактические продажи</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-3 bg-success opacity-60"></div>
                      <span>Размещенный заказ</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Icon name="ClipboardList" size={18} className="mr-2" />
                  История рекомендаций vs Реальные действия
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted border-b">
                      <tr>
                        <th className="p-3 text-left font-semibold">Дата</th>
                        <th className="p-3 text-right font-semibold">Рекомендация системы</th>
                        <th className="p-3 text-right font-semibold">Решение менеджера</th>
                        <th className="p-3 text-left font-semibold">Причина отклонения</th>
                        <th className="p-3 text-left font-semibold">Итог</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recommendations.map((rec, idx) => (
                        <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-3 font-medium">{rec.date}</td>
                          <td className="p-3 text-right font-mono">{rec.systemRecommendation} шт.</td>
                          <td className="p-3 text-right font-mono font-semibold">
                            {rec.managerDecision} шт.
                          </td>
                          <td className="p-3 text-muted-foreground">{rec.reason}</td>
                          <td className="p-3">{getResultBadge(rec.result)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Icon name="Brain" size={18} className="mr-2" />
                  Обучение системы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                  <Checkbox
                    id="learn"
                    checked={learnFromDecision}
                    onCheckedChange={(checked) => setLearnFromDecision(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="learn"
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Учитывать мое решение при будущих расчетах для этого SKU
                    </label>
                    <p className="text-sm text-muted-foreground mt-2">
                      Система будет анализировать ваши корректировки и постепенно адаптировать алгоритм прогнозирования
                      для данного товара, учитывая ваш опыт и знание рынка.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailPanel;
