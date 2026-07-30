export type MatiasCity = {
  id: string;
  daneCode: string;
  city: string;
  department: string;
  postalCode?: string;
};

export const MATIAS_COLOMBIA_CITIES: MatiasCity[] = [
  { id: '1', daneCode: '05001', city: 'Medellín', department: 'Antioquia', postalCode: '050013' },
  { id: '47', daneCode: '05266', city: 'Envigado', department: 'Antioquia', postalCode: '055428' },
  { id: '126', daneCode: '08001', city: 'Barranquilla', department: 'Atlántico', postalCode: '080010' },
  { id: '149', daneCode: '11001', city: 'Bogotá D.C.', department: 'Bogotá', postalCode: '111511' },
  { id: '362', daneCode: '19001', city: 'Popayán', department: 'Cauca', postalCode: '190001' },
  { id: '657', daneCode: '47001', city: 'Santa Marta', department: 'Magdalena', postalCode: '470009' },
  { id: '1006', daneCode: '76001', city: 'Cali', department: 'Valle del Cauca', postalCode: '760008' },
];

export function getMatiasCity(value: string | null | undefined): MatiasCity | undefined {
  if (!value) return undefined;
  const normalized = value.trim();
  const legacyDaneCode = normalized.length === 8 && normalized.endsWith('000')
    ? normalized.slice(0, 5)
    : normalized;

  return MATIAS_COLOMBIA_CITIES.find(
    (city) =>
      city.id === normalized ||
      city.daneCode === normalized ||
      city.daneCode === legacyDaneCode,
  );
}
