'use client';

type TabType = 'discover' | 'my-events' | 'created-events';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; description: string }[] = [
  {
    id: 'discover',
    label: 'Discover',
    description: 'All campus events',
  },
  {
    id: 'my-events',
    label: 'My Events',
    description: 'Events you&apos;re attending',
  },
  {
    id: 'created-events',
    label: 'Created Events',
    description: 'Events you&apos;re organizing',
  },
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="flex flex-col gap-6 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-wrap gap-4 sm:gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`group relative flex flex-col gap-1 transition-colors ${
              activeTab === tab.id
                ? 'text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span className="text-base font-medium">{tab.label}</span>
            {activeTab === tab.id && (
              <span className="absolute -bottom-6 left-0 h-0.5 w-full bg-neutral-900"></span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
