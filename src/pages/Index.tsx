import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import OrdersJournal from '@/components/OrdersJournal';
import SystemSettings from '@/components/SystemSettings';

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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDay, setSelectedDay] = useState(3);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  const weekDays = [
    { id: 0, day: 'ПН', date: '01' },
    { id: 1, day: 'ВТ', date: '02' },
    { id: 2, day: 'СР', date: '03' },
    { id: 3, day: 'ЧТ', date: '04' },
    { id: 4, day: 'ПТ', date: '05' },
    { id: 5, day: 'СБ', date: '06' },
    { id: 6, day: 'ВС', date: '07' }
  ];

  const revenueData = {
    fact: 264490,
    plan: 680048,
    accuracy: 84
  };

  const ittphData = {
    scheduled: 42.7,
    recommended: 46.6,
    fact: 39,
    target: 43
  };

  const hourlyRevenue = [
    { hour: '00:00', factValue: 0, planValue: 5000 },
    { hour: '01:00', factValue: 0, planValue: 4500 },
    { hour: '02:00', factValue: 0, planValue: 4000 },
    { hour: '03:00', factValue: 0, planValue: 4200 },
    { hour: '04:00', factValue: 0, planValue: 5500 },
    { hour: '05:00', factValue: 0, planValue: 8000 },
    { hour: '06:00', factValue: 0, planValue: 12000 },
    { hour: '07:00', factValue: 0, planValue: 18000 },
    { hour: '08:00', factValue: 15000, planValue: 25000 },
    { hour: '09:00', factValue: 22000, planValue: 35000 },
    { hour: '10:00', factValue: 32000, planValue: 45000 },
    { hour: '11:00', factValue: 45000, planValue: 52000 },
    { hour: '12:00', factValue: 58000, planValue: 60000 },
    { hour: '13:00', factValue: 68000, planValue: 65000 },
    { hour: '14:00', factValue: 62000, planValue: 58000 },
    { hour: '15:00', factValue: 55000, planValue: 52000 },
    { hour: '16:00', factValue: 48000, planValue: 48000 }
  ];

  const ittphHourly = Array.from({ length: 17 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    scheduled: 42 + Math.random() * 3,
    recommended: 46 + Math.random() * 2,
    fact: i < 8 ? null : 38 + Math.random() * 8,
    target: 43
  }));

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

  const menuItems = [
    { id: 'dashboard', label: 'Дашборд', icon: 'LayoutDashboard' },
    { id: 'orders', label: 'Панель расчета заказов', icon: 'ClipboardList' },
    { id: 'journal', label: 'Журнал заказов', icon: 'FileText' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`bg-sidebar-background border-r border-sidebar-border flex-shrink-0 transition-all duration-300 relative ${sidebarCollapsed ? 'w-16' : 'w-48'}`}>
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-center">
            {!sidebarCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Icon name="ShoppingBag" className="text-sidebar-background" size={24} />
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Icon name="ShoppingBag" className="text-sidebar-background" size={24} />
              </div>
            )}
          </div>
        </div>
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-hover hover:text-sidebar-foreground'
              }`}
              title={sidebarCollapsed ? item.label : ''}
            >
              <Icon name={item.icon} size={20} />
              {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-6 left-0 right-0 px-2">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-hover hover:text-sidebar-foreground transition-all"
            title={sidebarCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
          >
            <Icon name={sidebarCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={20} />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b bg-card">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">
                {menuItems.find(m => m.id === activeTab)?.label || 'Дашборд'}
              </h2>
              <div className="flex items-center space-x-3">
                <Select defaultValue="0001-МСК">
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0001-МСК">
                      <div>
                        <div className="font-semibold">0001-МСК</div>
                        <div className="text-xs text-muted-foreground">Россия, 121059, Город...</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto bg-background">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  className="rounded-full bg-muted hover:bg-muted/80"
                >
                  Сегодня
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Icon name="Calendar" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Icon name="ChevronLeft" size={20} />
                </Button>
                
                <div className="flex gap-2">
                  {weekDays.map((day) => (
                    <button
                      key={day.id}
                      onClick={() => setSelectedDay(day.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedDay === day.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      <div>{day.day} {day.date}</div>
                    </button>
                  ))}
                </div>
                
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Icon name="ChevronRight" size={20} />
                </Button>
              </div>

              <div className="flex items-center gap-2 bg-muted rounded-full p-1">
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    viewMode === 'day'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  День
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    viewMode === 'week'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  Неделя
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4">Результаты</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">Выручка</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icon name="BarChart3" size={18} className="text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icon name="Table" size={18} className="text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-8 mb-6">
                    <div>
                      <div className="text-3xl font-bold">{revenueData.fact.toLocaleString()}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <div className="w-2 h-2 rounded-full bg-[#5B5E8D]"></div>
                        <span>Факт, ₽</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{revenueData.plan.toLocaleString()}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <div className="w-2 h-2 rounded-full bg-[#A5A8D5]"></div>
                        <span>План, ₽</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-success">{revenueData.accuracy}%</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <span>Точность прогноза, %</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-72">
                    <svg width="100%" height="100%" viewBox="0 0 800 280" className="overflow-visible">
                      <defs>
                        <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#A5A8D5" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#A5A8D5" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>

                      {hourlyRevenue.map((item, i) => {
                        if (i % 2 === 0 && i < hourlyRevenue.length - 1) {
                          return (
                            <text
                              key={i}
                              x={(i / (hourlyRevenue.length - 1)) * 780 + 10}
                              y="270"
                              fontSize="11"
                              fill="hsl(var(--muted-foreground))"
                              textAnchor="middle"
                            >
                              {item.hour}
                            </text>
                          );
                        }
                        return null;
                      })}

                      <polyline
                        points={hourlyRevenue.map((d, i) => 
                          `${(i / (hourlyRevenue.length - 1)) * 780 + 10},${250 - (d.planValue / 80000) * 230}`
                        ).join(' ')}
                        fill="url(#revenueGradient)"
                      />

                      <polyline
                        points={hourlyRevenue.map((d, i) => 
                          `${(i / (hourlyRevenue.length - 1)) * 780 + 10},${250 - (d.planValue / 80000) * 230}`
                        ).join(' ')}
                        fill="none"
                        stroke="#A5A8D5"
                        strokeWidth="3"
                      />

                      {hourlyRevenue.map((item, i) => {
                        if (item.factValue > 0) {
                          const x = (i / (hourlyRevenue.length - 1)) * 780 + 10;
                          const height = (item.factValue / 80000) * 230;
                          return (
                            <rect
                              key={i}
                              x={x - 12}
                              y={250 - height}
                              width="24"
                              height={height}
                              fill="#5B5E8D"
                              rx="2"
                            />
                          );
                        }
                        return null;
                      })}

                      {[0, 1, 2, 3, 4].map((tick) => (
                        <g key={tick}>
                          <line
                            x1="10"
                            y1={250 - tick * 57.5}
                            x2="790"
                            y2={250 - tick * 57.5}
                            stroke="hsl(var(--border))"
                            strokeWidth="1"
                            strokeDasharray="4,4"
                          />
                          <text
                            x="5"
                            y={255 - tick * 57.5}
                            fontSize="11"
                            fill="hsl(var(--muted-foreground))"
                            textAnchor="end"
                          >
                            {(tick * 20000).toLocaleString()}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">ИТТПХ</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icon name="BarChart3" size={18} className="text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icon name="Table" size={18} className="text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-6 mb-6">
                    <div>
                      <div className="text-3xl font-bold">{ittphData.scheduled}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <div className="w-2 h-2 rounded-full bg-[#5B5E8D]"></div>
                        <span>Расписания</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{ittphData.recommended}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <div className="w-2 h-2 rounded-full bg-[#A5A8D5]"></div>
                        <span>Рекомендация</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{ittphData.fact}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <div className="w-2 h-2 rounded-full bg-warning"></div>
                        <span>Факт</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{ittphData.target}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <div className="w-2 h-2 rounded-full bg-[#FFB366]"></div>
                        <span>Цель</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-72">
                    <svg width="100%" height="100%" viewBox="0 0 800 280">
                      {ittphHourly.map((item, i) => {
                        if (i % 2 === 0 && i < ittphHourly.length - 1) {
                          return (
                            <text
                              key={i}
                              x={(i / (ittphHourly.length - 1)) * 780 + 10}
                              y="270"
                              fontSize="11"
                              fill="hsl(var(--muted-foreground))"
                              textAnchor="middle"
                            >
                              {item.hour}
                            </text>
                          );
                        }
                        return null;
                      })}

                      <line
                        x1="10"
                        y1="110"
                        x2="790"
                        y2="110"
                        stroke="#FFB366"
                        strokeWidth="2"
                        strokeDasharray="6,4"
                      />

                      <polyline
                        points={ittphHourly.map((d, i) => 
                          `${(i / (ittphHourly.length - 1)) * 780 + 10},${250 - ((d.recommended - 35) / 15) * 200}`
                        ).join(' ')}
                        fill="none"
                        stroke="#A5A8D5"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                      />

                      <polyline
                        points={ittphHourly.map((d, i) => 
                          `${(i / (ittphHourly.length - 1)) * 780 + 10},${250 - ((d.scheduled - 35) / 15) * 200}`
                        ).join(' ')}
                        fill="none"
                        stroke="#5B5E8D"
                        strokeWidth="2"
                      />

                      <polyline
                        points={ittphHourly
                          .filter(d => d.fact !== null)
                          .map((d, i) => {
                            const actualIndex = ittphHourly.findIndex(item => item === d);
                            return `${(actualIndex / (ittphHourly.length - 1)) * 780 + 10},${250 - ((d.fact! - 35) / 15) * 200}`;
                          })
                          .join(' ')}
                        fill="none"
                        stroke="hsl(var(--warning))"
                        strokeWidth="3"
                      />

                      {[25, 50, 75, 100].map((tick) => (
                        <g key={tick}>
                          <line
                            x1="10"
                            y1={250 - ((tick - 35) / 15) * 200}
                            x2="790"
                            y2={250 - ((tick - 35) / 15) * 200}
                            stroke="hsl(var(--border))"
                            strokeWidth="1"
                            strokeDasharray="4,4"
                            opacity="0.3"
                          />
                          <text
                            x="5"
                            y={255 - ((tick - 35) / 15) * 200}
                            fontSize="11"
                            fill="hsl(var(--muted-foreground))"
                            textAnchor="end"
                          >
                            {tick}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </CardContent>
              </Card>
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
                            onClick={() => navigate(`/order/${order.id}`)}
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

          <TabsContent value="journal">
            <OrdersJournal />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>
        </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;
