import { Risk, Incident, Measure, MonthlyLoss } from '@/types/risk';

export const mockRisks: Risk[] = [
  {
    id: 'QNR-10245',
    status: 'Утверждён',
    block: 'Блок Сеть продаж',
    subdivision: 'Управление продаж и обслуживания',
    process: 'П871',
    riskName: 'Выдача кредита заемщику, несоответствующему требованиям Банка',
    riskLevel: 'Высокий',
    riskProfile: 'Кредитный риск',
    cleanOpRisk: { value: 0, utilization: 999, limit: 0 },
    creditOpRisk: { value: 0, utilization: 0, limit: 0 },
    indirectLosses: { value: 0, utilization: 0, limit: 0 },
    potentialLosses: 1000,
    responseStrategy: 'Принять',
    qualitativeLosses: 'Репутационные',
    scenarios: [
      {
        id: '1',
        description: 'В процессе подачи заявки через систему «Супербанк Онлайн» клиент, не соответствующий требованиям Банка, может предоставить недостоверные сведения, которые не были должным образом проверены, что приводит к положительному решению по заявке.',
        percentage: 30,
        groupScenario: 'Предоставление недостоверных сведений клиентом'
      }
    ],
    mirrors: [
      { id: '1', subdivision: 'Экосистемы B2C/ Дивизион ЗиС', percentage: 30, fact: 2, factPercentage: 4 },
      { id: '2', subdivision: 'Блок ТБ / Дивизион КК', percentage: 20, fact: 1, factPercentage: 0 }
    ],
    author: 'Иванов Ива Иванович',
    createdAt: '15.01.2026',
    source: 'Ручное создание'
  },
  {
    id: 'QNR-10421',
    status: 'Утверждён',
    block: 'Блок Сеть продаж',
    subdivision: 'Управление продаж и обслуживания',
    process: 'П871',
    riskName: 'Некорректное взимание процентов',
    riskLevel: 'Средний',
    riskProfile: 'Операционный риск',
    cleanOpRisk: { value: 5.1, utilization: 97, limit: 5.3 },
    creditOpRisk: { value: 0, utilization: 0, limit: 0 },
    indirectLosses: { value: 0, utilization: 0, limit: 0 },
    potentialLosses: 200,
    responseStrategy: 'Минимизировать',
    qualitativeLosses: 'Нет',
    scenarios: [],
    mirrors: [],
    author: 'Петров Петр Петрович',
    createdAt: '20.01.2026',
    source: 'Ручное создание'
  },
  {
    id: 'QNR-10422',
    status: 'Утверждён',
    block: 'Блок Сеть продаж',
    subdivision: 'Управление продаж и обслуживания',
    process: 'П868',
    riskName: 'Выдача кредита заемщику, несоответствующему требованиям Банка',
    riskLevel: 'Высокий',
    riskProfile: 'Кредитный риск',
    cleanOpRisk: { value: 245.1, utilization: 0, limit: 250 },
    creditOpRisk: { value: 0, utilization: 0, limit: 0 },
    indirectLosses: { value: 0, utilization: 0, limit: 0 },
    potentialLosses: 85,
    responseStrategy: 'Принять',
    qualitativeLosses: 'Нет',
    scenarios: [],
    mirrors: [],
    author: 'Сидоров Сидор Сидорович',
    createdAt: '22.01.2026',
    source: 'Импорт'
  },
  {
    id: 'QNR-10502',
    status: 'Утверждён',
    block: 'Блок Сеть продаж',
    subdivision: 'Управление продаж и обслуживания',
    process: 'П2878',
    riskName: 'Выдача кредита заемщику, несоответствующему требованиям Банка',
    riskLevel: 'Средний',
    riskProfile: 'Кредитный риск',
    cleanOpRisk: { value: 0, utilization: 0, limit: 0 },
    creditOpRisk: { value: 0, utilization: 0, limit: 0 },
    indirectLosses: { value: 0, utilization: 0, limit: 0 },
    potentialLosses: 0,
    responseStrategy: 'Передать',
    qualitativeLosses: 'Нет',
    scenarios: [],
    mirrors: [],
    author: 'Козлов Козёл Козлович',
    createdAt: '25.01.2026',
    source: 'Ручное создание'
  },
  {
    id: 'QNR-10578',
    status: 'В работе',
    block: 'Блок Сеть продаж',
    subdivision: 'Управление продаж и обслуживания',
    process: 'П2878',
    riskName: 'Штрафные санкции',
    riskLevel: 'Высокий',
    riskProfile: 'Регуляторный риск',
    cleanOpRisk: { value: 50, utilization: 112, limit: 45, fact2025: 12, forecast2025: 27 },
    creditOpRisk: { value: 0, utilization: 0, limit: 0 },
    indirectLosses: { value: 0, utilization: 0, limit: 0 },
    potentialLosses: 2.5,
    responseStrategy: 'Принять',
    qualitativeLosses: 'Репутационные',
    scenarios: [
      {
        id: '1',
        description: 'В процессе подачи заявки через систему «Супербанк Онлайн» клиент, не соответствующий требованиям Банка, может предоставить недостоверные сведения, которые не были должным образом проверены, что приводит к положительному решению по заявке.',
        percentage: 30,
        groupScenario: 'Предоставление недостоверных сведений клиентом'
      }
    ],
    mirrors: [
      { id: '1', subdivision: 'Экосистемы B2C/ Дивизион ЗиС', percentage: 30, fact: 2, factPercentage: 4 },
      { id: '2', subdivision: 'Блок ТБ / Дивизион КК', percentage: 20, fact: 1, factPercentage: 0 }
    ],
    author: 'Иванов Ива Иванович',
    createdAt: '15.01.2026',
    source: 'Ручное создание'
  },
  {
    id: 'QNR-10508',
    status: 'Утверждён',
    block: 'Блок Сеть продаж',
    subdivision: 'Управление продаж и обслуживания',
    process: 'П1243',
    riskName: 'Внутренние хищения из кассы, хранилища, УС',
    riskLevel: 'Низкий',
    riskProfile: 'Операционный риск',
    cleanOpRisk: { value: 15, utilization: 0, limit: 20 },
    creditOpRisk: { value: 0, utilization: 0, limit: 0 },
    indirectLosses: { value: 0, utilization: 0, limit: 0 },
    potentialLosses: 0,
    responseStrategy: 'Минимизировать',
    qualitativeLosses: 'Нет',
    scenarios: [],
    mirrors: [],
    author: 'Николаев Николай Николаевич',
    createdAt: '28.01.2026',
    source: 'Ручное создание'
  },
  {
    id: 'QNR-10611',
    status: 'Утверждён',
    block: 'Блок Сеть продаж',
    subdivision: 'Управление продаж и обслуживания',
    process: 'П1243',
    riskName: 'Повреждение / утрата имущества',
    riskLevel: 'Средний',
    riskProfile: 'Имущественный риск',
    cleanOpRisk: { value: 12.5, utilization: 72, limit: 17.4 },
    creditOpRisk: { value: 0, utilization: 0, limit: 0 },
    indirectLosses: { value: 0, utilization: 0, limit: 0 },
    potentialLosses: 0,
    responseStrategy: 'Передать',
    qualitativeLosses: 'Нет',
    scenarios: [],
    mirrors: [],
    author: 'Алексеев Алексей Алексеевич',
    createdAt: '01.02.2026',
    source: 'Импорт'
  },
  {
    id: 'QNR-11042',
    status: 'Утверждён',
    block: 'Блок Сеть продаж',
    subdivision: 'Управление продаж и обслуживания',
    process: 'П1243',
    riskName: 'Хищения средств со счетов сотрудниками',
    riskLevel: 'Высокий',
    riskProfile: 'Операционный риск',
    cleanOpRisk: { value: 1.8, utilization: 0, limit: 5 },
    creditOpRisk: { value: 0, utilization: 0, limit: 0 },
    indirectLosses: { value: 0, utilization: 0, limit: 0 },
    potentialLosses: 0,
    responseStrategy: 'Минимизировать',
    qualitativeLosses: 'Репутационные',
    scenarios: [],
    mirrors: [],
    author: 'Дмитриев Дмитрий Дмитриевич',
    createdAt: '05.02.2026',
    source: 'Ручное создание'
  },
  {
    id: 'QNR-11043',
    status: 'Утверждён',
    block: 'Блок Сеть продаж',
    subdivision: 'Управление продаж и обслуживания',
    process: 'П1243',
    riskName: 'Недостачи или излишки по неустановленной операции, в т.ч. технические',
    riskLevel: 'Низкий',
    riskProfile: 'Операционный риск',
    cleanOpRisk: { value: 1.5, utilization: 96, limit: 1.6 },
    creditOpRisk: { value: 0, utilization: 0, limit: 0 },
    indirectLosses: { value: 0, utilization: 0, limit: 0 },
    potentialLosses: 0.3,
    responseStrategy: 'Принять',
    qualitativeLosses: 'Нет',
    scenarios: [],
    mirrors: [],
    author: 'Егоров Егор Егорович',
    createdAt: '10.02.2026',
    source: 'Ручное создание'
  },
  {
    id: 'QNR-11044',
    status: 'Утверждён',
    block: 'Блок Сеть продаж',
    subdivision: 'Управление продаж и обслуживания',
    process: 'П1034',
    riskName: 'Внутреннее мошенничество с целью получения выгоды',
    riskLevel: 'Высокий',
    riskProfile: 'Операционный риск',
    cleanOpRisk: { value: 1, utilization: 16, limit: 6.25 },
    creditOpRisk: { value: 0, utilization: 0, limit: 0 },
    indirectLosses: { value: 0, utilization: 0, limit: 0 },
    potentialLosses: 0,
    responseStrategy: 'Минимизировать',
    qualitativeLosses: 'Репутационные',
    scenarios: [],
    mirrors: [],
    author: 'Федоров Федор Федорович',
    createdAt: '12.02.2026',
    source: 'Импорт'
  }
];

export const mockIncidents: Incident[] = [
  {
    id: 'EVE-171185',
    title: 'Фишинговая атака на сотрудника отдела продаж',
    date: '20.02.2024',
    directLosses: 280000,
    indirectLosses: 1100000,
    status: 'Утверждён'
  },
  {
    id: 'EVE-171186',
    title: 'Утеря незашифрованного служебного ноутбука',
    date: '20.02.2024',
    directLosses: 450000,
    indirectLosses: 800000,
    status: 'Утверждён'
  },
  {
    id: 'EVE-171187',
    title: 'Ошибка разработчика, приведшая к публикации данных в открытый доступ',
    date: '20.02.2024',
    directLosses: 340000,
    indirectLosses: 950000,
    status: 'Утверждён'
  }
];

export const mockMeasures: Measure[] = [
  {
    id: 'MSR-171185',
    title: 'Проведение тестирования на проникновение внешним подрядчиком',
    plannedDate: '05.03.2024',
    status: 'Новая'
  }
];

export const mockMonthlyLosses: MonthlyLoss[] = [
  { month: 'Янв', directLosses: 45, indirectLosses: 30 },
  { month: 'Фев', directLosses: 52, indirectLosses: 45 },
  { month: 'Мар', directLosses: 48, indirectLosses: 35 },
  { month: 'Апр', directLosses: 65, indirectLosses: 55 },
  { month: 'Май', directLosses: 58, indirectLosses: 42 },
  { month: 'Июн', directLosses: 75, indirectLosses: 68 },
  { month: 'Июл', directLosses: 82, indirectLosses: 72 },
  { month: 'Авг', directLosses: 68, indirectLosses: 58 },
  { month: 'Сен', directLosses: 55, indirectLosses: 48 },
  { month: 'Окт', directLosses: 62, indirectLosses: 52 },
  { month: 'Ноя', directLosses: 70, indirectLosses: 60 },
  { month: 'Дек', directLosses: 78, indirectLosses: 65 }
];

export const summaryMetrics = {
  cleanOpRisk: { total: 65.4, limit: 81.8, utilization: 80 },
  creditOpRisk: { total: 279.4, limit: 245.1, utilization: 114 },
  indirectLosses: { total: 5, limit: 5.1, utilization: 97 },
  potentialLosses: { total: 1287.8 }
};
