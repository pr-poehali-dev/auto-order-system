import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const OrderCalculation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id') || '1';

  const [safetyStock, setSafetyStock] = useState(10);
  const [forecastAggressiveness, setForecastAggressiveness] = useState(50);
  const [minBatchSize, setMinBatchSize] = useState(50);
  const [learnFromDecision, setLearnFromDecision] = useState(true);

  const orderData = {
    id: orderId,
    sku: 'MLK-001',
    name: 'Молоко 3.2% 1л',
    category: 'Молочные продукты',
    currentStock: 5,
    forecast: 35,
    inTransit: 0,
    rop: 15,
    supplier: 'МолокоПром'
  };

  const forecastDays = 35;
  const safetyStockQty = Math.round(safetyStock * 2.5);
  const seasonalityAdjustment = 5;
  
  const calculatedOrder = Math.max(
    Math.ceil(
      (forecastDays + safetyStockQty - orderData.currentStock - orderData.inTransit + seasonalityAdjustment) / minBatchSize
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
    const stock = orderData.currentStock - (dailySales * day);
    return {
      day,
      stock: Math.max(stock, 0),
      min: orderData.rop * 0.5,
      max: orderData.rop * 1.5,
      rop: orderData.rop
    };
  });

  const salesHistory = [
    { date: '01.06', sales: 320, order: 350 },
    { date: '15.06', sales: 340, order: 350 },
    { date: '01.07', sales: 380, order: 350 },
    { date: '15.07', sales: 360, order: 400 },
    { date: '01.08', sales: 310, order: 350 },
    { date: '15.08', sales: 290, order: 350 },
    { date: '01.09', sales: 330, order: 350 },
    { date: '15.09', sales: 350, order: 350 },
    { date: '01.10', sales: 370, order: 350 },
    { date: '15.10', sales: 340, order: 400 },
    { date: '01.11', sales: 360, order: 350 },
    { date: '15.11', sales: 330, order: 350 }
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
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Package" className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">{orderData.name}</h1>
                <p className="text-sm text-muted-foreground">SKU: {orderData.sku} • {orderData.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button>
                <Icon name="Check" size={16} className="mr-2" />
                Применить расчет
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="calculation" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
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
                <div className="bg-muted p-6 rounded-lg space-y-3">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-primary/20">
                    <span className="text-lg font-semibold">Рекомендованный заказ =</span>
                    <span className="text-4xl font-bold text-primary">{calculatedOrder} шт.</span>
                  </div>
                  <div className="space-y-2 text-base">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Прогноз на 14 дней</span>
                      <span className="font-semibold text-lg">+{forecastDays} шт.</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Страховой запас</span>
                      <span className="font-semibold text-lg">+{safetyStockQty} шт.</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Текущий остаток</span>
                      <span className="font-semibold text-lg text-destructive">-{orderData.currentStock} шт.</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Заказ в пути</span>
                      <span className="font-semibold text-lg text-destructive">-{orderData.inTransit} шт.</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Поправка на сезонность</span>
                      <span className="font-semibold text-lg text-success">+{seasonalityAdjustment} шт.</span>
                    </div>
                    <div className="flex justify-between items-center py-2 pt-4 border-t">
                      <span className="text-muted-foreground">Округление до мин. партии</span>
                      <span className="font-semibold text-lg">{minBatchSize} шт.</span>
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
              <CardContent className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium">Страховой запас</label>
                    <span className="text-lg font-bold text-primary">{safetyStock} дней</span>
                  </div>
                  <Slider
                    value={[safetyStock]}
                    onValueChange={(v) => setSafetyStock(v[0])}
                    min={0}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-3">
                    Влияет на количество дополнительного запаса для защиты от непредвиденных скачков спроса
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium">Коэффициент агрессивности прогноза</label>
                    <span className="text-lg font-bold text-primary">
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
                  <div className="flex justify-between text-xs text-muted-foreground mt-3">
                    <span>Консервативный</span>
                    <span>Нейтральный</span>
                    <span>Агрессивный</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium">Минимальная партия</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={minBatchSize}
                        onChange={(e) => setMinBatchSize(Number(e.target.value))}
                        className="w-24 px-3 py-2 text-base font-bold text-right border rounded bg-background"
                        min={1}
                      />
                      <span className="text-sm text-muted-foreground">шт.</span>
                    </div>
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
                <div className="relative h-80 bg-muted/30 rounded-lg p-6">
                  <svg width="100%" height="100%" viewBox="0 0 700 280" className="overflow-visible">
                    <defs>
                      <linearGradient id="stockGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    
                    <rect x="0" y="70" width="700" height="140" fill="hsl(var(--success))" opacity="0.1" rx="4" />
                    <line x1="0" y1="140" x2="700" y2="140" stroke="hsl(var(--warning))" strokeWidth="2" strokeDasharray="6,4" />
                    
                    <polyline
                      points={stockForecast.map((d, i) => 
                        `${(i / 29) * 680 + 10},${250 - (d.stock / 80) * 200}`
                      ).join(' ')}
                      fill="url(#stockGradient)"
                    />
                    
                    <polyline
                      points={stockForecast.map((d, i) => 
                        `${(i / 29) * 680 + 10},${250 - (d.stock / 80) * 200}`
                      ).join(' ')}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                    />
                    
                    <line x1="140" y1="0" x2="140" y2="280" stroke="hsl(var(--destructive))" strokeWidth="3" strokeDasharray="10,5" />
                    
                    {[0, 7, 14, 21, 28].map((day) => (
                      <text
                        key={day}
                        x={(day / 29) * 680 + 10}
                        y="270"
                        fontSize="12"
                        fill="hsl(var(--muted-foreground))"
                        textAnchor="middle"
                      >
                        День {day}
                      </text>
                    ))}
                  </svg>
                  
                  <div className="absolute top-4 right-4 bg-card/95 border rounded-lg p-3 space-y-2 text-xs shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-primary"></div>
                      <span>Прогноз остатков</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-warning" style={{borderTop: '2px dashed'}}></div>
                      <span>Точка заказа (ROP)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-destructive" style={{borderTop: '3px dashed'}}></div>
                      <span>Момент заказа</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-4 bg-success opacity-10 border border-success rounded"></div>
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
                <div className="relative h-80 bg-muted/30 rounded-lg p-6">
                  <svg width="100%" height="100%" viewBox="0 0 800 280">
                    {salesHistory.map((item, i) => (
                      <g key={i}>
                        <rect
                          x={i * 63 + 30}
                          y={280 - (item.sales / 400) * 240}
                          width="24"
                          height={(item.sales / 400) * 240}
                          fill="hsl(var(--primary))"
                          opacity="0.7"
                          rx="2"
                        />
                        <rect
                          x={i * 63 + 58}
                          y={280 - (item.order / 400) * 240}
                          width="24"
                          height={(item.order / 400) * 240}
                          fill="hsl(var(--success))"
                          opacity="0.7"
                          rx="2"
                        />
                      </g>
                    ))}
                    
                    {salesHistory.map((item, i) => (
                      <text
                        key={i}
                        x={i * 63 + 54}
                        y="270"
                        fontSize="11"
                        fill="hsl(var(--muted-foreground))"
                        textAnchor="middle"
                      >
                        {item.date}
                      </text>
                    ))}
                  </svg>
                  
                  <div className="absolute top-4 right-4 bg-card/95 border rounded-lg p-3 space-y-2 text-xs shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-4 bg-primary opacity-70 rounded"></div>
                      <span>Фактические продажи</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-4 bg-success opacity-70 rounded"></div>
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
                  <div className="overflow-x-auto">
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
                            <td className="p-3 text-right font-mono text-muted-foreground">{rec.systemRecommendation} шт.</td>
                            <td className="p-3 text-right font-mono font-semibold">
                              {rec.managerDecision} шт.
                            </td>
                            <td className="p-3 text-muted-foreground italic">{rec.reason}</td>
                            <td className="p-3">{getResultBadge(rec.result)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                <div className="flex items-start space-x-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
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
      </div>
    </div>
  );
};

export default OrderCalculation;
