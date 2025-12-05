import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

const SystemSettings = () => {
  const [orderDays, setOrderDays] = useState(['Пн', 'Ср', 'Пт']);

  const suppliers = [
    { id: 1, name: 'МолокоПром', deliveryDays: 'Пн, Ср, Пт', leadTimeMin: 1, leadTimeMax: 2, minBatch: 50, packageMultiplier: 10, priority: 1 },
    { id: 2, name: 'ХлебКомбинат', deliveryDays: 'Ежедневно', leadTimeMin: 0, leadTimeMax: 1, minBatch: 30, packageMultiplier: 6, priority: 1 },
    { id: 3, name: 'АгроПоставка', deliveryDays: 'Вт, Чт', leadTimeMin: 2, leadTimeMax: 3, minBatch: 100, packageMultiplier: 20, priority: 2 }
  ];

  const exceptions = [
    { id: 1, item: 'Молоко сезонное 1л', category: 'Молочные продукты', reason: 'seasonal', addedDate: '01.11.2024', addedBy: 'Иванов А.' },
    { id: 2, item: 'Клубника свежая', category: 'Ягоды', reason: 'manual', addedDate: '15.10.2024', addedBy: 'Петрова М.' },
    { id: 3, item: 'Креветки тигровые', category: 'Морепродукты', reason: 'supplier_issues', addedDate: '20.11.2024', addedBy: 'Сидоров П.' }
  ];

  const forecastAccuracy = [
    { week: 'Нед 1', forecast: 320, actual: 310 },
    { week: 'Нед 2', forecast: 340, actual: 355 },
    { week: 'Нед 3', forecast: 360, actual: 350 },
    { week: 'Нед 4', forecast: 380, actual: 390 },
    { week: 'Нед 5', forecast: 350, actual: 340 },
    { week: 'Нед 6', forecast: 370, actual: 375 }
  ];

  const changeLogs = [
    { date: '05.12.2024 14:23', user: 'Иванов А.', action: 'Изменил минимальную партию для поставщика "МолокоПром"', oldValue: '40', newValue: '50' },
    { date: '03.12.2024 10:15', user: 'Петрова М.', action: 'Добавил исключение для товара "Клубника свежая"', oldValue: '-', newValue: 'Ручное управление' },
    { date: '01.12.2024 16:45', user: 'Сидоров П.', action: 'Изменил коэффициент агрессивности для категории "Мясо"', oldValue: 'Нейтральный', newValue: 'Консервативный' }
  ];

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'manual': return 'Ручное управление';
      case 'seasonal': return 'Сезонный товар';
      case 'discontinued': return 'На выводе';
      case 'supplier_issues': return 'Проблемы с поставщиком';
      default: return reason;
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'manual': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'seasonal': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'discontinued': return 'bg-red-100 text-red-800 border-red-200';
      case 'supplier_issues': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleDay = (day: string) => {
    setOrderDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <Tabs defaultValue="rules" className="space-y-6">
      <TabsList className="grid w-full max-w-2xl grid-cols-4">
        <TabsTrigger value="rules">
          <Icon name="Settings" size={16} className="mr-2" />
          Правила
        </TabsTrigger>
        <TabsTrigger value="suppliers">
          <Icon name="Truck" size={16} className="mr-2" />
          Поставщики
        </TabsTrigger>
        <TabsTrigger value="exceptions">
          <Icon name="Ban" size={16} className="mr-2" />
          Исключения
        </TabsTrigger>
        <TabsTrigger value="monitoring">
          <Icon name="Activity" size={16} className="mr-2" />
          Мониторинг
        </TabsTrigger>
      </TabsList>

      <TabsContent value="rules" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="Calendar" size={18} className="mr-2" />
              Глобальные настройки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">Дни недели для формирования заказов</label>
              <div className="flex gap-2">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                  <Button
                    key={day}
                    variant={orderDays.includes(day) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Дедлайн формирования заказов</label>
                <Input type="time" defaultValue="14:00" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Минимальная сумма заказа (₽)</label>
                <Input type="number" defaultValue="10000" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="Layers" size={18} className="mr-2" />
              Настройки по категориям товаров
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Молочные продукты', 'Хлебобулочные', 'Овощи и фрукты'].map((category, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">{category}</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Период прогноза (дней)</label>
                      <Input type="number" defaultValue="14" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Метод расчета</label>
                      <Select defaultValue="xyz">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="xyz">XYZ-анализ</SelectItem>
                          <SelectItem value="moving_avg">Скользящее среднее</SelectItem>
                          <SelectItem value="exp_smoothing">Экспоненциальное сглаживание</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Агрессивность</label>
                      <Select defaultValue="neutral">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conservative">Консервативный</SelectItem>
                          <SelectItem value="neutral">Нейтральный</SelectItem>
                          <SelectItem value="aggressive">Агрессивный</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="suppliers">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="Truck" size={18} className="mr-2" />
              Каталог поставщиков и условий
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b">
                  <tr>
                    <th className="p-3 text-left font-semibold">Поставщик</th>
                    <th className="p-3 text-left font-semibold">Дни поставок</th>
                    <th className="p-3 text-center font-semibold">Lead Time (дн)</th>
                    <th className="p-3 text-right font-semibold">Мин. партия</th>
                    <th className="p-3 text-right font-semibold">Кратность</th>
                    <th className="p-3 text-center font-semibold">Приоритет</th>
                    <th className="p-3 text-center font-semibold">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map(supplier => (
                    <tr key={supplier.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-medium">{supplier.name}</td>
                      <td className="p-3 text-muted-foreground">{supplier.deliveryDays}</td>
                      <td className="p-3 text-center font-mono">
                        {supplier.leadTimeMin}-{supplier.leadTimeMax}
                      </td>
                      <td className="p-3 text-right font-mono">{supplier.minBatch}</td>
                      <td className="p-3 text-right font-mono">{supplier.packageMultiplier}</td>
                      <td className="p-3 text-center">
                        <Badge variant="outline">{supplier.priority}</Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Button variant="ghost" size="sm">
                          <Icon name="Edit" size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="exceptions">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Icon name="Ban" size={18} className="mr-2" />
                Реестр исключений
              </CardTitle>
              <Button>
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить исключение
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b">
                  <tr>
                    <th className="p-3 text-left font-semibold">Товар</th>
                    <th className="p-3 text-left font-semibold">Категория</th>
                    <th className="p-3 text-left font-semibold">Причина</th>
                    <th className="p-3 text-left font-semibold">Дата добавления</th>
                    <th className="p-3 text-left font-semibold">Добавил</th>
                    <th className="p-3 text-center font-semibold">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {exceptions.map(exception => (
                    <tr key={exception.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-medium">{exception.item}</td>
                      <td className="p-3 text-muted-foreground">{exception.category}</td>
                      <td className="p-3">
                        <Badge className={getReasonColor(exception.reason)}>
                          {getReasonLabel(exception.reason)}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">{exception.addedDate}</td>
                      <td className="p-3 text-muted-foreground">{exception.addedBy}</td>
                      <td className="p-3 text-center">
                        <Button variant="ghost" size="sm" title="Удалить">
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="monitoring" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="TrendingUp" size={18} className="mr-2" />
              Точность прогнозов (факт vs прогноз)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-80 bg-muted/30 rounded-lg p-6">
              <svg width="100%" height="100%" viewBox="0 0 700 280">
                {forecastAccuracy.map((item, i) => (
                  <g key={i}>
                    <rect
                      x={i * 110 + 30}
                      y={280 - (item.forecast / 400) * 240}
                      width="35"
                      height={(item.forecast / 400) * 240}
                      fill="hsl(var(--primary))"
                      opacity="0.6"
                      rx="2"
                    />
                    <rect
                      x={i * 110 + 70}
                      y={280 - (item.actual / 400) * 240}
                      width="35"
                      height={(item.actual / 400) * 240}
                      fill="hsl(var(--success))"
                      opacity="0.7"
                      rx="2"
                    />
                    <text
                      x={i * 110 + 68}
                      y="270"
                      fontSize="11"
                      fill="hsl(var(--muted-foreground))"
                      textAnchor="middle"
                    >
                      {item.week}
                    </text>
                  </g>
                ))}
              </svg>

              <div className="absolute top-4 right-4 bg-card/95 border rounded-lg p-3 space-y-2 text-xs shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 bg-primary opacity-60 rounded"></div>
                  <span>Прогноз</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 bg-success opacity-70 rounded"></div>
                  <span>Факт</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="FileText" size={18} className="mr-2" />
              Лог изменений настроек
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b">
                  <tr>
                    <th className="p-3 text-left font-semibold">Дата и время</th>
                    <th className="p-3 text-left font-semibold">Пользователь</th>
                    <th className="p-3 text-left font-semibold">Действие</th>
                    <th className="p-3 text-left font-semibold">Старое значение</th>
                    <th className="p-3 text-left font-semibold">Новое значение</th>
                  </tr>
                </thead>
                <tbody>
                  {changeLogs.map((log, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-mono text-xs">{log.date}</td>
                      <td className="p-3">{log.user}</td>
                      <td className="p-3 text-muted-foreground">{log.action}</td>
                      <td className="p-3 font-mono text-xs">{log.oldValue}</td>
                      <td className="p-3 font-mono text-xs font-semibold text-primary">{log.newValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SystemSettings;
