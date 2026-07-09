'use client';

import { useState } from 'react';
import { Tag, TagGroup } from '@heroui/react';
import { getFacetStyle } from './facet-config';

interface FacetValue {
    id: string;
    name: string;
    count: number;
}

interface FacetGroupData {
    id: string;
    name: string;
    values: FacetValue[];
}

interface FacetFiltersMobileProps {
    facetGroups: Record<string, FacetGroupData>;
    selectedFacets: string[];
    toggleFacet: (id: string) => void;
}

export function FacetFiltersMobile({
    facetGroups,
    selectedFacets,
    toggleFacet,
}: FacetFiltersMobileProps) {
    const groups = Object.values(facetGroups);

    if (groups.length === 0) return null;

    const [activeTab, setActiveTab] = useState<string>(groups[0]?.id ?? '');
    const activeGroup = groups.find(g => g.id === activeTab) ?? groups[0];

    return (
        <div className="space-y-3">
            {/* Tab headers — grid para distribuir uniformemente de borde a borde */}
            <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: `repeat(${groups.length}, 1fr)` }}
            >
                {groups.map((group) => {
                    const style = getFacetStyle(group.name);
                    const Icon = style.icon;
                    const isActive = activeTab === group.id;
                    const selectedCount = group.values.filter(v => selectedFacets.includes(v.id)).length;
                    const hasSelected = selectedCount > 0;

                    return (
                        <button
                            key={group.id}
                            onClick={() => setActiveTab(group.id)}
                            className={`
                                flex flex-col items-center justify-center gap-1
                                py-2 rounded-md border transition-all duration-200
                                text-[11px] font-semibold leading-tight text-center
                                min-w-0
                                ${isActive
                                    ? 'text-white border-transparent shadow-sm'
                                    : 'bg-background dark:bg-white/5 border-border hover:bg-muted'
                                }
                            `}
                            style={
                                isActive
                                    ? { backgroundColor: style.color }
                                    : hasSelected
                                        ? { borderColor: style.color, color: style.color }
                                        : { color: 'var(--foreground)' }
                            }
                        >
                            <Icon size={14} />
                            <span className="truncate w-full px-1">{group.name}</span>
                            {hasSelected && (
                                <span
                                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                                    style={
                                        isActive
                                            ? { backgroundColor: 'rgba(255,255,255,0.3)', color: 'white' }
                                            : { backgroundColor: style.color, color: 'white' }
                                    }
                                >
                                    {selectedCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Panel del grupo activo — tags con scroll horizontal */}
            {activeGroup && (() => {
                const style = getFacetStyle(activeGroup.name);
                return (
                    <div
                        className="overflow-x-auto pb-1"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <TagGroup
                            selectionMode="multiple"
                            selectedKeys={new Set(selectedFacets.filter(id => activeGroup.values.some(v => v.id === id)))}
                            onSelectionChange={(keys) => {
                                const newKeys = new Set(keys as Set<string>);
                                const groupIds = new Set(activeGroup.values.map(v => v.id));
                                const current = selectedFacets.filter(id => groupIds.has(id));
                                current.forEach(id => { if (!newKeys.has(id)) toggleFacet(id); });
                                newKeys.forEach(id => { if (!current.includes(id)) toggleFacet(id); });
                            }}
                            variant="outline"
                        >
                            <TagGroup.List
                                items={activeGroup.values}
                                className="flex gap-2"
                                style={{ flexWrap: 'nowrap' }}
                            >
                                {(value) => {
                                    const isSelected = selectedFacets.includes(value.id);
                                    return (
                                        <Tag
                                            key={value.id}
                                            id={value.id}
                                            className={`
                                                cursor-pointer whitespace-nowrap flex-shrink-0
                                                text-xs font-medium border transition-colors
                                                ${isSelected ? style.tagSelected : style.tagUnselected}
                                            `}
                                        >
                                            {value.name}
                                            <span className={`ml-1 text-[10px] ${isSelected ? 'opacity-80' : 'opacity-60'}`}>
                                                ({value.count})
                                            </span>
                                        </Tag>
                                    );
                                }}
                            </TagGroup.List>
                        </TagGroup>
                    </div>
                );
            })()}
        </div>
    );
}
