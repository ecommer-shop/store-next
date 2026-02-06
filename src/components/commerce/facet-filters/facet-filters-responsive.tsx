import { Accordion, Checkbox, Label } from "@heroui/react";

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
    <Accordion allowsMultipleExpanded className="space-y-1">
      {Object.entries(facetGroups).map(([_, facet]) => (
        <Accordion.Item key={facet.id} className="space-y-1">
          <Accordion.Heading>
            <Accordion.Trigger className="text-foreground">
              {facet.name}
              <Accordion.Indicator className="text-foreground" fill="currentColor">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                  <path
                    className="text-foreground"
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06"
                    clipRule="evenodd"
                  />
                </svg>
              </Accordion.Indicator>
            </Accordion.Trigger>
          </Accordion.Heading>

          <Accordion.Panel className="space-y-2">
            {facet.values.map((value: any) => {
              const isChecked = selectedFacets.includes(value.id);

              return (
                <Accordion.Body key={value.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={value.id}
                    isSelected={isChecked}
                    onChange={() => toggleFacet(value.id)}
                  >
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Content>
                      <Label
                        htmlFor={value.id}
                        className="text-sm font-normal cursor-pointer flex items-center gap-2"
                      >
                        {value.name}
                        <span className="text-xs text-muted-foreground">
                          ({value.count})
                        </span>
                      </Label>
                    </Checkbox.Content>
                  </Checkbox>
                </Accordion.Body>
              );
            })}
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
