import { Accordion } from "@heroui/react";
import { Check } from "lucide-react";
import { getFacetStyle } from './facet-config';

export function FacetsAccordionContent({
  facetGroups,
  selectedFacets,
  toggleFacet,
}: {
  facetGroups: Record<string, any>;
  selectedFacets: string[];
  toggleFacet: (id: string) => void;
}) {
  return (
    <Accordion allowsMultipleExpanded className="space-y-3">
      {Object.entries(facetGroups).map(([_, facet]) => {
        const style = getFacetStyle(facet.name);
        const Icon = style.icon;

        return (
          <Accordion.Item
            key={facet.id}
            className="rounded-lg border border-border bg-background overflow-hidden"
          >
            {/* Header del grupo */}
            <Accordion.Heading>
              <Accordion.Trigger className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-bold text-foreground">
                <span className="flex items-center gap-2">
                  <Icon size={16} style={{ color: style.color }} />
                  {facet.name}
                </span>
                <Accordion.Indicator className="text-foreground/50" fill="currentColor">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16">
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06"
                      clipRule="evenodd"
                    />
                  </svg>
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>

            {/* Opciones */}
            <Accordion.Panel className="pb-1">
              {facet.values.map((value: any, idx: number) => {
                const isSelected = selectedFacets.includes(value.id);

                return (
                  <Accordion.Body key={value.id}>
                    <button
                      onClick={() => toggleFacet(value.id)}
                      className={`
                        w-full flex items-center justify-between
                        px-3 py-0.5 text-sm transition-all duration-150 cursor-pointer
                        ${idx !== 0 ? 'border-t border-border/30' : ''}
                        ${isSelected
                          ? 'bg-foreground text-background'
                          : 'text-foreground hover:bg-muted/60'
                        }
                      `}
                    >
                      {/* Nombre + count */}
                      <span className="flex items-center gap-2 font-medium">
                        {/* Barra de color a la izquierda solo cuando está seleccionado */}
                        {isSelected && (
                          <span
                            className="w-1 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: style.color }}
                          />
                        )}
                        {value.name}
                        <span className={`text-xs ${isSelected ? 'opacity-60' : 'text-muted-foreground'}`}>
                          ({value.count})
                        </span>
                      </span>

                      {/* Check cuando está seleccionado */}
                      {isSelected && (
                        <Check size={14} style={{ color: style.color }} strokeWidth={2.5} />
                      )}
                    </button>
                  </Accordion.Body>
                );
              })}
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}
